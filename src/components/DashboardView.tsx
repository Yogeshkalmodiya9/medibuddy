import React, { useState, useRef } from 'react';
import {
  FileText,
  Camera,
  Upload,
  Pill,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Droplets,
  Utensils,
  History,
  Copy,
  Check,
  TrendingUp,
  Activity,
  Heart,
  Thermometer,
  Zap,
  Info,
  ExternalLink,
  Volume2,
  RefreshCw,
} from 'lucide-react';
import {
  sampleCBCReport,
  sampleWidalReport,
  sampleHealthMetrics,
  sampleMedicines,
  samplePotentialInteractions,
  sampleTimeline,
  samplePrescriptionChanges,
  sampleLabChanges,
} from '../data/mockClinicalData';
import {
  TimelineSlot,
  LabReport,
  MedicineItem,
  PotentialInteraction,
  PrescriptionChange,
  LabChange,
  HealthMetric,
} from '../types';
import { deriveHealthMetricsFromReport } from '../utils/healthMetrics';

interface DashboardViewProps {
  onOpenReportUpload: () => void;
  onOpenMedicineUpload: () => void;
  onNavigateToTab: (tab: string) => void;
  onOpenAskModal: (query?: string) => void;
  languageMode: 'hinglish' | 'english';
  elderMode: boolean;
  // Dynamic state props
  activeReport: LabReport | null;
  medicines: MedicineItem[];
  timeline: TimelineSlot[];
  onToggleTimelineSlot: (id: string) => void;
  interactions: PotentialInteraction[];
  prescriptionChanges: PrescriptionChange[];
  labChanges: LabChange[];
  dataSource: 'demo' | 'user_upload';
  activeUpload: {
    uploadId?: string;
    fileName?: string;
    fileType?: string;
    status: 'idle' | 'analyzing' | 'success' | 'error';
    errorMessage?: string;
    documentType?: string;
  };
  onResetToDemo: () => void;
  onFileUploadReport: (file: File) => void;
  onFileUploadMedicine: (file: File) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenReportUpload,
  onOpenMedicineUpload,
  onNavigateToTab,
  onOpenAskModal,
  languageMode,
  elderMode,
  activeReport,
  medicines,
  timeline,
  onToggleTimelineSlot,
  interactions,
  prescriptionChanges,
  labChanges,
  dataSource,
  activeUpload,
  onResetToDemo,
  onFileUploadReport,
  onFileUploadMedicine,
}) => {
  const [activeReportTab, setActiveReportTab] = useState<'cbc' | 'widal' | 'active'>('cbc');
  const [showFullReportDetails, setShowFullReportDetails] = useState(false);
  const [showSimpleExplanation, setShowSimpleExplanation] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [selectedParamExplanation, setSelectedParamExplanation] = useState<any | null>(null);

  const reportFileInputRef = useRef<HTMLInputElement>(null);
  const reportCameraInputRef = useRef<HTMLInputElement>(null);
  const medFileInputRef = useRef<HTMLInputElement>(null);
  const medCameraInputRef = useRef<HTMLInputElement>(null);

  // Determine which report to show (Strict: in user_upload mode, never fallback to demo report)
  const currentReport: LabReport =
    dataSource === 'user_upload'
      ? (activeReport || {
          id: 'analyzing-temp',
          title:
            activeUpload.status === 'analyzing'
              ? `Analyzing: ${activeUpload.fileName || 'document'}...`
              : 'Uploaded Document',
          category: 'General',
          reportDate: new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          patientName: 'Uploaded Document',
          labName: 'Diagnostic Center',
          parameters: [],
          overallSummaryHinglish:
            activeUpload.status === 'analyzing'
              ? 'Aapka document process ho raha hai. AI text aur parameters extract kar raha hai...'
              : activeUpload.errorMessage || 'Report parameter extraction in progress.',
          overallSummaryEn:
            activeUpload.status === 'analyzing'
              ? 'Processing document OCR and structuring medical values...'
              : activeUpload.errorMessage || 'Report parameter extraction in progress.',
          isSample: false,
        })
      : activeReportTab === 'widal'
      ? sampleWidalReport
      : sampleCBCReport;

  // Derive dynamic metrics
  const displayMetrics: HealthMetric[] =
    dataSource === 'user_upload' && activeReport
      ? deriveHealthMetricsFromReport(activeReport)
      : sampleHealthMetrics;

  const handleCopySummary = () => {
    const summaryText =
      currentReport?.overallSummaryEn ||
      "Your clinical values shown here are within the displayed reference intervals. Follow your prescribed medicine schedule and consult your doctor or pharmacist for any concerns.";
    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  // Render metric icon
  const getMetricIcon = (iconType: string) => {
    switch (iconType) {
      case 'hemoglobin':
        return (
          <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
            <Droplets className="w-4 h-4 fill-current" />
          </div>
        );
      case 'wbc':
        return (
          <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
        );
      case 'platelets':
        return (
          <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
        );
      case 'temperature':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <Thermometer className="w-4 h-4" />
          </div>
        );
      case 'bloodPressure':
        return (
          <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
            <Heart className="w-4 h-4 fill-rose-500/20" />
          </div>
        );
      case 'bloodSugar':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
        );
    }
  };

  // Check if Widal items exist in current report
  const widalParams = currentReport?.parameters?.filter(
    (p) =>
      p.parameterName.toLowerCase().includes('typhi') ||
      p.parameterName.toLowerCase().includes('paratyphi') ||
      p.parameterName.toLowerCase().includes('widal')
  ) || [];

  return (
    <div className={`p-4 sm:p-6 space-y-6 max-w-7xl mx-auto ${elderMode ? 'text-base' : 'text-sm'}`}>
      {/* Upload Status / Error / Demo Banner */}
      {activeUpload.status === 'analyzing' && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-blue-800 animate-pulse">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            <span>
              <strong>Analyzing uploaded file:</strong> {activeUpload.fileName} (Upload ID: {activeUpload.uploadId}). Extracting data directly from your file...
            </span>
          </div>
          <span className="font-semibold text-blue-600">Processing...</span>
        </div>
      )}

      {activeUpload.status === 'error' && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>
              <strong>Upload Notice:</strong> {activeUpload.errorMessage || "Unable to read this document. Please upload a clearer image or PDF."}
            </span>
          </div>
          <button
            onClick={onResetToDemo}
            className="text-[11px] underline font-semibold text-rose-900 hover:text-black cursor-pointer"
          >
            Reset to Demo Sample
          </button>
        </div>
      )}

      {dataSource === 'user_upload' && activeUpload.status === 'success' && (
        <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>Live User Data Active:</strong> Displaying data extracted directly from <em>{activeUpload.fileName}</em> (Upload ID: {activeUpload.uploadId}).
            </span>
          </div>
          <button
            onClick={onResetToDemo}
            className="px-2.5 py-1 bg-white hover:bg-emerald-100 border border-emerald-200 rounded-lg text-[11px] font-bold text-emerald-800 transition"
          >
            Switch to Demo Mode
          </button>
        </div>
      )}

      {/* ========================================================
          1. TOP ACTION BANNERS: SCAN LAB REPORT & SCAN MEDICINE
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Banner 1: Scan Lab Report */}
        <div className="bg-gradient-to-br from-blue-50/80 via-white to-sky-50/60 rounded-2xl p-5 border border-blue-200/80 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Scan Lab Report
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-sm">
                Upload or take a photo of your lab report and get simple explanations.
              </p>
              <div className="flex flex-wrap items-center gap-2.5 mt-4">
                <button
                  onClick={() => reportFileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Report</span>
                </button>
                <input
                  ref={reportFileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onFileUploadReport(file);
                      e.target.value = '';
                    }
                  }}
                />

                <button
                  onClick={() => reportCameraInputRef.current?.click()}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                  <span>Take Photo</span>
                </button>
                <input
                  ref={reportCameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onFileUploadReport(file);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Thumbnail preview badge */}
          <div className="hidden sm:flex flex-col items-center justify-center bg-white/90 p-2.5 rounded-xl border border-blue-100 shadow-xs shrink-0 self-center">
            <div className="w-16 h-20 bg-slate-50 border border-slate-200 rounded p-1.5 flex flex-col justify-between">
              <div className="h-1.5 bg-blue-300 rounded w-8" />
              <div className="space-y-1">
                <div className="h-1 bg-slate-200 rounded w-full" />
                <div className="h-1 bg-slate-200 rounded w-10" />
                <div className="h-1 bg-slate-200 rounded w-12" />
              </div>
              <div className="h-1 bg-emerald-400 rounded w-6" />
            </div>
            <span className="text-[10px] text-blue-700 font-medium mt-1">Supports PDF, JPG, PNG</span>
          </div>
        </div>

        {/* Banner 2: Scan Medicine / Prescription */}
        <div className="bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/60 rounded-2xl p-5 border border-emerald-200/80 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <Pill className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Scan Medicine / Prescription
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-sm">
                Upload or take a photo of your prescription or medicine strips to detect medicines, check safety and create your daily timeline.
              </p>
              <div className="flex flex-wrap items-center gap-2.5 mt-4">
                <button
                  onClick={() => medFileInputRef.current?.click()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Prescription</span>
                </button>
                <input
                  ref={medFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onFileUploadMedicine(file);
                      e.target.value = '';
                    }
                  }}
                />

                <button
                  onClick={() => medCameraInputRef.current?.click()}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Take Photo</span>
                </button>
                <input
                  ref={medCameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onFileUploadMedicine(file);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Thumbnail preview badge */}
          <div className="hidden sm:flex flex-col items-center justify-center bg-white/90 p-2.5 rounded-xl border border-emerald-100 shadow-xs shrink-0 self-center">
            <div className="w-16 h-20 bg-slate-50 border border-slate-200 rounded p-1.5 flex flex-col justify-between">
              <span className="text-[10px] font-serif font-bold text-slate-400">℞</span>
              <div className="space-y-1">
                <div className="h-1 bg-slate-200 rounded w-full" />
                <div className="h-1 bg-slate-200 rounded w-8" />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="h-2 w-2 rounded-full bg-rose-400 mx-auto" />
                <div className="h-2 w-2 rounded-full bg-emerald-400 mx-auto" />
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium mt-1">Supports multiple images</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. MIDDLE ROW: LATEST LAB REPORT, HEALTH SNAPSHOT, WIDAL
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card 1: Latest Lab Report (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                    {dataSource === 'user_upload' ? currentReport.title : 'Latest Lab Report'}
                  </h3>
                  {dataSource === 'user_upload' && (
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      Extracted from uploaded report
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {currentReport.reportDate || '17 Aug 2026'}
              </span>
            </div>

            {/* Sub-tabs: CBC vs Widal vs Dynamic Category */}
            <div className="flex items-center gap-2 mt-3.5">
              {dataSource === 'user_upload' ? (
                <div className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-100/80 text-blue-700 border border-blue-200">
                  {currentReport.category || 'Uploaded Laboratory Report'}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setActiveReportTab('cbc')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      activeReportTab === 'cbc'
                        ? 'bg-blue-100/80 text-blue-700 border border-blue-200'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Complete Blood Count (CBC)
                  </button>
                  <button
                    onClick={() => setActiveReportTab('widal')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      activeReportTab === 'widal'
                        ? 'bg-blue-100/80 text-blue-700 border border-blue-200'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Widal Test
                  </button>
                </>
              )}
            </div>

            {/* Test Parameters Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-2 pr-2">Test Parameter</th>
                    <th className="py-2 px-2">Result</th>
                    <th className="py-2 px-2">Reference Range</th>
                    <th className="py-2 pl-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentReport.parameters && currentReport.parameters.length > 0 ? (
                    currentReport.parameters.slice(0, 3).map((param) => (
                      <tr
                        key={param.id}
                        onClick={() => setSelectedParamExplanation(param)}
                        className="cursor-pointer hover:bg-slate-50/80 transition"
                        title="Click to view simple Hinglish explanation"
                      >
                        <td className="py-2.5 pr-2 font-semibold text-slate-800">
                          {param.parameterName}
                        </td>
                        <td className="py-2.5 px-2 text-slate-600 font-mono">
                          {param.result} {param.unit}
                        </td>
                        <td className="py-2.5 px-2 text-slate-500 font-mono text-[11px]">
                          {param.referenceRange}
                        </td>
                        <td className="py-2.5 pl-2 text-right">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                              param.status === 'Within displayed range'
                                ? 'text-emerald-600'
                                : param.status === 'Cannot determine'
                                ? 'text-slate-500'
                                : 'text-amber-600'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                param.status === 'Within displayed range'
                                  ? 'bg-emerald-500'
                                  : param.status === 'Cannot determine'
                                  ? 'bg-slate-400'
                                  : 'bg-amber-500'
                              }`}
                            />
                            {param.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400 text-xs">
                        No parameters in current document. Upload a report to view results.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* "What this means" Callout Box */}
            <div className="mt-4 p-3.5 rounded-xl bg-blue-50/60 border border-blue-100">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">What this means</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {showSimpleExplanation || languageMode === 'hinglish'
                        ? currentReport.overallSummaryHinglish
                        : currentReport.overallSummaryEn}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSimpleExplanation(!showSimpleExplanation)}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 shrink-0 transition shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{showSimpleExplanation ? 'English' : 'Explain in simple words'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Full Report Details Accordion Toggle */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setShowFullReportDetails(!showFullReportDetails)}
              className="text-xs text-slate-600 hover:text-blue-600 font-medium flex items-center gap-1 cursor-pointer"
            >
              {showFullReportDetails ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Hide full report details</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>
                    View full report details ({currentReport.parameters?.length || 0} parameters)
                  </span>
                </>
              )}
            </button>
            <button
              onClick={() => onNavigateToTab('reports')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Full Report View</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Expanded parameters table */}
          {showFullReportDetails && (
            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70 max-h-56 overflow-y-auto space-y-2">
              <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                All Extracted Parameters ({currentReport.parameters?.length || 0})
              </h5>
              <div className="divide-y divide-slate-200/60 text-xs">
                {currentReport.parameters?.map((param) => (
                  <div
                    key={param.id}
                    onClick={() => setSelectedParamExplanation(param)}
                    className="py-1.5 flex items-center justify-between hover:bg-white px-1.5 rounded cursor-pointer"
                  >
                    <div>
                      <span className="font-medium text-slate-800">{param.parameterName}</span>
                      <span className="text-[10px] text-slate-400 ml-2 font-mono">
                        Ref: {param.referenceRange}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-700 font-semibold">
                        {param.result} {param.unit}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          param.status === 'Within displayed range'
                            ? 'text-emerald-600 bg-emerald-50'
                            : param.status === 'Cannot determine'
                            ? 'text-slate-600 bg-slate-100'
                            : 'text-amber-700 bg-amber-50'
                        }`}
                      >
                        {param.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Health Snapshot (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-rose-500/20" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">Health Snapshot</h3>
                  <p className="text-[10px] text-slate-400">
                    {dataSource === 'user_upload' ? 'Derived from uploaded report' : 'Latest from your reports / records'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToTab('reports')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-0.5 cursor-pointer"
              >
                <span>View Trends</span>
                <span>→</span>
              </button>
            </div>

            {/* 6 Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {displayMetrics.length > 0 ? (
                displayMetrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between">
                      {getMetricIcon(metric.iconType)}
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                          metric.statusColor === 'green'
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'text-amber-700 bg-amber-50'
                        }`}
                      >
                        {metric.status}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-[11px] font-medium text-slate-500 block truncate">
                        {metric.name}
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-base font-bold text-slate-900 font-mono">
                          {metric.value}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">{metric.unit}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                      {metric.simpleExplanation}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-8 text-center text-slate-400 text-xs">
                  Upload a lab report to generate your health snapshot metrics.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Widal Test Result (3 Cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                  {widalParams.length > 0 || activeReportTab === 'widal'
                    ? 'Widal Test Result'
                    : 'Report Pathology'}
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {currentReport.reportDate || '17 Aug 2026'}
              </span>
            </div>

            {/* Antigen Rows or Active Parameters */}
            <div className="mt-4 space-y-3 text-xs">
              {(widalParams.length > 0 ? widalParams : sampleWidalReport.parameters).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 border border-slate-100"
                >
                  <span className="font-semibold text-slate-700">{p.parameterName}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-800 font-bold">{p.result}</span>
                    <span className="text-emerald-600 font-medium text-[11px]">
                      {p.status === 'Within displayed range' ? 'Within reference' : p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cautious clinical correlation note */}
          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 leading-relaxed">
            These results are evaluated strictly against reference ranges shown in the report. Clinical correlation by your physician is always advised.
          </div>
        </div>
      </div>

      {/* ========================================================
          3. BOTTOM ROW: DETECTED MEDICINES, DAILY TIMELINE,
             CHANGES DETECTED, TODAY'S AI SUMMARY
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card 1: Detected Medicines (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">Detected Medicines</h3>
                  <p className="text-[10px] text-slate-400">
                    {dataSource === 'user_upload'
                      ? 'From your uploaded prescription'
                      : 'From your prescription / scanned image'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToTab('cabinet')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-0.5 cursor-pointer"
              >
                <span>View All</span>
                <span>→</span>
              </button>
            </div>

            {/* Medicine Items */}
            <div className="mt-4 space-y-3">
              {medicines.length > 0 ? (
                medicines.map((med) => (
                  <div
                    key={med.id}
                    className="p-3 rounded-xl bg-slate-50/60 hover:bg-slate-50 border border-slate-100 transition flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-600">
                        <Pill className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
                          {med.name} {med.strength}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {med.dosage}, {med.frequency}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        med.categoryTag === 'Antibiotic'
                          ? 'bg-emerald-100 text-emerald-700'
                          : med.categoryTag === 'Acidity'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {med.categoryTag || 'Prescription'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-slate-400 text-xs">
                  No medicines in current document. Upload a prescription or medicine packaging above.
                </div>
              )}
            </div>
          </div>

          {/* Potential Interaction Banner (Only if interactions exist) */}
          {interactions.length > 0 ? (
            <div className="mt-4 p-3 rounded-xl bg-rose-50/90 border border-rose-200/80">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Potential Interaction / Contraindication</span>
                </div>
                <span className="text-[10px] font-semibold bg-rose-200/80 text-rose-900 px-2 py-0.5 rounded-full shrink-0">
                  Needs Verification
                </span>
              </div>
              <p className="text-[11px] text-slate-700 mt-1.5 leading-relaxed">
                {interactions[0].description}
              </p>
            </div>
          ) : (
            <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 text-center">
              No medication interaction flagged in the available medicines.
            </div>
          )}
        </div>

        {/* Card 2: Daily Medicine Timeline (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">Daily Medicine Timeline</h3>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                <ChevronLeft className="w-3.5 h-3.5 cursor-pointer hover:text-slate-900" />
                <span className="font-medium text-[11px]">Today, 17 Aug 2026</span>
                <ChevronRight className="w-3.5 h-3.5 cursor-pointer hover:text-slate-900" />
              </div>
            </div>

            {/* Interactive Timeline List */}
            <div className="mt-4 space-y-3.5 relative">
              {/* Connecting line */}
              <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-slate-100 -z-0" />

              {timeline.length > 0 ? (
                timeline.map((slot) => {
                  const isCompleted = slot.status === 'completed';
                  return (
                    <div
                      key={slot.id}
                      className="relative z-10 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white shrink-0" />
                        <span className="font-bold text-slate-600 font-mono text-[11px] w-16 shrink-0">
                          {slot.time}
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          {slot.type === 'medicine' ? (
                            <Pill className="w-3.5 h-3.5 text-blue-600" />
                          ) : slot.type === 'meal' ? (
                            <Utensils className="w-3.5 h-3.5 text-amber-600" />
                          ) : (
                            <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                          )}
                        </div>
                        <div>
                          <h4
                            className={`font-semibold text-xs ${
                              isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'
                            }`}
                          >
                            {slot.title}
                          </h4>
                          <p className="text-[11px] text-slate-500">{slot.subtitle}</p>
                        </div>
                      </div>

                      {/* Action checkbox / button */}
                      {slot.type === 'hydration' ? (
                        <button
                          onClick={() => onToggleTimelineSlot(slot.id)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isCompleted ? '✓ 2L Logged' : 'Track'}
                        </button>
                      ) : (
                        <button
                          onClick={() => onToggleTimelineSlot(slot.id)}
                          className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Completed</span>
                            </>
                          ) : (
                            <>
                              <div className="w-3.5 h-3.5 rounded border border-slate-300" />
                              <span>Mark as taken</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-6 text-center text-slate-400 text-xs">
                  Upload a prescription to populate your daily medication timeline.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Elderly Schedule Helper Active</span>
            <button
              onClick={() => onNavigateToTab('timeline')}
              className="text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              Expand Schedule →
            </button>
          </div>
        </div>

        {/* Card 3: Changes Detected & Today's AI Summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card: Changes Detected */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">Changes Detected</h3>
                  <p className="text-[10px] text-slate-400">
                    Compared to previous report / prescription
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToTab('timeline')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-0.5 cursor-pointer"
              >
                <span>View History</span>
                <span>→</span>
              </button>
            </div>

            <div className="mt-3.5 space-y-2.5 text-xs">
              {/* Item 1: New medicine */}
              <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                    +
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-700">New medicine detected</h5>
                    <p className="text-[11px] text-slate-500">
                      {medicines[2]?.name ? `${medicines[2].name} ${medicines[2].strength}` : 'Pantoprazole 40 mg'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full shrink-0">
                  New
                </span>
              </div>

              {/* Item 2: Dose changed */}
              <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                    +
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-700">Dose changed</h5>
                    <p className="text-[11px] text-slate-500">
                      Paracetamol 500 mg <span className="font-mono text-slate-600">1-0-1 → 1-0-1-1</span>
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full shrink-0">
                  Dose changed
                </span>
              </div>

              {/* Item 3: Lab value changed */}
              <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-700">Lab value changed</h5>
                    <p className="text-[11px] text-slate-500">
                      Hemoglobin <span className="font-mono text-slate-600">11.8 → {currentReport?.parameters?.find(p => p.parameterName.toLowerCase().includes('hemoglobin'))?.result || '12.3'} g/dL</span>
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full shrink-0">
                  Improved
                </span>
              </div>
            </div>
          </div>

          {/* Card: Today's AI Summary */}
          <div className="bg-gradient-to-br from-blue-50/50 via-white to-sky-50/40 rounded-2xl p-5 border border-blue-200/70 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-blue-100/60">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-slate-800 text-sm">Today's AI Summary</h4>
              </div>
              <button
                onClick={handleCopySummary}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100 transition cursor-pointer"
                title="Copy Summary"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
              {currentReport?.overallSummaryEn ||
                "Your CBC values shown here are within the displayed reference intervals. Your Widal test results are also within the reference range. One medication combination needs verification. Follow your prescribed medicine schedule and consult your doctor or pharmacist for any concerns."}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. PARAMETER EXPLANATION MODAL (HINGLISH JARGON BUSTER)
      ======================================================== */}
      {selectedParamExplanation && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {selectedParamExplanation.parameterName.slice(0, 1)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {selectedParamExplanation.parameterName}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    Result: {selectedParamExplanation.result} {selectedParamExplanation.unit} (Ref: {selectedParamExplanation.referenceRange})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedParamExplanation(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Hinglish Explanation Box */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <span className="text-sm">🇮🇳</span>
                  <span>Simple Hinglish Explanation:</span>
                </div>
                <p className="text-sm text-slate-800 mt-2 leading-relaxed font-medium">
                  "{selectedParamExplanation.hinglishExplanation}"
                </p>
              </div>

              {/* English Explanation */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <h5 className="font-bold text-slate-700">In Plain English:</h5>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  {selectedParamExplanation.simpleExplanationEn}
                </p>
              </div>

              {/* Clinical Guardrail */}
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  {selectedParamExplanation.clinicalCaution ||
                    'This value alone cannot establish a diagnosis. Always discuss your symptoms and results with a qualified healthcare professional.'}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  onOpenAskModal(`Tell me more about ${selectedParamExplanation.parameterName} in my report`);
                  setSelectedParamExplanation(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask MediBuddy More</span>
              </button>
              <button
                onClick={() => setSelectedParamExplanation(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. BOTTOM HEALTHCARE SAFETY DISCLAIMER
      ======================================================== */}
      <footer className="mt-8 bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex items-start sm:items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong className="font-semibold text-slate-800">MediBuddy Safety Notice:</strong> MediBuddy helps you understand medical reports and organize medication information. It does not provide a diagnosis, prescribe treatment, or replace a qualified doctor or pharmacist. Always verify medication and safety concerns with a healthcare professional.
        </p>
      </footer>
    </div>
  );
};
