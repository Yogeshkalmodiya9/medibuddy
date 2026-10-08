import React, { useState } from 'react';
import {
  Archive,
  Pill,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Calendar,
  Info,
  Filter,
} from 'lucide-react';
import { MedicineItem, PotentialInteraction } from '../types';

interface MedicineCabinetViewProps {
  medicines: MedicineItem[];
  interactions: PotentialInteraction[];
  elderMode: boolean;
  onOpenAddModal: () => void;
}

export const MedicineCabinetView: React.FC<MedicineCabinetViewProps> = ({
  medicines,
  interactions,
  elderMode,
  onOpenAddModal,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const filtered = medicines.filter((m) => {
    if (selectedTag === 'all') return true;
    return m.categoryTag?.toLowerCase().includes(selectedTag.toLowerCase());
  });

  return (
    <div className={`p-4 sm:p-6 space-y-6 max-w-6xl mx-auto ${elderMode ? 'text-base' : 'text-sm'}`}>
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Medicine Cabinet & Safety Registry
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified active prescriptions, common therapeutic indications, and dosage guidelines.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Medication</span>
        </button>
      </div>

      {/* Safety Alert Banner */}
      {interactions.length > 0 && (
        <div className="bg-rose-50/80 rounded-2xl p-5 border border-rose-200 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-rose-900 text-sm">Active Drug Interaction Flags</h3>
            </div>
            <span className="text-xs font-bold bg-rose-200 text-rose-900 px-2.5 py-0.5 rounded-full">
              Needs Verification
            </span>
          </div>
          <p className="text-xs text-slate-700 mt-2 leading-relaxed">
            {interactions[0].description}
          </p>
        </div>
      )}

      {/* Medicine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((med) => (
          <div
            key={med.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {med.name} {med.strength}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">Source: {med.source}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    med.confidenceTag === 'green'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {med.confidenceTag === 'green' ? '🟢 Verified' : '🟡 Partial'}
                </span>
              </div>

              {/* Schedule and timing */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Dosage:</span>
                  <span className="font-semibold text-slate-800">{med.dosage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Frequency:</span>
                  <span className="font-semibold text-slate-800">{med.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Timing:</span>
                  <span className="font-semibold text-slate-800">{med.timing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Duration:</span>
                  <span className="font-semibold text-slate-800">{med.duration}</span>
                </div>
              </div>

              {/* Indication distinction */}
              <div className="mt-3.5 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
                  <span className="font-bold text-blue-900 block text-[11px]">
                    Common Therapeutic Use:
                  </span>
                  <p className="text-slate-700 mt-0.5 leading-snug">{med.commonPurpose}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 text-[11px]">
                  <span className="font-semibold text-slate-700">Prescription Reason: </span>
                  <span>{med.prescribedPurpose}</span>
                </div>
              </div>
            </div>

            {med.safetyNotes && (
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-amber-800 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{med.safetyNotes}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
