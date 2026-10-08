import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  AlertTriangle,
  FileCheck2,
  Calendar,
  Languages,
  CheckCircle2,
} from 'lucide-react';

interface HeaderProps {
  onOpenAskModal: (initialQuery?: string) => void;
  languageMode: 'hinglish' | 'english';
  onToggleLanguage: () => void;
  elderMode: boolean;
  onToggleElderMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAskModal,
  languageMode,
  onToggleLanguage,
  elderMode,
  onToggleElderMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Potential Medication Interaction Flagged',
      desc: 'Amoxicillin & Pantoprazole spacing needs doctor/pharmacist verification.',
      time: '10m ago',
    },
    {
      id: 2,
      type: 'info',
      title: 'Prescription Change Detected',
      desc: 'Paracetamol dose updated (1-0-1 → 1-0-1-1). Latest prescription prioritized.',
      time: '2h ago',
    },
    {
      id: 3,
      type: 'success',
      title: 'Lab Report Verified',
      desc: 'CBC values analyzed. All major parameters are within displayed reference intervals.',
      time: 'Today, 08:30 AM',
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onOpenAskModal(searchQuery.trim());
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 px-6 py-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Greeting & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100 shadow-sm">
            <span className="text-xl">☀️</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                Good morning, Riya 👋
              </h1>
              {elderMode && (
                <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                  Senior Mode Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Your health, explained simply.
            </p>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-xl mx-auto w-full">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports, medicines, or ask a question (e.g. 'Ye WBC kya hai?')..."
              className="w-full pl-10 pr-24 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs sm:text-sm text-slate-800 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition"
            >
              <Sparkles className="w-3 h-3" />
              <span>Ask AI</span>
            </button>
          </form>
        </div>

        {/* Right: Actions, Language Toggle, Notifications, Profile */}
        <div className="flex items-center gap-3 self-end lg:self-auto">
          {/* Language Toggle: Hinglish vs English */}
          <button
            onClick={onToggleLanguage}
            title="Toggle Language Explanation"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
          >
            <Languages className="w-4 h-4 text-blue-600" />
            <span>{languageMode === 'hinglish' ? 'Hinglish (हिन्दी+Eng)' : 'English'}</span>
          </button>

          {/* Senior / Caregiver friendly toggle */}
          <button
            onClick={onToggleElderMode}
            title="Toggle Senior High-Readability Mode"
            className={`px-2.5 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
              elderMode
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="text-sm">👓</span>
            <span className="hidden sm:inline">Senior Mode</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 relative transition"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-800">Notifications & Alerts</h3>
                  <span className="text-[11px] bg-rose-100 text-rose-700 font-semibold px-2 py-0.5 rounded-full">
                    1 Safety Alert
                  </span>
                </div>
                <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition flex items-start gap-3"
                    >
                      <div className="mt-0.5">
                        {item.type === 'warning' && (
                          <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {item.type === 'info' && (
                          <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                            <FileCheck2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {item.type === 'success' && (
                          <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-slate-800 truncate">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-blue-600 font-semibold hover:underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 pl-2 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 transition"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                R
              </div>
              <span className="text-xs font-semibold text-slate-700 pr-1.5 hidden sm:inline">
                Riya
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                    R
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Riya Sharma</h4>
                    <p className="text-xs text-slate-500">24 Y • Female • O+ve</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 flex items-center justify-between">
                    <span className="text-slate-500">Emergency Contact:</span>
                    <span className="font-semibold text-slate-800">+91 98765 43210</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 flex items-center justify-between">
                    <span className="text-slate-500">Primary Doctor:</span>
                    <span className="font-semibold text-slate-800">Dr. S. K. Verma</span>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-100 flex items-center justify-between">
                    <span className="text-amber-800">Known Allergies:</span>
                    <span className="font-semibold text-amber-900">None on record</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="mt-3 w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
