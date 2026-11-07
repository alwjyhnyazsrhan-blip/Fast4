import React from 'react';
import { X, MapPin, Zap, Sliders, Timer, Sparkles } from 'lucide-react';
import { LocateGoSettings, LocateGoStatus } from '../types';

interface LocateAssistantModalProps {
  settings: LocateGoSettings;
  status: LocateGoStatus;
  onClose?: () => void;
  onTogglePower: () => void;
  onUpdateSettings: (newSettings: Partial<LocateGoSettings>) => void;
  isFloating?: boolean;
}

export const LocateAssistantModal: React.FC<LocateAssistantModalProps> = ({
  settings,
  status,
  onClose,
  onTogglePower,
  onUpdateSettings,
  isFloating = false,
}) => {
  const isAutoAcceptActive = settings.autoAccept && status.isRunning;
  const currentPickupKm = settings.maxPickupDistanceKm ?? 1.0;
  const currentDeliveryKm = settings.maxDistanceKm ?? 2.5;
  const currentSwipeSpeed = settings.swipeSpeedMs ?? 100;
  const currentTapInterval = settings.tapIntervalMs ?? 10;
  const isCustomIntervalEnabled = settings.enableCustomInterval ?? false;

  const handleAdjustPickup = (delta: number) => {
    const next = Math.max(0.2, Math.min(25, Math.round((currentPickupKm + delta) * 10) / 10));
    onUpdateSettings({ maxPickupDistanceKm: next });
  };

  const handleAdjustDelivery = (delta: number) => {
    const next = Math.max(0.5, Math.min(25, Math.round((currentDeliveryKm + delta) * 10) / 10));
    onUpdateSettings({ maxDistanceKm: next });
  };

  const handleSwipeSpeedChange = (speed: number) => {
    onUpdateSettings({ swipeSpeedMs: speed });
  };

  const handleTapIntervalChange = (val: number) => {
    const clamped = Math.max(5, Math.min(1000, val));
    onUpdateSettings({ tapIntervalMs: clamped });
  };

  return (
    <div
      className={`w-full max-w-md mx-auto bg-[#131b34]/95 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-5 shadow-2xl text-white font-sans select-none ${
        isFloating ? 'relative ring-1 ring-cyan-500/30' : ''
      }`}
      dir="rtl"
    >
      {/* HEADER: L.H Badge + Title + Close Button */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          {/* L.H Round Badge */}
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-sm shadow-[0_0_15px_rgba(16,185,129,0.5)] border-2 border-emerald-300">
            L.H
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              مساعد لوكيت
            </h2>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* STATUS SUB-HEADER */}
      <div className="text-center py-1 mb-3">
        <p
          className={`text-sm font-semibold tracking-wide transition-colors ${
            isAutoAcceptActive
              ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]'
              : 'text-amber-400/90'
          }`}
        >
          {isAutoAcceptActive ? 'القبول التلقائي يعمل' : 'القبول التلقائي متوقف'}
        </p>
      </div>

      {/* SECTION 1: القبول التلقائي (Card with Toggle Switch) */}
      <div className="bg-[#1b2548]/85 hover:bg-[#1f2b54] transition-all rounded-2xl p-4 mb-3.5 border border-indigo-500/20 shadow-sm flex items-center justify-between">
        <div className="text-right">
          <h3 className="text-base font-bold text-white mb-0.5">القبول التلقائي</h3>
          <p className="text-xs text-slate-300/80">تشغيل أو تعطيل قبول الطلبات</p>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={onTogglePower}
          type="button"
          className={`relative inline-flex h-8 w-15 shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none ${
            settings.autoAccept && status.isRunning
              ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
              : 'bg-slate-700'
          }`}
          role="switch"
          aria-checked={settings.autoAccept && status.isRunning}
        >
          <span
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
              settings.autoAccept && status.isRunning ? 'translate-x-0' : '-translate-x-7'
            }`}
          />
        </button>
      </div>

      {/* SECTION 2: مسافة المطعم (Restaurant Distance Stepper Card) */}
      <div className="bg-[#1b2548]/85 rounded-2xl p-4 mb-3.5 border border-indigo-500/20 shadow-sm text-center">
        <div className="flex items-center justify-center gap-1.5 mb-2.5 text-slate-200">
          <span className="text-red-400 text-sm">📍</span>
          <h3 className="text-base font-bold">مسافة المطعم</h3>
        </div>

        {/* Stepper Buttons Row: [ 1+ ] [ + ] [ 1.0 كم ] [ - ] [ -1 ] */}
        <div className="flex items-center justify-center gap-2 mb-2 dir-ltr">
          <button
            onClick={() => handleAdjustPickup(-1.0)}
            className="w-11 h-10 rounded-xl bg-[#23315e] hover:bg-[#2b3c74] active:scale-95 border border-indigo-400/30 font-bold text-sm text-slate-100 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="تقليل 1 كم"
          >
            -1
          </button>
          <button
            onClick={() => handleAdjustPickup(-0.5)}
            className="w-11 h-10 rounded-xl bg-[#23315e] hover:bg-[#2b3c74] active:scale-95 border border-indigo-400/30 font-bold text-base text-slate-100 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="تقليل 0.5 كم"
          >
            -
          </button>

          {/* Central Value Display Pill */}
          <div className="min-w-[100px] h-10 px-3 rounded-xl bg-[#0e152a] border border-cyan-500/40 flex items-center justify-center shadow-inner font-mono font-extrabold text-base text-white tracking-wider">
            {currentPickupKm.toFixed(1)} كم
          </div>

          <button
            onClick={() => handleAdjustPickup(0.5)}
            className="w-11 h-10 rounded-xl bg-[#23315e] hover:bg-[#2b3c74] active:scale-95 border border-indigo-400/30 font-bold text-base text-slate-100 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="زيادة 0.5 كم"
          >
            +
          </button>
          <button
            onClick={() => handleAdjustPickup(1.0)}
            className="w-11 h-10 rounded-xl bg-[#23315e] hover:bg-[#2b3c74] active:scale-95 border border-indigo-400/30 font-bold text-sm text-slate-100 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="زيادة 1 كم"
          >
            1+
          </button>
        </div>

        <p className="text-xs text-slate-300/80">تعديل المسافة المسموحة بينك وبين المطعم</p>
      </div>

      {/* SECTION 3: مسافة العميل (Customer Distance Stepper Card) */}
      <div className="bg-[#1b2548]/85 rounded-2xl p-4 mb-3.5 border border-indigo-500/20 shadow-sm text-center">
        <div className="flex items-center justify-center gap-1.5 mb-2.5 text-slate-200">
          <span className="text-red-400 text-sm">📍</span>
          <h3 className="text-base font-bold">مسافة العميل</h3>
        </div>

        {/* Stepper Buttons Row: [ 1+ ] [ + ] [ 2.5 كم ] [ - ] [ -1 ] */}
        <div className="flex items-center justify-center gap-2 mb-2 dir-ltr">
          <button
            onClick={() => handleAdjustDelivery(-1.0)}
            className="w-11 h-10 rounded-xl bg-[#23315e] hover:bg-[#2b3c74] active:scale-95 border border-indigo-400/30 font-bold text-sm text-slate-100 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="تقليل 1 كم"
          >
            -1
          </button>
          <button
            onClick={() => handleAdjustDelivery(-0.5)}
            className="w-11 h-10 rounded-xl bg-[#23315e] hover:bg-[#2b3c74] active:scale-95 border border-indigo-400/30 font-bold text-base text-slate-100 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="تقليل 0.5 كم"
          >
            -
          </button>

          {/* Central Value Display Pill */}
          <div className="min-w-[100px] h-10 px-3 rounded-xl bg-[#0e152a] border border-cyan-500/40 flex items-center justify-center shadow-inner font-mono font-extrabold text-base text-white tracking-wider">
            {currentDeliveryKm.toFixed(1)} كم
          </div>

          <button
            onClick={() => handleAdjustDelivery(0.5)}
            className="w-11 h-10 rounded-xl bg-[#23315e] hover:bg-[#2b3c74] active:scale-95 border border-indigo-400/30 font-bold text-base text-slate-100 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="زيادة 0.5 كم"
          >
            +
          </button>
          <button
            onClick={() => handleAdjustDelivery(1.0)}
            className="w-11 h-10 rounded-xl bg-[#23315e] hover:bg-[#2b3c74] active:scale-95 border border-indigo-400/30 font-bold text-sm text-slate-100 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="زيادة 1 كم"
          >
            1+
          </button>
        </div>

        <p className="text-xs text-slate-300/80">تعديل المسافة المسموحة بين المطعم والعميل</p>
      </div>

      {/* SECTION 4: سرعة السحب (Swipe Speed Slider Card) */}
      <div className="bg-[#1b2548]/85 rounded-2xl p-4 mb-3.5 border border-indigo-500/20 shadow-sm text-center">
        <h3 className="text-base font-bold text-slate-200 mb-1">سرعة السحب</h3>

        <div className="text-xl font-extrabold font-mono text-cyan-400 my-1 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
          {currentSwipeSpeed} ms
        </div>

        {/* Range Slider */}
        <div className="px-2 my-2 dir-ltr">
          <input
            type="range"
            min={100}
            max={250}
            step={50}
            value={currentSwipeSpeed}
            onChange={(e) => handleSwipeSpeedChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Preset Buttons for Quick Selection */}
        <div className="grid grid-cols-4 gap-1.5 my-2">
          {[100, 150, 200, 250].map((preset) => (
            <button
              key={preset}
              onClick={() => handleSwipeSpeedChange(preset)}
              className={`py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                currentSwipeSpeed === preset
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'bg-[#23315e] hover:bg-[#2b3c74] text-slate-300'
              }`}
            >
              {preset} ms
            </button>
          ))}
        </div>

        <p className="text-[11px] text-slate-300/80 font-medium">
          100 | 150 | 200 | 250 – الأقل أسرع، والأعلى أنسب للجوالات الضعيفة
        </p>
      </div>

      {/* SECTION 5: فاصل النقرات المتتالية (Repeated-tap Interval Card) */}
      <div className="bg-[#1b2548]/85 rounded-2xl p-4 border border-indigo-500/20 shadow-sm">
        <div className="text-center mb-2">
          <h3 className="text-sm font-bold text-slate-200">
            فاصل النقرات المتتالية | Repeated-tap Interval
          </h3>
        </div>

        {/* Enable custom interval toggle row */}
        <div className="flex items-center justify-between my-2 text-xs text-slate-300">
          <span>تفعيل القيمة المخصصة | Enable custom interval</span>
          <button
            onClick={() => onUpdateSettings({ enableCustomInterval: !isCustomIntervalEnabled })}
            type="button"
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
              isCustomIntervalEnabled ? 'bg-cyan-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isCustomIntervalEnabled ? 'translate-x-0' : '-translate-x-5'
              }`}
            />
          </button>
        </div>

        {/* Numeric input box */}
        <div className="flex items-center justify-center gap-2 mt-2 dir-ltr">
          <input
            type="number"
            min={5}
            max={1000}
            disabled={!isCustomIntervalEnabled}
            value={currentTapInterval}
            onChange={(e) => handleTapIntervalChange(Number(e.target.value))}
            className={`w-24 h-9 px-2 text-center rounded-xl font-mono font-bold text-sm border transition-all ${
              isCustomIntervalEnabled
                ? 'bg-[#0e152a] text-cyan-300 border-cyan-500/50 shadow-inner'
                : 'bg-slate-800/60 text-slate-500 border-slate-700/50 cursor-not-allowed'
            }`}
          />
          <span className="text-xs text-slate-400 font-mono">ms (5-1000)</span>
        </div>
      </div>
    </div>
  );
};
