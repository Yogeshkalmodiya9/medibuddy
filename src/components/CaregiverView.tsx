import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  PhoneCall,
  Share2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  Volume2,
  FileText,
  Copy,
  Check,
  UserCheck,
} from 'lucide-react';
import { MedicineItem, TimelineSlot, LabReport } from '../types';

interface CaregiverViewProps {
  timeline: TimelineSlot[];
  medicines: MedicineItem[];
  labReport: LabReport;
  elderMode: boolean;
  onToggleElderMode: () => void;
}

export const CaregiverView: React.FC<CaregiverViewProps> = ({
  timeline,
  medicines,
  labReport,
  elderMode,
  onToggleElderMode,
}) => {
  const [copiedShare, setCopiedShare] = useState(false);

  const completedDoses = timeline.filter((t) => t.status === 'completed').length;
  const totalDoses = timeline.length;
  const adherencePercent = Math.round((completedDoses / (totalDoses || 1)) * 100);

  const handleShareWhatsApp = () => {
    const text = `*MediBuddy Daily Health Update for Riya Dixit (17 Aug 2026)*:\n- Adherence: ${completedDoses}/${totalDoses} doses completed (${adherencePercent}%).\n- Latest Lab (CBC): All major parameters within reference range.\n- Safety Alert: Verified Pantoprazole & Amoxicillin spacing advice.\n\n_Note: MediBuddy is a report assistant, not an AI doctor._`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className={`p-4 sm:p-6 space-y-6 max-w-5xl mx-auto ${elderMode ? 'text-base' : 'text-sm'}`}>
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Caregiver & Elder Supervision Hub
              </h2>
              <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                Active Monitoring
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Empowering family members and caregivers to safeguard medication adherence and safety.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareWhatsApp}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
          >
            {copiedShare ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedShare ? 'Copied Update!' : 'Export Summary'}</span>
          </button>
        </div>
      </div>

      {/* Patient Profile & Emergency Contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Supervised Patient
          </span>
          <div className="mt-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
              R
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Riya Dixit</h4>
              <p className="text-xs text-slate-500">24 Y • Female • Blood Group O+</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Today's Adherence
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {completedDoses}/{totalDoses} Doses
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              {adherencePercent}% Done
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
            <div
              className="bg-emerald-500 h-2 rounded-full"
              style={{ width: `${adherencePercent}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Emergency Contacts
          </span>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <h5 className="font-bold text-slate-800 text-xs">Primary Doctor</h5>
              <p className="text-xs text-slate-500">Dr. S. K. Verma</p>
            </div>
            <a
              href="tel:+919876543210"
              className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold flex items-center gap-1 transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call SOS</span>
            </a>
          </div>
        </div>
      </div>

      {/* Elder-Friendly Readability Control */}
      <div className="bg-indigo-50/60 p-5 rounded-2xl border border-indigo-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👓</span>
          <div>
            <h4 className="font-bold text-indigo-950 text-sm">
              Elder / Senior Readability Mode
            </h4>
            <p className="text-xs text-indigo-800">
              Increases font size, expands button touch areas, and maximizes contrast for elderly eyes.
            </p>
          </div>
        </div>
        <button
          onClick={onToggleElderMode}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            elderMode
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'
          }`}
        >
          {elderMode ? 'Senior Mode: ON' : 'Turn On'}
        </button>
      </div>

      {/* Safety Alerts Log */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Caregiver Safety Vigilance Log</h3>

        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-950 text-sm">
                Medication Timing Verification
              </h4>
              <p className="text-xs text-amber-900 mt-1">
                Pantoprazole 40 mg was scheduled for 8:00 AM before breakfast, and Amoxicillin 500 mg at 9:00 AM after breakfast. Ensure 1 hour gap is maintained between the antacid and antibiotic as per medication guidance.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-blue-950 text-sm">
                Lab Report Safety Check
              </h4>
              <p className="text-xs text-blue-900 mt-1">
                Latest CBC lab report dated 17 Aug 2026 was verified. Hemoglobin (12.3 g/dL) and Total WBC Count (9200 /µL) remain within displayed reference intervals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
