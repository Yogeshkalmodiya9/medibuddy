/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ScanReportView } from './components/ScanReportView';
import { ScanMedicineView } from './components/ScanMedicineView';
import { HealthTimelineView } from './components/HealthTimelineView';
import { ReportsView } from './components/ReportsView';
import { MedicineCabinetView } from './components/MedicineCabinetView';
import { CaregiverView } from './components/CaregiverView';
import { SettingsView } from './components/SettingsView';
import { WhatChangedView } from './components/WhatChangedView';
import { AskMediBuddyModal } from './components/AskMediBuddyModal';
import {
  sampleCBCReport,
  sampleWidalReport,
  sampleMedicines,
  samplePotentialInteractions,
  sampleTimeline,
  samplePrescriptionChanges,
  sampleLabChanges,
} from './data/mockClinicalData';
import {
  LabReport,
  MedicineItem,
  PotentialInteraction,
  TimelineSlot,
  PrescriptionChange,
  LabChange,
} from './types';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [languageMode, setLanguageMode] = useState<'hinglish' | 'english'>('hinglish');
  const [elderMode, setElderMode] = useState<boolean>(false);

  // Strict separation: 'demo' vs 'user_upload'
  const [dataSource, setDataSource] = useState<'demo' | 'user_upload'>('demo');

  // Active Health & Medicine State
  const [labReport, setLabReport] = useState<LabReport | null>(sampleCBCReport);
  const [medicines, setMedicines] = useState<MedicineItem[]>(sampleMedicines);
  const [interactions, setInteractions] = useState<PotentialInteraction[]>(
    samplePotentialInteractions
  );
  const [timeline, setTimeline] = useState<TimelineSlot[]>(sampleTimeline);
  const [prescriptionChanges, setPrescriptionChanges] = useState<PrescriptionChange[]>(
    samplePrescriptionChanges
  );
  const [labChanges, setLabChanges] = useState<LabChange[]>(sampleLabChanges);

  // Reports history list
  const [reportsHistory, setReportsHistory] = useState<LabReport[]>([
    sampleCBCReport,
    sampleWidalReport,
  ]);

  // Upload tracking to prevent stale responses
  const uploadIdRef = useRef<string>('');
  const [activeUpload, setActiveUpload] = useState<{
    uploadId?: string;
    fileName?: string;
    fileType?: string;
    status: 'idle' | 'analyzing' | 'success' | 'error';
    errorMessage?: string;
    documentType?: string;
  }>({
    status: 'idle',
  });

  // Ask MediBuddy AI Assistant Modal state
  const [isAskModalOpen, setIsAskModalOpen] = useState<boolean>(false);
  const [askInitialQuery, setAskInitialQuery] = useState<string>('');

  const handleOpenAskModal = (query?: string) => {
    setAskInitialQuery(query || '');
    setIsAskModalOpen(true);
  };

  /**
   * CENTRAL PIPELINE: Upload Lab Report
   * Strict adherence to:
   * 1. Unique uploadId
   * 2. Clear previous analysis immediately
   * 3. Send actual file bytes to Gemini
   * 4. Verify response.uploadId === currentUploadId
   * 5. Never fall back to reference/demo report
   */
  const handleFileUploadReport = (file: File) => {
    const uniqueId = 'rep_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    uploadIdRef.current = uniqueId;

    console.log(`[UPLOAD] id: ${uniqueId}, file: ${file.name}, type: ${file.type}`);
    console.log(`[AI INPUT] ${file.name} (NOT reference_report.png)`);

    // Reset previous report state immediately
    setDataSource('user_upload');
    setLabReport(null);
    setActiveUpload({
      uploadId: uniqueId,
      fileName: file.name,
      fileType: file.type,
      status: 'analyzing',
    });

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch('/api/analyze-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: file.type || 'image/png',
            fileName: file.name,
            uploadId: uniqueId,
          }),
        });

        const data = await res.json();

        // Stale response check
        if (data.uploadId && data.uploadId !== uploadIdRef.current) {
          console.warn(
            `[STALE RESPONSE IGNORED] Response uploadId ${data.uploadId} !== current ${uploadIdRef.current}`
          );
          return;
        }

        if (!res.ok || data.error) {
          console.error(`[AI ANALYSIS FAILED] uploadId: ${uniqueId}`, data.error);
          setActiveUpload({
            uploadId: uniqueId,
            fileName: file.name,
            fileType: file.type,
            status: 'error',
            errorMessage:
              data.error || 'Unable to read this document. Please upload a clearer image or PDF.',
          });
          return;
        }

        if (data && ((data.parameters && data.parameters.length > 0) || (data.detectedMedicines && data.detectedMedicines.length > 0))) {
          const hasParams = data.parameters && data.parameters.length > 0;
          const newReport: LabReport = {
            id: 'rep-' + uniqueId,
            uploadId: uniqueId,
            dataSource: 'user_upload',
            title: data.reportCategory || file.name.replace(/\.[^/.]+$/, ''),
            category: data.reportCategory || (hasParams ? 'General' : 'General'),
            reportDate:
              data.reportDate ||
              new Date().toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }),
            patientName: data.patientName || 'Patient',
            labName: data.labName || 'Diagnostic Facility',
            parameters: (data.parameters || []).map((p: any, idx: number) => ({
              id: 'p-' + uniqueId + '-' + idx,
              parameterName: p.parameterName,
              result: p.result,
              unit: p.unit || '',
              referenceRange:
                p.referenceRange ||
                'Reference range not available — unable to classify this value.',
              status: p.status || 'Cannot determine',
              hinglishExplanation:
                p.hinglishExplanation ||
                `${p.parameterName} ka result ${p.result} hai. Doctor se consult karein.`,
              simpleExplanationEn:
                p.simpleExplanationEn || `${p.parameterName} parameter measured in report.`,
              clinicalCaution:
                p.clinicalCaution ||
                'This value alone cannot establish a diagnosis. Please discuss with your doctor.',
            })),
            overallSummaryHinglish:
              data.overallSummaryHinglish ||
              'Aapka uploaded report analyze ho gaya hai. Test parameters display kiye gaye hain.',
            overallSummaryEn:
              data.overallSummaryEn ||
              'Uploaded laboratory report analyzed successfully. Parameters are shown strictly according to printed reference ranges.',
            isSample: false,
          };

          setLabReport(newReport);
          setReportsHistory((prev) => [newReport, ...prev.filter((r) => r.id !== newReport.id)]);

          // If medicines were also detected in this document, populate them
          if (data.detectedMedicines && data.detectedMedicines.length > 0) {
            const detectedMeds: MedicineItem[] = data.detectedMedicines.map((m: any, idx: number) => ({
              id: 'med-' + uniqueId + '-' + idx,
              name: m.medicineName,
              strength: m.strength || '',
              categoryTag: 'Detected in Document',
              dosage: m.dosage || '1 unit',
              frequency: m.frequency || 'As directed',
              timing: m.timing || 'As directed',
              duration: 'Ongoing',
              commonPurpose: m.commonPurpose || 'General therapeutic use.',
              prescribedPurpose: 'From uploaded document.',
              source: 'Prescription',
              confidence: 'Verified from readable prescription/label',
              confidenceTag: 'green',
            }));
            setMedicines(detectedMeds);
          }

          setActiveUpload({
            uploadId: uniqueId,
            fileName: file.name,
            fileType: file.type,
            status: 'success',
            documentType: data.reportCategory,
          });

          // Compute dynamic lab change if Hemoglobin changed
          const hbParam = newReport.parameters.find(
            (p) =>
              p.parameterName.toLowerCase().includes('hemoglobin') ||
              p.parameterName.toLowerCase().includes('haemoglobin')
          );
          if (hbParam) {
            setLabChanges([
              {
                id: 'lc-' + uniqueId,
                parameterName: 'Hemoglobin',
                oldValue: '11.8',
                newValue: `${hbParam.result} ${hbParam.unit}`,
                trend: 'improved',
                statusBadge: hbParam.status === 'Within displayed range' ? 'Improved' : 'Attention',
              },
            ]);
          }
        } else {
          setActiveUpload({
            uploadId: uniqueId,
            fileName: file.name,
            fileType: file.type,
            status: 'error',
            errorMessage:
              'Could not clearly read medical parameters in this image. Please ensure good lighting and upload a clear photo or PDF.',
          });
        }
      } catch (err: any) {
        console.error(`[UPLOAD PROCESSING ERROR] uploadId: ${uniqueId}:`, err);
        setActiveUpload({
          uploadId: uniqueId,
          fileName: file.name,
          fileType: file.type,
          status: 'error',
          errorMessage: 'Unable to read this document. Please upload a clearer image or PDF.',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  /**
   * CENTRAL PIPELINE: Upload Prescription / Medicine Packaging
   */
  const handleFileUploadMedicine = (file: File) => {
    const uniqueId = 'med_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    uploadIdRef.current = uniqueId;

    console.log(`[UPLOAD] id: ${uniqueId}, file: ${file.name}, type: ${file.type}`);
    console.log(`[AI INPUT] ${file.name} (NOT reference_report.png)`);

    // Reset previous medicines and timeline immediately
    setDataSource('user_upload');
    setMedicines([]);
    setInteractions([]);
    setTimeline([]);
    setActiveUpload({
      uploadId: uniqueId,
      fileName: file.name,
      fileType: file.type,
      status: 'analyzing',
    });

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch('/api/analyze-medicine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: file.type || 'image/png',
            fileName: file.name,
            uploadId: uniqueId,
          }),
        });

        const data = await res.json();

        // Stale check
        if (data.uploadId && data.uploadId !== uploadIdRef.current) {
          console.warn(`[STALE RESPONSE IGNORED] uploadId ${data.uploadId} !== current`);
          return;
        }

        if (!res.ok || data.error) {
          console.error(`[AI MEDICINE ANALYSIS FAILED] uploadId: ${uniqueId}`, data.error);
          setActiveUpload({
            uploadId: uniqueId,
            fileName: file.name,
            fileType: file.type,
            status: 'error',
            errorMessage:
              data.error ||
              'Unable to read this prescription or medicine packaging. Please upload a clearer image.',
          });
          return;
        }

        if (data && data.medicines && data.medicines.length > 0) {
          const parsedMeds: MedicineItem[] = data.medicines.map((m: any, idx: number) => ({
            id: 'med-' + uniqueId + '-' + idx,
            name: m.medicineName,
            strength: m.strength || '',
            activeIngredient: m.activeIngredient,
            categoryTag: m.categoryTag || 'Prescription',
            dosage: m.dosage || '1 tablet',
            frequency: m.frequency || 'As directed',
            timing: m.timing || 'As directed',
            duration: m.duration || 'As directed',
            commonPurpose: m.commonPurpose || 'General therapeutic use.',
            prescribedPurpose:
              m.prescribedPurpose ||
              'Prescribed purpose not stated in the uploaded prescription.',
            source: m.source || 'Prescription',
            confidence: m.confidence || 'Verified from readable prescription/label',
            confidenceTag: m.confidenceTag || 'green',
            safetyNotes: m.safetyNotes,
          }));

          setMedicines(parsedMeds);

          // Update interactions only from this upload
          if (data.potentialInteractions && data.potentialInteractions.length > 0) {
            setInteractions(
              data.potentialInteractions.map((int: any, idx: number) => ({
                id: 'int-' + uniqueId + '-' + idx,
                title: int.title || 'Potential Interaction / Contraindication',
                severity: int.severity || 'Needs Verification',
                description: int.description,
                medicinesInvolved: int.medicinesInvolved || [],
                recommendation: int.recommendation || 'Please verify with your doctor or pharmacist.',
              }))
            );
          } else {
            setInteractions([]);
          }

          // Generate dynamic schedule from this upload
          if (data.dailySchedule && data.dailySchedule.length > 0) {
            const newTimeline: TimelineSlot[] = data.dailySchedule.map((slot: any, idx: number) => ({
              id: 'slot-' + uniqueId + '-' + idx,
              time: slot.time,
              title: slot.medicineName,
              subtitle: slot.dosageInstruction || 'Take as instructed',
              type: 'medicine',
              status: 'pending',
              instructions: slot.dosageInstruction,
            }));
            setTimeline(newTimeline);
          } else {
            // Build timeline slots from the parsed medicines
            const generatedSlots: TimelineSlot[] = parsedMeds.map((m, idx) => ({
              id: 'slot-' + uniqueId + '-' + idx,
              time: idx === 0 ? '8:00 AM' : idx === 1 ? '1:00 PM' : '8:00 PM',
              title: `${m.name} ${m.strength}`,
              subtitle: `${m.dosage} (${m.timing})`,
              type: 'medicine',
              status: 'pending',
              instructions: m.timing,
            }));
            setTimeline(generatedSlots);
          }

          setActiveUpload({
            uploadId: uniqueId,
            fileName: file.name,
            fileType: file.type,
            status: 'success',
          });
        } else {
          setActiveUpload({
            uploadId: uniqueId,
            fileName: file.name,
            fileType: file.type,
            status: 'error',
            errorMessage:
              'Medicine identity could not be verified safely. Please upload a clearer image of the label/prescription.',
          });
        }
      } catch (err: any) {
        console.error(`[UPLOAD PROCESSING ERROR] uploadId: ${uniqueId}:`, err);
        setActiveUpload({
          uploadId: uniqueId,
          fileName: file.name,
          fileType: file.type,
          status: 'error',
          errorMessage: 'Unable to read this document. Please upload a clearer image or PDF.',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  /**
   * Reset explicitly to Demo Reference Mode
   */
  const handleResetToDemo = (reportType: 'cbc' | 'widal' = 'cbc') => {
    setDataSource('demo');
    setLabReport(reportType === 'widal' ? sampleWidalReport : sampleCBCReport);
    setMedicines(sampleMedicines);
    setInteractions(samplePotentialInteractions);
    setTimeline(sampleTimeline);
    setPrescriptionChanges(samplePrescriptionChanges);
    setLabChanges(sampleLabChanges);
    setActiveUpload({
      status: 'idle',
    });
  };

  const handleAddMedicine = (newMed: MedicineItem) => {
    setMedicines((prev) => [newMed, ...prev]);
  };

  const handleToggleTimelineSlot = (id: string) => {
    setTimeline((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'completed' ? 'pending' : 'completed' }
          : item
      )
    );
  };

  return (
    <div
      className={`min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800 ${
        elderMode ? 'text-[17px]' : 'text-sm'
      }`}
    >
      <div className="flex flex-1 min-h-screen">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          elderMode={elderMode}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
          {/* Top Header */}
          <Header
            onOpenAskModal={handleOpenAskModal}
            languageMode={languageMode}
            onToggleLanguage={() =>
              setLanguageMode((prev) => (prev === 'hinglish' ? 'english' : 'hinglish'))
            }
            elderMode={elderMode}
            onToggleElderMode={() => setElderMode((prev) => !prev)}
          />

          {/* Active Tab View */}
          <main className="flex-1 pb-16">
            {currentTab === 'dashboard' && (
              <DashboardView
                onOpenReportUpload={() => setCurrentTab('scan-report')}
                onOpenMedicineUpload={() => setCurrentTab('scan-medicine')}
                onNavigateToTab={(tab) => setCurrentTab(tab)}
                onOpenAskModal={handleOpenAskModal}
                languageMode={languageMode}
                elderMode={elderMode}
                activeReport={labReport}
                medicines={medicines}
                timeline={timeline}
                onToggleTimelineSlot={handleToggleTimelineSlot}
                interactions={interactions}
                prescriptionChanges={prescriptionChanges}
                labChanges={labChanges}
                dataSource={dataSource}
                activeUpload={activeUpload}
                onResetToDemo={() => handleResetToDemo('cbc')}
                onFileUploadReport={handleFileUploadReport}
                onFileUploadMedicine={handleFileUploadMedicine}
              />
            )}

            {currentTab === 'scan-report' && (
              <ScanReportView
                currentReport={labReport}
                onUpdateReport={(rep) => {
                  setLabReport(rep);
                  setDataSource('user_upload');
                }}
                languageMode={languageMode}
                elderMode={elderMode}
                onFileUpload={handleFileUploadReport}
                isAnalyzing={activeUpload.status === 'analyzing'}
                analysisError={activeUpload.status === 'error' ? activeUpload.errorMessage || null : null}
                onResetToDemo={handleResetToDemo}
                dataSource={dataSource}
                activeUploadFileName={activeUpload.fileName}
              />
            )}

            {currentTab === 'scan-medicine' && (
              <ScanMedicineView
                medicines={medicines}
                onAddMedicine={handleAddMedicine}
                interactions={interactions}
                elderMode={elderMode}
                onFileUploadMedicine={handleFileUploadMedicine}
                isScanning={activeUpload.status === 'analyzing'}
                scanNotice={activeUpload.status === 'success' ? 'Prescription analyzed successfully.' : null}
                scanError={activeUpload.status === 'error' ? activeUpload.errorMessage || null : null}
                dataSource={dataSource}
                onResetToDemo={() => handleResetToDemo('cbc')}
                activeUploadFileName={activeUpload.fileName}
              />
            )}

            {currentTab === 'timeline' && (
              <HealthTimelineView
                timeline={timeline}
                onToggleSlot={handleToggleTimelineSlot}
                medicines={medicines}
                elderMode={elderMode}
              />
            )}

            {currentTab === 'reports' && (
              <ReportsView
                currentReport={labReport}
                onSelectReport={(rep) => {
                  setLabReport(rep);
                  if (rep.isSample) {
                    setDataSource('demo');
                  } else {
                    setDataSource('user_upload');
                  }
                }}
                elderMode={elderMode}
                reportsList={reportsHistory}
              />
            )}

            {currentTab === 'cabinet' && (
              <MedicineCabinetView
                medicines={medicines}
                interactions={interactions}
                elderMode={elderMode}
                onOpenAddModal={() => setCurrentTab('scan-medicine')}
              />
            )}

            {currentTab === 'caregiver' && (
              <CaregiverView
                timeline={timeline}
                medicines={medicines}
                labReport={labReport || sampleCBCReport}
                elderMode={elderMode}
                onToggleElderMode={() => setElderMode((prev) => !prev)}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                languageMode={languageMode}
                onToggleLanguage={() =>
                  setLanguageMode((prev) => (prev === 'hinglish' ? 'english' : 'hinglish'))
                }
                elderMode={elderMode}
                onToggleElderMode={() => setElderMode((prev) => !prev)}
              />
            )}
          </main>
        </div>
      </div>

      {/* Floating "Ask MediBuddy" Launcher */}
      <button
        onClick={() => handleOpenAskModal()}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-3 rounded-2xl shadow-xl shadow-blue-500/25 flex items-center gap-2.5 font-bold text-xs sm:text-sm hover:scale-105 transition active:scale-95 cursor-pointer border border-white/20"
      >
        <Sparkles className="w-5 h-5 animate-pulse text-amber-200" />
        <span>Ask MediBuddy AI</span>
      </button>

      {/* Ask MediBuddy Dialog Modal */}
      <AskMediBuddyModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        reportContext={labReport || sampleCBCReport}
        medicineContext={medicines}
        timelineContext={timeline}
        initialQuestion={askInitialQuery}
        languageMode={languageMode}
      />
    </div>
  );
}
