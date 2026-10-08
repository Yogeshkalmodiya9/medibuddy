import React, { useState } from 'react';
import {
  History,
  TrendingUp,
  FileText,
  Pill,
  ArrowRight,
  AlertCircle,
  PlusCircle,
  MinusCircle,
  CheckCircle2,
  RefreshCw,
  Info,
} from 'lucide-react';
import { samplePrescriptionChanges, sampleLabChanges } from '../data/mockClinicalData';

interface WhatChangedViewProps {
  elderMode: boolean;
}

export const WhatChangedView: React.FC<WhatChangedViewProps> = ({ elderMode }) => {
  const [activeTab, setActiveTab] = useState<'prescription' | 'lab'>('prescription');

  return (
    <div className={`p-4 sm:p-6 space-y-6 max-w-5xl mx-auto ${elderMode ? 'text-base' : 'text-sm'}`}>
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <History className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  WHAT CHANGED?
                </h2>
                <span className="text-[11px] bg-cyan-100 text-cyan-800 font-bold px-2 py-0.5 rounded-full">
                  Health Record Comparison
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Compare old vs. new prescriptions and previous vs. latest lab reports over time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('prescription')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'prescription'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Pill className="w-3.5 h-3.5 text-emerald-600" />
              <span>Prescription Changes</span>
            </button>
            <button
              onClick={() => setActiveTab('lab')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'lab'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Lab Report Trends</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prescription Changes Tab */}
      {activeTab === 'prescription' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Prescription Change Detected:</strong> Please follow the latest prescription provided by your doctor and verify any unexpected change with your healthcare professional or pharmacist.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">
              Detected Changes (Old Prescription 10 Aug → New Prescription 17 Aug)
            </h3>

            {/* Change 1: New medicine */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                  +
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">New Medicine Added</h4>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                      New
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 mt-1">
                    Pantoprazole 40 mg (1 tablet before breakfast)
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Common use: Reduces stomach acid. Added in current prescription.
                  </p>
                </div>
              </div>
            </div>

            {/* Change 2: Dose changed */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">
                  ⚙️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">Dose / Frequency Changed</h4>
                    <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                      Dose Changed
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 mt-1">Paracetamol 500 mg</p>
                  <div className="flex items-center gap-2 mt-1 font-mono text-xs text-slate-700 bg-white p-2 rounded-lg border border-amber-200 w-fit">
                    <span className="text-slate-500 line-through">Old: 1-0-1</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                    <span className="font-bold text-amber-800">New: 1-0-1-1 (4 times daily)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Change 3: Continued medicine */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">Continued Medicine</h4>
                    <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                      Unchanged
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1">
                    Amoxicillin 500 mg — 1 tablet, 2 times a day (Course continued)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lab Report Trends Tab */}
      {activeTab === 'lab' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">
            Lab Value Evolution (Previous Report 15 July → Latest Report 17 Aug)
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700">Hemoglobin</span>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="font-mono text-slate-500">11.8 g/dL (Borderline)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-mono font-bold text-emerald-700">12.3 g/dL (Within range)</span>
                </div>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
                Improved
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700">Total WBC Count</span>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="font-mono text-slate-500">8800 /µL</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono font-bold text-slate-800">9200 /µL (Within range)</span>
                </div>
              </div>
              <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-full">
                Stable
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700">Platelets Count</span>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="font-mono text-slate-500">3.10 lakh/µL</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono font-bold text-slate-800">3.23 lakh/µL (Within range)</span>
                </div>
              </div>
              <span className="text-xs bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-full">
                Stable
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
