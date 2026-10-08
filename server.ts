import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ extended: true, limit: '35mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System safety prompt for MediBuddy
const MEDIBUDDY_SAFETY_SYSTEM_PROMPT = `
You are "MediBuddy" - a healthcare report and prescription understanding assistant.
TAGLINE: "Understand Your Health. Simply. Safely."

CRITICAL SAFETY & MEDICAL PRINCIPLES:
1. You are NOT an AI doctor. You must NEVER diagnose diseases or prescribe, change, stop, or recommend medicines.
2. Never fabricate medical values, reference ranges, or medicine names.
3. Prioritize reference ranges printed on the user's uploaded report. Never invent a reference range. If no reference range is provided, state "Reference range not available — unable to classify this value" and mark status as "Cannot determine".
4. Provide simple, warm Hinglish (Hindi + English) explanations so an ordinary patient or elderly family member can easily understand technical jargon.
   Example: "Haemoglobin blood mein oxygen carry karne wala protein hota hai. Is report ke according aapka haemoglobin displayed reference range ke andar hai."
5. Never diagnose a condition like "You have anemia" or "You have typhoid". Instead say:
   "Your haemoglobin is below the reference range shown on this report. This can have multiple causes and should be discussed with a qualified healthcare professional."
   Always use cautious language: "may be associated with", "can have multiple causes", "this result alone cannot establish a diagnosis", "please discuss with your doctor".
6. CRITICAL MEDICINE SAFETY RULE: Never guess a medicine from pill color, shape, or blurry images. Confident identification requires readable packaging, label, or prescription.
7. Distinguish between medicine identification, common therapeutic use ("Paracetamol is commonly used for fever and pain"), and patient's actual prescribed reason. Never claim "This medicine is definitely for your fever" unless explicitly written on the prescription.
8. Potential interactions must be framed cautiously: "⚠️ Potential interaction detected. Two medicines may interact according to available medication information. Please verify with your doctor or pharmacist before making any changes." Never say "Stop this medicine".
9. For emergency symptoms, instruct the user to seek immediate emergency medical care.
10. Always append or maintain the disclaimer: MediBuddy does not provide a diagnosis, prescribe treatment, or replace a doctor or pharmacist.
`;

/**
 * Robust fallback caller that tries gemini-3.8-flash, and if unavailable (e.g. 503 spike),
 * retries with gemini-flash-latest and gemini-3.1-flash-lite.
 */
async function callGeminiVision(
  genAiClient: GoogleGenAI,
  parts: any[],
  systemInstruction: string
) {
  const models = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of models) {
    try {
      console.log(`[AI ATTEMPT] Calling ${model}...`);
      const response = await genAiClient.models.generateContent({
        model,
        contents: { parts },
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });
      console.log(`[AI SUCCESS] Completed successfully with ${model}`);
      return response;
    } catch (err: any) {
      console.warn(`[AI ATTEMPT FAILED] ${model}: ${err?.message || err}`);
      lastError = err;
      // Continue to next model on high demand or temporary failure
    }
  }
  throw lastError;
}

function cleanBase64Data(raw: string): string {
  if (!raw) return '';
  let str = raw;
  if (str.includes(',')) {
    str = str.split(',')[1];
  }
  return str.replace(/[\r\n\s]/g, '');
}

function normalizeMimeType(mime?: string): string {
  if (!mime) return 'image/jpeg';
  let m = mime.toLowerCase().trim();
  if (m === 'image/jpg') return 'image/jpeg';
  if (m.startsWith('image/') || m === 'application/pdf') return m;
  return 'image/jpeg';
}

// API route: Analyze Lab Report & General Medical Documents
app.post('/api/analyze-report', async (req, res) => {
  const {
    imageBase64,
    mimeType = 'image/jpeg',
    fileName = 'document.png',
    uploadId = String(Date.now()),
    reportText,
  } = req.body;

  const startTime = Date.now();
  console.log(`[UPLOAD] id: ${uploadId}, file: ${fileName}, type: ${mimeType}`);
  console.log(`[AI INPUT] Processing actual file: ${fileName}`);

  if (!imageBase64 && !reportText) {
    return res.status(400).json({
      error: 'Unable to read this document. No file content provided.',
      uploadId,
    });
  }

  if (!ai) {
    return res.status(503).json({
      error: 'Gemini API is not configured on the server. Please check GEMINI_API_KEY.',
      uploadId,
    });
  }

  try {
    const prompt = `
You are an expert healthcare document reading system.
Analyze this user-uploaded medical image / laboratory report / prescription / document.
File Name: ${fileName}
Upload ID: ${uploadId}
${reportText ? `Text context: ${reportText}` : ''}

INSTRUCTIONS:
1. Carefully perform OCR and document understanding on this specific uploaded file.
2. If this is a Laboratory Report (e.g. CBC, Widal, Blood Sugar / Glucose, Lipid Profile, LFT, KFT, Thyroid, Urine, etc.):
   - Detect reportCategory (e.g. "Complete Blood Count (CBC)", "Widal Test", "Lipid Profile", "Liver Function Test (LFT)", "Blood Sugar (Fasting)", "Thyroid Profile", or "General Laboratory Report")
   - Extract patientName, reportDate, and labName if visible.
   - Extract every test parameter printed in the document:
     * parameterName: exact test name
     * result: numerical or qualitative result
     * unit: unit of measurement
     * referenceRange: exact reference range printed on report. If none is printed, use "Reference range not available — unable to classify this value."
     * status: "Within displayed range" | "Above displayed range" | "Below displayed range" | "Cannot determine"
     * hinglishExplanation: 1-2 sentence simple Hinglish (Hindi + English) explanation of what this test measures and what this value means.
     * simpleExplanationEn: Simple plain English explanation.
     * clinicalCaution: "This result alone cannot establish a diagnosis. Please discuss with your doctor."
3. If this document contains Medicines or Prescriptions rather than lab tests:
   - Set reportCategory to "Doctor Prescription / Medication Slip"
   - Extract any parameters or vitals if present (like BP, Pulse, Weight, Blood Sugar)
   - Include any detected medicines in "detectedMedicines" array.
4. If this image contains general health information, outpatient notes, or hospital slips:
   - Extract all visible clinical parameters, vitals, or findings with high tolerance.
5. Provide:
   - overallSummaryHinglish: 2-3 sentence simple, friendly Hinglish summary of findings.
   - overallSummaryEn: 2-3 sentence clear, cautious English summary.

Respond ONLY with valid JSON matching this schema:
{
  "uploadId": "${uploadId}",
  "patientName": string | null,
  "reportDate": string | null,
  "labName": string | null,
  "reportCategory": string,
  "parameters": [
    {
      "parameterName": string,
      "result": string,
      "unit": string,
      "referenceRange": string,
      "status": "Within displayed range" | "Above displayed range" | "Below displayed range" | "Cannot determine",
      "hinglishExplanation": string,
      "simpleExplanationEn": string,
      "clinicalCaution": string
    }
  ],
  "detectedMedicines": [
    {
      "medicineName": string,
      "strength": string,
      "dosage": string,
      "frequency": string,
      "timing": string,
      "commonPurpose": string
    }
  ],
  "overallSummaryHinglish": string,
  "overallSummaryEn": string,
  "flags": {
    "withinRangeCount": number,
    "outsideRangeCount": number,
    "cannotDetermineCount": number
  }
}
`;

    const parts: any[] = [];
    if (imageBase64) {
      const cleanData = cleanBase64Data(imageBase64);
      const cleanMime = normalizeMimeType(mimeType);
      parts.push({
        inlineData: {
          mimeType: cleanMime,
          data: cleanData,
        },
      });
    }
    parts.push({ text: prompt });

    const response = await callGeminiVision(ai, parts, MEDIBUDDY_SAFETY_SYSTEM_PROMPT);
    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    parsed.uploadId = uploadId;
    parsed.fileName = fileName;
    parsed.processingDurationMs = Date.now() - startTime;

    // Ensure parameters array exists
    if (!parsed.parameters) {
      parsed.parameters = [];
    }

    console.log(
      `[AI LAB REPORT DONE] uploadId: ${uploadId}, parameters extracted: ${parsed.parameters.length}, category: ${parsed.reportCategory}`
    );

    return res.json(parsed);
  } catch (error: any) {
    console.error(`[AI ERROR] uploadId: ${uploadId}:`, error);
    return res.status(500).json({
      error:
        'Unable to read this document. Please ensure the image is clear and well-lit, or upload a PDF.',
      uploadId,
      details: error?.message,
    });
  }
});

// API route: Analyze Prescription / Medicine Packaging
app.post('/api/analyze-medicine', async (req, res) => {
  const {
    imageBase64,
    mimeType = 'image/jpeg',
    fileName = 'medicine.png',
    uploadId = String(Date.now()),
    prescriptionText,
    userAllergies = [],
  } = req.body;

  const startTime = Date.now();
  console.log(`[UPLOAD] id: ${uploadId}, file: ${fileName}, type: ${mimeType}`);
  console.log(`[AI INPUT] Processing medicine file: ${fileName}`);

  if (!imageBase64 && !prescriptionText) {
    return res.status(400).json({
      error: 'Unable to read this document. No file content provided.',
      uploadId,
    });
  }

  if (!ai) {
    return res.status(503).json({
      error: 'Gemini API is not configured on the server. Please check GEMINI_API_KEY.',
      uploadId,
    });
  }

  try {
    const prompt = `
Analyze this user-uploaded medicine packaging, strip, bottle, or prescription image.
File Name: ${fileName}
Upload ID: ${uploadId}
Known User Allergies: ${JSON.stringify(userAllergies)}
${prescriptionText ? `Context: ${prescriptionText}` : ''}

CRITICAL RULES:
1. Analyze what is visible in this uploaded image.
2. NEVER guess a medicine from pill color or shape alone.
3. If packaging text or prescription writing can be read:
   - Extract brand name / medicine name
   - Strength (e.g. "500 mg", "40 mg", "10 ml")
   - Active generic ingredient if visible
   - Dosage (e.g. "1 tablet", "5 ml")
   - Frequency (e.g. "1-0-1", "Twice daily", "Every 8 hours", "As needed")
   - Timing (e.g. "Before breakfast", "After food", "At bedtime")
   - Duration (e.g. "5 days", "Ongoing")
   - Common therapeutic purpose (e.g. "Commonly used for fever and pain relief")
   - Prescribed purpose (if written on prescription, otherwise "Prescribed purpose not stated in the uploaded prescription.")
   - Source: "Prescription" | "Medicine Strip" | "Label" | "Packaging"
   - Confidence: "Verified from readable prescription/label" | "Partially verified" | "Cannot safely identify"
   - ConfidenceTag: "green" | "yellow" | "red"
   - SafetyNotes: any essential usage or storage advice
4. If image is a lab report or contains health tests rather than medicines:
   - Extract any test parameters visible as well.
5. If completely unreadable:
   - Add a medicine entry with name "Unverified Medicine", confidence "Cannot safely identify", confidenceTag "red", safetyNotes "⚠️ Medicine identity could not be verified safely. Please upload a clearer image of the label/prescription or verify with a pharmacist."
6. Analyze potential interactions between detected medicines only.
7. Generate daily schedule slots from the instructions.

Respond ONLY with valid JSON:
{
  "uploadId": "${uploadId}",
  "doctorName": string | null,
  "prescriptionDate": string | null,
  "medicines": [
    {
      "medicineName": string,
      "strength": string,
      "activeIngredient": string,
      "dosage": string,
      "frequency": string,
      "timing": string,
      "duration": string,
      "route": string,
      "commonPurpose": string,
      "prescribedPurpose": string,
      "source": "Prescription" | "Medicine Strip" | "Label" | "Uncertain",
      "confidence": "Verified from readable prescription/label" | "Partially verified" | "Cannot safely identify",
      "confidenceTag": "green" | "yellow" | "red",
      "safetyNotes": string
    }
  ],
  "potentialInteractions": [
    {
      "title": string,
      "severity": "Needs Verification" | "Attention" | "Info",
      "description": string,
      "recommendation": string
    }
  ],
  "dailySchedule": [
    {
      "time": string,
      "medicineName": string,
      "dosageInstruction": string,
      "timingCategory": "Morning" | "Afternoon" | "Evening" | "Night" | "As needed"
    }
  ]
}
`;

    const parts: any[] = [];
    if (imageBase64) {
      const cleanData = cleanBase64Data(imageBase64);
      const cleanMime = normalizeMimeType(mimeType);
      parts.push({
        inlineData: {
          mimeType: cleanMime,
          data: cleanData,
        },
      });
    }
    parts.push({ text: prompt });

    const response = await callGeminiVision(ai, parts, MEDIBUDDY_SAFETY_SYSTEM_PROMPT);
    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    parsed.uploadId = uploadId;
    parsed.fileName = fileName;
    parsed.processingDurationMs = Date.now() - startTime;

    if (!parsed.medicines) {
      parsed.medicines = [];
    }

    console.log(
      `[AI MEDICINE DONE] uploadId: ${uploadId}, medicines extracted: ${parsed.medicines.length}`
    );

    return res.json(parsed);
  } catch (error: any) {
    console.error(`[AI ERROR] uploadId: ${uploadId}:`, error);
    return res.status(500).json({
      error:
        'Unable to read this medicine image or prescription. Please ensure the label is clearly visible and well-lit.',
      uploadId,
      details: error?.message,
    });
  }
});

// API route: Compare Old and New Prescription ("What Changed?")
app.post('/api/compare-prescriptions', async (req, res) => {
  try {
    const { oldPrescription, newPrescription } = req.body;

    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key not configured on server.' });
    }

    const prompt = `
Compare this OLD prescription with the NEW prescription.
OLD PRESCRIPTION:
${JSON.stringify(oldPrescription, null, 2)}

NEW PRESCRIPTION:
${JSON.stringify(newPrescription, null, 2)}

Detect and highlight changes without judging whether the change is medically right or wrong:
- New medicine added (green)
- Dose changed (orange/amber, e.g. "500 mg → 650 mg" or "1-0-1 → 1-0-1-1")
- Medicine removed (red)
- Frequency changed (blue)
- Duration changed (purple)

Generate:
- changesList: array of:
  - type: "new" | "dose_changed" | "removed" | "frequency_changed" | "duration_changed"
  - medicineName: string
  - changeDescription: string
  - oldDetail: string
  - newDetail: string
  - safeGuidance: "Prescription change detected. Please follow the latest prescription and verify any unexpected change with your healthcare professional."
- summaryHinglish: 2 sentence Hinglish summary of the changes.

Return ONLY valid JSON.
`;

    const response = await callGeminiVision(ai, [{ text: prompt }], MEDIBUDDY_SAFETY_SYSTEM_PROMPT);
    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error comparing prescriptions:', error);
    return res.status(500).json({ error: error.message });
  }
});

// API route: "Ask MediBuddy" Conversational Assistant
app.post('/api/ask', async (req, res) => {
  try {
    const {
      question,
      reportContext,
      medicineContext,
      history = [],
      language = 'hinglish',
    } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key not configured.',
        answer:
          'Gemini API key is not configured. Please ensure GEMINI_API_KEY is available in your environment.',
      });
    }

    const prompt = `
User Question: "${question}"
Preferred Language/Style: ${
      language === 'hinglish'
        ? 'Warm, conversational Hinglish (Hindi + English) mixed naturally'
        : 'Clear plain English with zero jargon'
    }.

CURRENT PATIENT CONTEXT:
Latest Lab Report Data:
${JSON.stringify(reportContext, null, 2)}

Current Medicines & Prescriptions:
${JSON.stringify(medicineContext, null, 2)}

Recent Conversation History:
${JSON.stringify(history, null, 2)}

INSTRUCTIONS:
1. Answer the user's question directly, clearly, and empathetically using the context provided.
2. If asked about a lab test parameter (like WBC, Hemoglobin, Platelets, Widal, etc.):
   - Explain what it does in simple terms.
   - Explain what the patient's specific value means relative to the displayed reference range on their report.
   - Emphasize that clinical evaluation requires doctor consultation.
3. If asked about a medicine:
   - State common therapeutic use clearly.
   - Mention prescribed instructions if in context.
   - Never say "Take this" or "Stop this".
4. If asked about emergency symptoms (chest pain, severe shortness of breath, sudden weakness, etc.):
   - Instruct the user to immediately contact emergency medical services or visit the nearest hospital.
5. NEVER fabricate values or prescribe treatments.
6. Provide an accurate, comforting, clear answer.

Output format:
Respond in JSON:
{
  "answer": string,
  "keyTakeaways": [string],
  "questionsToAskDoctor": [string]
}
`;

    const response = await callGeminiVision(ai, [{ text: prompt }], MEDIBUDDY_SAFETY_SYSTEM_PROMPT);
    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error answering question:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Mount Vite in development or serve static build in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MediBuddy Server running on port ${PORT}`);
  });
}

startServer();
