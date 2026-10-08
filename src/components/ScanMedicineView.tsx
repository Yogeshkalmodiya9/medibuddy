import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  Pill,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Plus,
  Info,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { MedicineItem, PotentialInteraction } from '../types';

interface ScanMedicineViewProps {
  medicines: MedicineItem[];
  onAddMedicine: (med: MedicineItem) => void;
  interactions: PotentialInteraction[];
  elderMode: boolean;
  onFileUploadMedicine: (file: File) => void;
  isScanning: boolean;
  scanNotice: string | null;
  scanError: string | null;
  dataSource: 'demo' | 'user_upload';
  onResetToDemo: () => void;
  activeUploadFileName?: string;
}

export const ScanMedicineView: React.FC<ScanMedicineViewProps> = ({
  medicines,
  onAddMedicine,
  interactions,
  elderMode,
  onFileUploadMedicine,
  isScanning,
  scanNotice,
  scanError,
  dataSource,
  onResetToDemo,
  activeUploadFileName,
}) => {
  const [uncertaintyDemo, setUncertaintyDemo] = useState(false);

  // Manual medicine entry form modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualStrength, setManualStrength] = useState('');
  const [manualDosage, setManualDosage] = useState('1 tablet');
  const [manualFrequency, setManualFrequency] = useState('1-0-1');
  const [manualTiming, setManualTiming] = useState('After food');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUploadMedicine(file);
      e.target.value = '';
    }
  };

  const handleAddManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    onAddMedicine({
      id: 'med-manual-' + Date.now(),
      name: manualName,
      strength: manualStrength || 'Standard',
      categoryTag: 'User Entered',
      dosage: manualDosage,
      frequency: manualFrequency,
      timing: manualTiming,
      duration: 'Ongoing',
      commonPurpose: 'Self-reported medication. Verify with prescribing doctor.',
      prescribedPurpose: 'Prescribed purpose not stated in manual entry.',
      source: 'User entered',
      confidence: 'Partially verified',
      confidenceTag: 'yellow',
      safetyNotes: 'User entered record. Always verify with packaging or pharmacist.',
    });

    setManualName('');
    setManualStrength('');
    setShowManualModal(false);
  };

  return (
    <div className={`p-4 sm:p-6 space-y-6 max-w-7xl mx-auto ${elderMode ? 'text-base' : 'text-sm'}`}>
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800">Scan Prescription & Medicines</h2>
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
              Safe medication identification, dosage schedule, and interaction checking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {dataSource === 'user_upload' && (
            <button
              onClick={onResetToDemo}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Reset to Demo Sample
            </button>
          )}
          <button
            onClick={() => setShowManualModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Medicine Manually</span>
          </button>
        </div>
      </div>

      {/* Upload Error Notice */}
      {scanError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-800">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Upload Notice:</strong> {scanError}
            </span>
          </div>
          <button
            onClick={onResetToDemo}
            className="text-[11px] font-bold text-rose-900 underline hover:text-black cursor-pointer"
          >
            Switch to Demo Mode
          </button>
        </div>
      )}

      {/* CRITICAL MEDICINE SAFETY RULE HIGHLIGHT */}
      <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200 text-xs">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-900 text-sm">
              Critical Health Safety Rule: Zero Blind Pill Guessing
            </h4>
            <p className="text-amber-800 leading-relaxed">
              <strong>HEALTH SAFETY IS MORE IMPORTANT THAN COMPLETING AN AI ANSWER.</strong> MediBuddy NEVER identifies medicines solely from pill colour, pill shape, or blurry images. Confident identification requires readable packaging, label, or prescription.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-amber-900">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                🟢 Verified from readable label
              </span>
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                🟡 Partially verified
              </span>
              <span className="flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                🔴 Cannot safely identify (Requires pharmacist review)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8">
            <h3 className="font-bold text-slate-800 text-base mb-1">
              Upload Prescription, Strip, Bottle, or Box
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Upload photographs of your printed doctor prescription, medicine strip foil, or bottle label. Supports multiple medicine images.
            </p>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-200 hover:border-emerald-400 rounded-2xl p-6 text-center bg-emerald-50/20 hover:bg-emerald-50/50 cursor-pointer transition flex flex-col items-center justify-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                {isScanning ? (
                  <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {isScanning
                    ? 'Analyzing your uploaded prescription / packaging...'
                    : 'Click to upload prescription or medicine packaging'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Clear photo of printed prescription or readable packaging text
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-600" />
                <span>Take Photo of Medicine / Prescription</span>
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

          {/* Test Uncertainty / Blur Safety Demonstration */}
          <div className="lg:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Safety Simulation
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                See how MediBuddy handles an unreadable or blurry image safely:
              </p>
              <button
                onClick={() => setUncertaintyDemo(!uncertaintyDemo)}
                className="mt-3 w-full py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 transition cursor-pointer"
              >
                {uncertaintyDemo ? 'Hide Safety Notice' : 'Simulate Blurry Pill Upload'}
              </button>
            </div>

            {uncertaintyDemo && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 leading-snug">
                <strong>⚠️ Medicine identity could not be verified safely.</strong>
                <p className="mt-1">
                  Please upload a clearer image of the label/prescription or verify with a pharmacist. MediBuddy refuses to guess medications from pill color alone.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Potential Interaction Banner */}
      {interactions.length > 0 && (
        <div className="bg-rose-50/80 rounded-2xl p-5 border border-rose-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-rose-200/80">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-rose-900 text-sm">
                Potential Medication Interaction / Contraindication Flag
              </h3>
            </div>
            <span className="text-[11px] font-bold bg-rose-200 text-rose-900 px-2.5 py-0.5 rounded-full">
              Needs Verification
            </span>
          </div>

          <div className="mt-3 space-y-3">
            {interactions.map((int) => (
              <div key={int.id} className="text-xs space-y-1">
                <p className="text-slate-800 font-medium leading-relaxed">
                  {int.description}
                </p>
                <div className="p-2.5 bg-white/80 rounded-xl border border-rose-200 text-rose-900 font-medium">
                  {int.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Identified Medicines List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-800 mb-4">
          Confidently Identified Medications ({medicines.length})
        </h3>

        {medicines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medicines.map((med) => (
              <div
                key={med.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <Pill className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {med.name} {med.strength}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-medium">{med.source}</span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        med.confidenceTag === 'green'
                          ? 'bg-emerald-100 text-emerald-800'
                          : med.confidenceTag === 'yellow'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {med.confidenceTag === 'green' ? '🟢 Verified' : '🟡 Partial'}
                    </span>
                  </div>

                  {/* Instructions & Timing */}
                  <div className="mt-3.5 space-y-1.5 text-xs bg-white p-3 rounded-xl border border-slate-100">
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
                  </div>

                  {/* Purpose vs Actual Reason */}
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
                      <span className="font-bold text-blue-900 block text-[11px]">
                        Common Therapeutic Use:
                      </span>
                      <p className="text-slate-700 mt-0.5">{med.commonPurpose}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-100/70 text-slate-600 text-[11px]">
                      <span className="font-semibold text-slate-700">Prescription Indication: </span>
                      <span>{med.prescribedPurpose}</span>
                    </div>
                  </div>
                </div>

                {med.safetyNotes && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-[11px] text-amber-800 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{med.safetyNotes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            No medicines in active document. Upload a prescription or medicine packaging above.
          </div>
        )}
      </div>

      {/* Manual Entry Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base">Add Medication Manually</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter details exactly as printed on your prescription or container.
            </p>

            <form onSubmit={handleAddManualSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Medicine Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paracetamol, Metformin"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-xl outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Strength</label>
                <input
                  type="text"
                  placeholder="e.g. 500 mg, 10 mg"
                  value={manualStrength}
                  onChange={(e) => setManualStrength(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-xl outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700">Dosage</label>
                  <input
                    type="text"
                    value={manualDosage}
                    onChange={(e) => setManualDosage(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Timing</label>
                  <input
                    type="text"
                    value={manualTiming}
                    onChange={(e) => setManualTiming(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm cursor-pointer"
                >
                  Save to Cabinet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
