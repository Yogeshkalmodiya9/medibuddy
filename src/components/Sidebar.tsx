import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Pill,
  Calendar,
  BarChart3,
  Archive,
  Users,
  Settings,
  ShieldAlert,
  ClipboardList,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  elderMode?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, elderMode }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scan-report', label: 'Scan Lab Report', icon: FileText },
    { id: 'scan-medicine', label: 'Scan Medicines', icon: Pill },
    { id: 'timeline', label: 'Health Timeline', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'cabinet', label: 'Medicine Cabinet', icon: Archive },
    { id: 'caregiver', label: 'Caregiver', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col justify-between shrink-0 select-none min-h-screen border-r border-slate-800">
      <div>
        {/* Logo and Brand */}
        <div className="p-5 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-white tracking-tight">MediBuddy</span>
                <span className="text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">AI</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-tight">
                Health Reports & Safety
              </p>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 bg-slate-800/50 px-2.5 py-1.5 rounded-lg border border-slate-700/50">
            <span className="text-cyan-400 font-medium">Tagline:</span> Understand Your Health. Simply. Safely.
          </div>
        </div>

        {/* Nav Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/90 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.id === 'caregiver' && (
                  <span className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-semibold">
                    Elder
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Promo & Safety Banner */}
      <div className="p-4 space-y-3">
        <div className="bg-gradient-to-b from-slate-800/70 to-slate-900/90 rounded-2xl p-4 border border-slate-700/60 shadow-lg text-center relative overflow-hidden">
          <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <ClipboardList className="w-6 h-6 text-cyan-400" />
          </div>
          <h4 className="text-xs font-semibold text-white leading-snug">
            Complex reports. Clear answers.
          </h4>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            Safer medications. Healthier you.
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Non-diagnostic assistant</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 text-center px-1">
          MediBuddy AI &copy; 2026. Made for patient empowerment.
        </div>
      </div>
    </aside>
  );
};
