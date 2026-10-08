import React, { useState } from 'react';
import {
  Settings,
  Languages,
  Bell,
  Shield,
  Eye,
  AlertTriangle,
  Heart,
  Save,
  Check,
} from 'lucide-react';

interface SettingsViewProps {
  languageMode: 'hinglish' | 'english';
  onToggleLanguage: () => void;
  elderMode: boolean;
  onToggleElderMode: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  languageMode,
  onToggleLanguage,
  elderMode,
  onToggleElderMode,
}) => {
  const [allergies, setAllergies] = useState<string>('None known on file');
  const [savedNotice, setSavedNotice] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className={`p-4 sm:p-6 space-y-6 max-w-4xl mx-auto ${elderMode ? 'text-base' : 'text-sm'}`}>
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              MediBuddy Preferences & Profile
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize language, accessibility, allergy flags, and reminders.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
        >
          {savedNotice ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{savedNotice ? 'Saved!' : 'Save Settings'}</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Language Selection */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Languages className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Explanation Language</h3>
              <p className="text-xs text-slate-500">
                Choose between conversational Hinglish (Hindi + English) or Plain English.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleLanguage}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                languageMode === 'hinglish'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              🇮🇳 Hinglish (Default)
            </button>
            <button
              onClick={onToggleLanguage}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                languageMode === 'english'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        {/* Senior / Elder Readability Mode */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Senior Readability Mode</h3>
              <p className="text-xs text-slate-500">
                Increases text size, enlarges touch buttons, and boosts contrast for elderly eyes.
              </p>
            </div>
          </div>
          <button
            onClick={onToggleElderMode}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              elderMode
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {elderMode ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Allergy Profile */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm">Known Drug Allergies</h3>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            MediBuddy cross-references scanned prescriptions against these allergies to alert you of potential safety concerns.
          </p>
          <input
            type="text"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="e.g. Penicillin, Sulfa drugs, Aspirin"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Notifications & Reminders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Medicine Time Reminders</h3>
              <p className="text-xs text-slate-500">
                Alerts on device when a scheduled dose time is reached.
              </p>
            </div>
          </div>
          <button
            onClick={() => setRemindersEnabled(!remindersEnabled)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              remindersEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}
          >
            {remindersEnabled ? 'Active' : 'Muted'}
          </button>
        </div>
      </div>
    </div>
  );
};
