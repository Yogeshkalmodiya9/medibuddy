import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Download,
  Printer,
  ChevronRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { LabReport } from '../types';

interface ReportsViewProps {
  currentReport: LabReport | null;
  onSelectReport: (report: LabReport) => void;
  elderMode: boolean;
  reportsList: LabReport[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  currentReport,
  onSelectReport,
  elderMode,
  reportsList,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`p-4 sm:p-6 space-y-6 max-w-6xl mx-auto ${elderMode ? 'text-base' : 'text-sm'}`}>
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Medical Reports Archive & Trends
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your scanned clinical laboratory results, historical trends, and doctor-ready summaries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reportsList.map((report) => {
          const isSelected = currentReport?.id === report.id;
          return (
            <div
              key={report.id}
              onClick={() => onSelectReport(report)}
              className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/20 shadow-md ring-2 ring-blue-100'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                      {report.category === 'Widal Test' ? '🧪' : '🩸'}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">{report.title}</h3>
                        {report.isSample ? (
                          <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-1.5 py-0.2 rounded">
                            Demo Sample
                          </span>
                        ) : (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded">
                            Uploaded
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{report.labName}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400 font-medium">
                    {report.reportDate}
                  </span>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-bold text-slate-700 block mb-1">Hinglish Summary:</span>
                  <p className="text-slate-600 leading-relaxed">{report.overallSummaryHinglish}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {report.parameters?.length || 0} Test Parameters Analyzed
                </span>
                <span className="text-xs text-blue-600 font-bold flex items-center gap-1">
                  <span>{isSelected ? 'Currently Selected' : 'View Report'}</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Report Detailed View */}
      {currentReport && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Detailed Breakdown: {currentReport.title}
              </h3>
              <p className="text-xs text-slate-500">
                Patient: {currentReport.patientName} • Date: {currentReport.reportDate} • Lab: {currentReport.labName}
              </p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full w-fit">
              ✓ Parameters Extracted
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 pr-3">Parameter Name</th>
                  <th className="py-2.5 px-3">Result</th>
                  <th className="py-2.5 px-3">Unit</th>
                  <th className="py-2.5 px-3">Reference Range</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 pl-3">Hinglish Simple Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentReport.parameters?.map((param) => (
                  <tr key={param.id} className="hover:bg-slate-50/70">
                    <td className="py-3 pr-3 font-bold text-slate-900">{param.parameterName}</td>
                    <td className="py-3 px-3 font-mono text-slate-800 font-bold">{param.result}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{param.unit}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{param.referenceRange}</td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {param.status}
                      </span>
                    </td>
                    <td className="py-3 pl-3 text-slate-600 max-w-xs">{param.hinglishExplanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
