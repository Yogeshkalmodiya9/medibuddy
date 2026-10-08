import {
  LabReport,
  MedicineItem,
  PotentialInteraction,
  TimelineSlot,
  PrescriptionChange,
  LabChange,
  HealthMetric,
} from '../types';

export const sampleCBCReport: LabReport = {
  id: 'rep-cbc-001',
  title: 'Complete Blood Count (CBC)',
  category: 'Complete Blood Count (CBC)',
  reportDate: '17 Aug 2026',
  patientName: 'Riya Dixit',
  patientAgeGender: '24 Y / Female',
  labName: 'Apex Diagnostic Care & PathLabs',
  doctorName: 'Dr. S. K. Verma, MD (Gen Med)',
  isSample: true,
  overallSummaryHinglish:
    'Aapki CBC report ke major parameters jaise Hemoglobin, WBC count aur Platelets displayed reference range ke andar hain. Overall blood count normal lag raha hai.',
  overallSummaryEn:
    'All major CBC parameters including Hemoglobin, White Blood Cells, and Platelet counts fall within the reference ranges printed on this laboratory report. Clinical correlation with your physician is always advised.',
  parameters: [
    {
      id: 'p1',
      parameterName: 'Hemoglobin',
      result: '12.3',
      unit: 'g/dL',
      referenceRange: '12 – 16 g/dL',
      status: 'Within displayed range',
      hinglishExplanation:
        'Haemoglobin blood mein oxygen carry karne wala protein hota hai. Is report ke according aapka haemoglobin displayed reference range ke andar hai.',
      simpleExplanationEn:
        'Hemoglobin is the red protein in blood that carries oxygen from your lungs to the rest of your body.',
      clinicalCaution:
        'Normal hemoglobin values support adequate tissue oxygenation. Values should always be reviewed alongside clinical symptoms.',
      isImportant: true,
    },
    {
      id: 'p2',
      parameterName: 'Total WBC Count',
      result: '9200',
      unit: '/µL',
      referenceRange: '4000 – 12000 /µL',
      status: 'Within displayed range',
      hinglishExplanation:
        'WBC ka full form White Blood Cells hai. Ye body ke immune system ka part hote hain aur infections se fight karne mein help karte hain. Aapka count normal range mein hai.',
      simpleExplanationEn:
        'White blood cells are part of your immune system that protect your body against infections and illness.',
      clinicalCaution:
        'A normal WBC count indicates no obvious active immune flare at this test time.',
      isImportant: true,
    },
    {
      id: 'p3',
      parameterName: 'Platelets Count',
      result: '3.23',
      unit: 'lakh/µL',
      referenceRange: '1.5 – 4.5 lakh/µL',
      status: 'Within displayed range',
      hinglishExplanation:
        'Platelets blood clot banakar bleeding rokne mein help karte hain. Aapka count 3.23 lakh hai jo bilkul safe reference range mein hai.',
      simpleExplanationEn:
        'Platelets are tiny blood cells that help your body form clots to stop bleeding when you get a cut or injury.',
      clinicalCaution:
        'Platelet count within printed reference range indicates normal clot-forming cell concentration.',
      isImportant: true,
    },
    {
      id: 'p4',
      parameterName: 'RBC Count',
      result: '4.50',
      unit: 'mil/µL',
      referenceRange: '3.8 – 4.8 mil/µL',
      status: 'Within displayed range',
      hinglishExplanation:
        'RBC (Red Blood Cells) oxygen aur nutrients carry karte hain. Ye value reference interval ke andar hai.',
      simpleExplanationEn:
        'Red blood cells carry oxygen throughout the body. Your count is within normal limits.',
    },
    {
      id: 'p5',
      parameterName: 'PCV / Hematocrit',
      result: '38.2',
      unit: '%',
      referenceRange: '36 – 46 %',
      status: 'Within displayed range',
      hinglishExplanation:
        'PCV blood mein red cells ka proportion batata hai. Ye 38.2% hai jo standard range ke andar hai.',
      simpleExplanationEn:
        'Packed cell volume measures the percentage of your blood made up of red blood cells.',
    },
    {
      id: 'p6',
      parameterName: 'MCV',
      result: '84.9',
      unit: 'fL',
      referenceRange: '80 – 100 fL',
      status: 'Within displayed range',
      hinglishExplanation:
        'MCV red blood cells ka average size batata hai. Aapka value normal size range mein hai.',
      simpleExplanationEn:
        'Mean corpuscular volume reflects the average size of your red blood cells.',
    },
    {
      id: 'p7',
      parameterName: 'MCH',
      result: '27.3',
      unit: 'pg',
      referenceRange: '27 – 32 pg',
      status: 'Within displayed range',
      hinglishExplanation:
        'MCH har red blood cell mein hemoglobin ki average amount batata hai. Ye range ke andar hai.',
      simpleExplanationEn:
        'Mean corpuscular hemoglobin measures the average amount of hemoglobin inside a red cell.',
    },
    {
      id: 'p8',
      parameterName: 'MCHC',
      result: '32.2',
      unit: 'g/dL',
      referenceRange: '31.5 – 34.5 g/dL',
      status: 'Within displayed range',
      hinglishExplanation:
        'MCHC red cells mein hemoglobin concentration batata hai. Normal reference range ke mutabik hai.',
      simpleExplanationEn:
        'MCHC checks the average concentration of hemoglobin in a given volume of red blood cells.',
    },
    {
      id: 'p9',
      parameterName: 'RDW-CV',
      result: '13.1',
      unit: '%',
      referenceRange: '11.5 – 14.5 %',
      status: 'Within displayed range',
      hinglishExplanation:
        'RDW red blood cells ke size variation ko measure karta hai. Ye normal limit mein hai.',
      simpleExplanationEn:
        'RDW measures variation in red blood cell volume or size.',
    },
    {
      id: 'p10',
      parameterName: 'Neutrophils',
      result: '64',
      unit: '%',
      referenceRange: '40 – 80 %',
      status: 'Within displayed range',
      hinglishExplanation:
        'Neutrophils bacterial infections se bachane wale primary white blood cells hain. Ye range ke andar hai.',
      simpleExplanationEn:
        'The most common type of white blood cell, helping fight off bacterial infections.',
    },
    {
      id: 'p11',
      parameterName: 'Lymphocytes',
      result: '28',
      unit: '%',
      referenceRange: '20 – 40 %',
      status: 'Within displayed range',
      hinglishExplanation:
        'Lymphocytes viral infections aur long-term immunity mein help karte hain. Count reference range ke mutabik hai.',
      simpleExplanationEn:
        'Immune cells involved in fighting viral infections and antibody production.',
    },
    {
      id: 'p12',
      parameterName: 'Monocytes',
      result: '5',
      unit: '%',
      referenceRange: '2 – 10 %',
      status: 'Within displayed range',
      hinglishExplanation:
        'Monocytes dead cells aur foreign particles ko clean karte hain. Safe range mein hai.',
      simpleExplanationEn:
        'White blood cells that help remove foreign material and dead cells.',
    },
    {
      id: 'p13',
      parameterName: 'Eosinophils',
      result: '2',
      unit: '%',
      referenceRange: '1 – 6 %',
      status: 'Within displayed range',
      hinglishExplanation:
        'Eosinophils allergies aur parasite defense mein active hote hain. Value normal hai.',
      simpleExplanationEn:
        'White blood cells that fight multicellular parasites and manage allergic responses.',
    },
    {
      id: 'p14',
      parameterName: 'Basophils',
      result: '1',
      unit: '%',
      referenceRange: '0 – 2 %',
      status: 'Within displayed range',
      hinglishExplanation:
        'Basophils inflammation response aur histamine release mein part lete hain. Normal range mein hai.',
      simpleExplanationEn:
        'Cells that participate in inflammatory reactions.',
    },
  ],
};

export const sampleWidalReport: LabReport = {
  id: 'rep-widal-002',
  title: 'Widal Agglutination Tube Test',
  category: 'Widal Test',
  reportDate: '17 Aug 2026',
  patientName: 'Riya Dixit',
  patientAgeGender: '24 Y / Female',
  labName: 'Apex Diagnostic Care & PathLabs',
  doctorName: 'Dr. S. K. Verma, MD',
  isSample: true,
  overallSummaryHinglish:
    'Widal test antibodies check karta hai. Dono S. Typhi O aur H titers 1:80 par hain, jo lab ke standard cutoff (1:160) se kam hain. Clinical interpretation ke liye doctor se consult karein.',
  overallSummaryEn:
    'Widal test measures antibody titers against Salmonella serotypes. Titers are 1:80, which are below the diagnostic threshold (1:160) reported by the laboratory. Diagnosis requires clinical history and doctor correlation.',
  parameters: [
    {
      id: 'w1',
      parameterName: 'S. Typhi "O" Ag',
      result: '1:80',
      unit: 'titer',
      referenceRange: '< 1:160',
      status: 'Within displayed range',
      hinglishExplanation:
        'S. Typhi "O" antibody titer 1:80 report par diye gaye reference range (< 1:160) ke andar hai.',
      simpleExplanationEn:
        'Somatic (O) antibody titer against Salmonella Typhi, within typical baseline limits.',
      clinicalCaution:
        'A single titer value cannot diagnose or rule out enteric fever without clinical symptoms.',
    },
    {
      id: 'w2',
      parameterName: 'S. Typhi "H" Ag',
      result: '1:80',
      unit: 'titer',
      referenceRange: '< 1:160',
      status: 'Within displayed range',
      hinglishExplanation:
        'S. Typhi "H" flagellar antibody titer 1:80 hai, jo baseline threshold ke andar hai.',
      simpleExplanationEn:
        'Flagellar (H) antibody titer against Salmonella Typhi, within expected baseline.',
      clinicalCaution:
        'Past immunization or prior exposure can show baseline titers. Please discuss with your doctor.',
    },
    {
      id: 'w3',
      parameterName: 'S. Paratyphi "AH" Ag',
      result: 'Negative',
      unit: 'reaction',
      referenceRange: 'Negative',
      status: 'Within displayed range',
      hinglishExplanation:
        'Paratyphi AH reaction negative hai, jo standard expected result hai.',
      simpleExplanationEn:
        'No significant agglutination reaction detected for Paratyphi AH.',
    },
    {
      id: 'w4',
      parameterName: 'S. Paratyphi "BH" Ag',
      result: 'Negative',
      unit: 'reaction',
      referenceRange: 'Negative',
      status: 'Within displayed range',
      hinglishExplanation:
        'Paratyphi BH reaction bhi negative hai.',
      simpleExplanationEn:
        'No significant agglutination reaction detected for Paratyphi BH.',
    },
  ],
};

export const sampleHealthMetrics: HealthMetric[] = [
  {
    id: 'm1',
    name: 'Hemoglobin',
    value: '12.3',
    unit: 'g/dL',
    referenceRange: '12 – 16 g/dL',
    status: 'Within range',
    statusColor: 'green',
    simpleExplanation: 'Oxygen-carrying protein in blood. Your value is normal.',
    iconType: 'hemoglobin',
  },
  {
    id: 'm2',
    name: 'Total WBC Count',
    value: '9200',
    unit: '/µL',
    referenceRange: '4000 – 12000 /µL',
    status: 'Within range',
    statusColor: 'green',
    simpleExplanation: 'Helps fight infections. Your value is normal.',
    iconType: 'wbc',
  },
  {
    id: 'm3',
    name: 'Platelets',
    value: '3.23',
    unit: 'lakh/µL',
    referenceRange: '1.5 – 4.5 lakh/µL',
    status: 'Within range',
    statusColor: 'green',
    simpleExplanation: 'Helps in blood clotting. Your value is normal.',
    iconType: 'platelets',
  },
  {
    id: 'm4',
    name: 'Body Temperature',
    value: '98.2',
    unit: '°F',
    referenceRange: '97.0 – 99.0 °F',
    status: 'Normal',
    statusColor: 'green',
    simpleExplanation: 'Within normal range.',
    iconType: 'temperature',
  },
  {
    id: 'm5',
    name: 'Blood Pressure',
    value: '118/76',
    unit: 'mmHg',
    referenceRange: '< 120/80 mmHg',
    status: 'Normal',
    statusColor: 'green',
    simpleExplanation: 'A healthy blood pressure range.',
    iconType: 'bloodPressure',
  },
  {
    id: 'm6',
    name: 'Blood Sugar (Fasting)',
    value: '92',
    unit: 'mg/dL',
    referenceRange: '70 – 100 mg/dL',
    status: 'Normal',
    statusColor: 'green',
    simpleExplanation: 'Within normal range.',
    iconType: 'bloodSugar',
  },
];

export const sampleMedicines: MedicineItem[] = [
  {
    id: 'med-01',
    name: 'Paracetamol',
    strength: '500 mg',
    activeIngredient: 'Paracetamol / Acetaminophen',
    categoryTag: 'Fever / Pain',
    dosage: '1 tablet',
    frequency: '3 times a day',
    timing: 'After food, if needed',
    duration: '3 days as needed',
    commonPurpose: 'Usually used for relief of fever and mild-to-moderate pain.',
    prescribedPurpose: 'Prescribed purpose not stated in the uploaded prescription.',
    source: 'Prescription',
    confidence: 'Verified from readable prescription/label',
    confidenceTag: 'green',
    safetyNotes: 'Do not exceed 4000 mg within 24 hours. Check other medicines for hidden paracetamol.',
    takenToday: false,
  },
  {
    id: 'med-02',
    name: 'Amoxicillin',
    strength: '500 mg',
    activeIngredient: 'Amoxicillin Trihydrate',
    categoryTag: 'Antibiotic',
    dosage: '1 tablet',
    frequency: '2 times a day',
    timing: 'After food',
    duration: '5 days course',
    commonPurpose: 'An antibiotic commonly used for treating bacterial infections.',
    prescribedPurpose: 'Prescribed purpose not stated in the uploaded prescription.',
    source: 'Prescription',
    confidence: 'Verified from readable prescription/label',
    confidenceTag: 'green',
    safetyNotes: 'Complete the full 5-day course as instructed by your doctor even if feeling better.',
    takenToday: false,
  },
  {
    id: 'med-03',
    name: 'Pantoprazole',
    strength: '40 mg',
    activeIngredient: 'Pantoprazole Sodium',
    categoryTag: 'Acidity',
    dosage: '1 tablet',
    frequency: 'Once daily',
    timing: 'Before breakfast',
    duration: '5 days',
    commonPurpose: 'Reduces stomach acid; commonly used for acidity or to protect the stomach lining.',
    prescribedPurpose: 'Prescribed purpose not stated in the uploaded prescription.',
    source: 'Prescription',
    confidence: 'Verified from readable prescription/label',
    confidenceTag: 'green',
    safetyNotes: 'Best taken 30 minutes before the morning meal with plain water.',
    takenToday: false,
  },
];

export const samplePotentialInteractions: PotentialInteraction[] = [
  {
    id: 'int-01',
    title: 'Potential Interaction / Contraindication',
    severity: 'Needs Verification',
    description:
      'Amoxicillin and Pantoprazole taken together may reduce the absorption rate or modify stomach acidity required for optimal antibiotic uptake in some cases. Please verify with your doctor or pharmacist.',
    medicinesInvolved: ['Amoxicillin 500 mg', 'Pantoprazole 40 mg'],
    recommendation:
      'Two medicines may interact according to available medication information. Please verify spacing with your doctor or pharmacist before making any changes.',
  },
];

export const sampleTimeline: TimelineSlot[] = [
  {
    id: 't1',
    time: '8:00 AM',
    title: 'Pantoprazole 40 mg',
    subtitle: '1 tablet (Before breakfast)',
    type: 'medicine',
    status: 'pending',
    medicineId: 'med-03',
    instructions: 'Take 30 minutes before morning tea/breakfast with water.',
  },
  {
    id: 't2',
    time: '9:00 AM',
    title: 'Amoxicillin 500 mg',
    subtitle: '1 tablet (After food)',
    type: 'medicine',
    status: 'pending',
    medicineId: 'med-02',
    instructions: 'Take after your breakfast. Do not take on an empty stomach.',
  },
  {
    id: 't3',
    time: '1:00 PM',
    title: 'Lunch',
    subtitle: 'Have a balanced meal',
    type: 'meal',
    status: 'completed',
    instructions: 'Nutritious lunch with vegetables, dal, and roti/rice.',
  },
  {
    id: 't4',
    time: '8:00 PM',
    title: 'Paracetamol 500 mg',
    subtitle: '1 tablet (After food, if needed)',
    type: 'medicine',
    status: 'pending',
    medicineId: 'med-01',
    instructions: 'Only if body ache or fever persists. Must take after food.',
  },
  {
    id: 't5',
    time: 'Throughout Day',
    title: 'Stay Hydrated',
    subtitle: '2–3 litres of water',
    type: 'hydration',
    status: 'pending',
    instructions: 'Drink warm or room temperature fluids at regular intervals.',
  },
];

export const samplePrescriptionChanges: PrescriptionChange[] = [
  {
    id: 'pc1',
    type: 'new',
    title: 'New medicine detected',
    medicineName: 'Pantoprazole 40 mg',
    newValue: '1 tablet before breakfast',
    badge: 'New',
    badgeColor: 'green',
  },
  {
    id: 'pc2',
    type: 'dose_changed',
    title: 'Dose changed',
    medicineName: 'Paracetamol 500 mg',
    oldValue: '1-0-1',
    newValue: '1-0-1-1',
    badge: 'Dose changed',
    badgeColor: 'orange',
  },
];

export const sampleLabChanges: LabChange[] = [
  {
    id: 'lc1',
    parameterName: 'Hemoglobin',
    oldValue: '11.8',
    newValue: '12.3 g/dL',
    trend: 'improved',
    statusBadge: 'Improved',
  },
];
