import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Pill,
  Utensils,
  Droplets,
  ChevronLeft,
  ChevronRight,
  Info,
  Volume2,
} from 'lucide-react';
import { TimelineSlot, MedicineItem } from '../types';

interface HealthTimelineViewProps {
  timeline: TimelineSlot[];
  onToggleSlot: (id: string) => void;
  medicines: MedicineItem[];
  elderMode: boolean;
}

export const HealthTimelineView: React.FC<HealthTimelineViewProps> = ({
  timeline,
  onToggleSlot,
  medicines,
  elderMode,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedSlotForInfo, setSelectedSlotForInfo] = useState<TimelineSlot | null>(null);

  const completedCount = timeline.filter((t) => t.status === 'completed').length;
  const totalCount = timeline.length;
  const adherenceRate = Math.round((completedCount / (totalCount || 1)) * 100);

  const filteredTimeline = timeline.filter((slot) => {
    if (selectedFilter === 'pending') return slot.status === 'pending';
    if (selectedFilter === 'completed') return slot.status === 'completed';
    return true;
  });

  return (
    <div className={`p-4 sm:p-6 space-y-6 max-w-5xl mx-auto ${elderMode ? 'text-base' : 'text-sm'}`}>
      {/* Header card with adherence stats */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Daily Health & Medicine Timeline</h2>
              <p className="text-xs text-slate-500">
                Generated strictly from prescription instructions. Track taken and upcoming doses.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <ChevronLeft className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-700" />
            <span className="text-xs font-bold text-slate-800">Today, 17 Aug 2026</span>
            <ChevronRight className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-700" />
          </div>
        </div>

        {/* Adherence Progress Bar */}
        <div className="mt-6 p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Today's Adherence Rate
              </span>
              <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                {adherenceRate}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {completedCount} of {totalCount} scheduled activities logged
            </p>
          </div>

          <div className="w-full sm:w-64 bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${adherenceRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Schedule ({totalCount})
          </button>
          <button
            onClick={() => setSelectedFilter('pending')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedFilter === 'pending'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-blue-700'
            }`}
          >
            Pending ({totalCount - completedCount})
          </button>
          <button
            onClick={() => setSelectedFilter('completed')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedFilter === 'completed'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {elderMode && (
          <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-xl border border-indigo-200">
            Senior Mode: Large Touch Targets Active
          </span>
        )}
      </div>

      {/* Timeline Stream */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        {filteredTimeline.map((slot) => {
          const isCompleted = slot.status === 'completed';
          return (
            <div
              key={slot.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isCompleted
                  ? 'bg-slate-50/70 border-slate-200 opacity-80'
                  : 'bg-white border-blue-200/80 shadow-xs hover:border-blue-300'
              } ${elderMode ? 'py-5' : 'py-4'}`}
            >
              <div className="flex items-start sm:items-center gap-4">
                {/* Time badge */}
                <div className="flex flex-col items-center justify-center min-w-[72px] py-1.5 px-2 bg-slate-100 rounded-xl font-mono text-xs font-bold text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-500 mb-0.5" />
                  <span>{slot.time}</span>
                </div>

                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    slot.type === 'medicine'
                      ? 'bg-blue-50 text-blue-600'
                      : slot.type === 'meal'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-cyan-50 text-cyan-600'
                  }`}
                >
                  {slot.type === 'medicine' ? (
                    <Pill className="w-5 h-5" />
                  ) : slot.type === 'meal' ? (
                    <Utensils className="w-5 h-5" />
                  ) : (
                    <Droplets className="w-5 h-5" />
                  )}
                </div>

                {/* Content */}
                <div>
                  <h4
                    className={`font-bold text-slate-900 ${
                      elderMode ? 'text-lg' : 'text-base'
                    } ${isCompleted ? 'line-through text-slate-400' : ''}`}
                  >
                    {slot.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{slot.subtitle}</p>
                  {slot.instructions && (
                    <p className="text-[11px] text-blue-700 font-medium mt-1">
                      ℹ️ {slot.instructions}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => onToggleSlot(slot.id)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                  } ${elderMode ? 'text-sm py-3 px-5' : ''}`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Taken / Done</span>
                    </>
                  ) : (
                    <>
                      <div className="w-4 h-4 rounded border-2 border-white/80" />
                      <span>Mark as Taken</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
