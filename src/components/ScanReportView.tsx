import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  FileText,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Volume2,
  RefreshCw,
  Eye,
  Info,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { LabReport, TestParameter, LabStatus } from '../types';
import { sampleCBCReport, sampleWidalReport } from '../data/mockClinicalData';

interface ScanReportViewProps {
  currentReport: LabReport | null;
  onUpdateReport: (report: LabReport) => void;
  languageMode: 'hinglish' | 'english';
  elderMode: boolean;
  onFileUpload: (file: File) => void;
  isAnalyzing: boolean;
  analysisError: string | null;
  onResetToDemo: (reportType?: 'cbc' | 'widal') => void;
  dataSource: 'demo' | 'user_upload';
  activeUploadFileName?: string;
}

export const ScanReportView: React.FC<ScanReportViewProps> = ({
  currentReport,
  onUpdateReport,
  languageMode,
  elderMode,
  onFileUpload,
  isAnalyzing,
  analysisError,
  onResetToDemo,
  dataSource,
  activeUploadFileName,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'within' | 'outside' | 'undetermined'>('all');
  const [selectedParam, setSelectedParam] = useState<TestParameter | null>(null);
  const [activePage, setActivePage] = useState<number>(1);
  const [speakingParamId, setSpeakingParamId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const reportParameters = currentReport?.parameters || [];

  // Filter parameters
  const filteredParameters = reportParameters.filter((param) => {
    if (activeFilter === 'within') return param.status === 'Within displayed range';
    if (activeFilter === 'outside') {
      return param.status === 'Above displayed range' || param.status === 'Below displayed range';
    }
    if (activeFilter === 'undetermined') return param.status === 'Cannot determine';
    return true;
  });

  const withinCount = reportParameters.filter(
    (p) => p.status === 'Within displayed range'
  ).length;
  const outsideCount = reportParameters.filter(
    (p) => p.status === 'Above displayed range' || p.status === 'Below displayed range'
  ).length;
  const undeterminedCount = reportParameters.filter(
    (p) => p.status === 'Cannot determine'
  ).length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      e.target.value = '';
    }
  };

  const handleSpeakHinglish = (text: string, paramId: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (speakingParamId === paramId) {
        setSpeakingParamId(null);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onend = () => setSpeakingParamId(null);
      setSpeakingParamId(paramId);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`p-4 sm:p-6 space-y-6 max-w-7xl mx-auto ${elderMode ? 'text-base' : 'text-sm'}`}>
      {/* Top Header & Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-800">Scan & Understand Lab Reports</h2>
                {dataSource === 'user_upload' ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Live Upload Mode
                  </span>
                ) : (
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                    Demo Reference Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                OCR extraction + Simple Hinglish explanations + Strict reference interval comparison
              </p>
            </div>
          </div>
        </div>

        {/* Quick Sample Loaders */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1">Load Preset Sample:</span>
          <button
            onClick={() => onResetToDemo('cbc')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              dataSource === 'demo' && currentReport?.id === sampleCBCReport.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            CBC Report (14 Parameters)
          </button>
          <button
            onClick={() => onResetToDemo('widal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              dataSource === 'demo' && currentReport?.id === sampleWidalReport.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Widal Test Report
          </button>
        </div>
      </div>

      {/* Analysis Error Notification */}
      {analysisError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-800">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Upload Notice:</strong> {analysisError}
            </span>
          </div>
          <button
            onClick={() => onResetToDemo('cbc')}
            className="text-[11px] font-bold text-rose-900 underline hover:text-black cursor-pointer"
          >
            Switch to Demo Mode
          </button>
        </div>
      )}

      {/* Upload Zone & Document Understanding */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8">
            <h3 className="font-bold text-slate-800 text-base mb-1">Upload Report Document or Photo</h3>
            <p className="text-xs text-slate-500 mb-4">
              Supports multi-page reports in PDF, JPG, PNG. MediBuddy analyzes your exact uploaded file and preserves the original printed lab values alongside simple explanations.
            </p>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-blue-200 hover:border-blue-400 rounded-2xl p-6 text-center bg-blue-50/30 hover:bg-blue-50/60 cursor-pointer transition flex flex-col items-center justify-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                {isAnalyzing ? (
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {isAnalyzing
                    ? 'Processing your uploaded document...'
                    : 'Click to upload or drag & drop medical report'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Clear lab report photographs, scanned slips, or laboratory PDF files
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                <span>Take Photo with Camera</span>
              </button>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Multi-page & Preview panel */}
          <div className="lg:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Active Document
                </h4>
                <div className="flex items-center gap-1 text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200">
                  <span>Page</span>
                  <select
                    value={activePage}
                    onChange={(e) => setActivePage(Number(e.target.value))}
                    className="bg-transparent font-bold outline-none cursor-pointer"
                  >
                    <option value={1}>1 of 2</option>
                    <option value={2}>2 of 2</option>
                  </select>
                </div>
              </div>

              <div className="mt-3 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">File:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                    {activeUploadFileName || (dataSource === 'demo' ? 'Sample Reference Report' : 'Document')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Patient:</span>
                  <span className="font-semibold text-slate-800">
                    {currentReport?.patientName || 'Not detected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span className="font-semibold text-slate-800">
                    {currentReport?.reportDate || 'Not detected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Laboratory:</span>
                  <span className="font-semibold text-slate-800">
                    {currentReport?.labName || 'Not detected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-semibold text-blue-700">
                    {currentReport?.category || 'Analyzing...'}
                  </span>
                </div>
              </div>
            </div>

            {isAnalyzing && (
              <div className="mt-4 p-3 bg-blue-100/70 border border-blue-200 rounded-xl flex items-center gap-2 text-xs text-blue-800">
                <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                <span>Running Gemini Document Understanding & OCR on your file...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          4. REPORT SUMMARY CATEGORIZATION
      ======================================================== */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-800">Your Report — Simple Summary</h3>
            <p className="text-xs text-slate-500">
              Categorized strictly against the reference interval printed on your uploaded report.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({reportParameters.length})
            </button>
            <button
              onClick={() => setActiveFilter('within')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                activeFilter === 'within'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Within range ({withinCount})</span>
            </button>
            <button
              onClick={() => setActiveFilter('outside')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                activeFilter === 'outside'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-amber-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Needs Attention ({outsideCount})</span>
            </button>
            <button
              onClick={() => setActiveFilter('undetermined')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                activeFilter === 'undetermined'
                  ? 'bg-white text-slate-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>Cannot determine ({undeterminedCount})</span>
            </button>
          </div>
        </div>

        {/* Cautious Summary Box */}
        {currentReport && (
          <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                  MediBuddy Simple Interpretation (Hinglish + English)
                </h4>
                <p className="text-sm text-slate-800 mt-1 font-medium leading-relaxed">
                  {currentReport.overallSummaryHinglish}
                </p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {currentReport.overallSummaryEn}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STRUCTURED PARAMETER TABLE & HINGLISH EXPLANATIONS */}
        <div className="mt-6 space-y-3">
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            TEST NAME | RESULT | UNIT | REFERENCE RANGE | STATUS
          </h4>

          {filteredParameters.length > 0 ? (
            <div className="space-y-3">
              {filteredParameters.map((param) => {
                const isSelected = selectedParam?.id === param.id;
                const isSpeaking = speakingParamId === param.id;

                return (
                  <div
                    key={param.id}
                    className={`rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/30 shadow-md ring-2 ring-blue-100'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Table Row Header */}
                    <div
                      onClick={() => setSelectedParam(isSelected ? null : param)}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                          {param.parameterName.slice(0, 2)}
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-900 text-sm">
                            {param.parameterName}
                          </h5>
                          <p className="text-xs text-slate-500 font-mono">
                            Printed Ref: {param.referenceRange}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-auto">
                        <div className="text-right">
                          <span className="font-bold text-slate-900 font-mono text-sm">
                            {param.result}
                          </span>
                          <span className="text-xs text-slate-500 font-mono ml-1">{param.unit}</span>
                        </div>

                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                            param.status === 'Within displayed range'
                              ? 'bg-emerald-100 text-emerald-800'
                              : param.status === 'Cannot determine'
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-amber-100 text-amber-800'
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
                          <span>{param.status}</span>
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeakHinglish(param.hinglishExplanation, param.id);
                          }}
                          title="Listen to explanation in Hinglish"
                          className={`p-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                            isSpeaking
                              ? 'bg-blue-600 text-white border-blue-600 animate-pulse'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Hinglish Jargon Buster Explanation Accordion */}
                    {isSelected && (
                      <div className="p-4 pt-1 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl space-y-3">
                        {/* Hinglish Box */}
                        <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                            <span>🇮🇳 Hinglish Explanation:</span>
                          </div>
                          <p className="text-slate-800 text-xs sm:text-sm font-medium leading-relaxed">
                            "{param.hinglishExplanation}"
                          </p>
                        </div>

                        {/* Plain English */}
                        <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs">
                          <span className="font-bold text-slate-700">English Concept: </span>
                          <span className="text-slate-600">{param.simpleExplanationEn}</span>
                        </div>

                        {/* Caution */}
                        {param.clinicalCaution && (
                          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <p>{param.clinicalCaution}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              No parameters found matching the selected filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
