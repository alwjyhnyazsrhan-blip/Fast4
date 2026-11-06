import React, { useState, useEffect } from 'react';
import { 
  Power, 
  Play, 
  Square, 
  MapPin, 
  Store,
  UserCheck,
  Shield, 
  Navigation,
  RefreshCw,
  Zap,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import { LocateGoSettings, LocateGoStatus } from '../types';

interface MainControlCardProps {
  settings: LocateGoSettings;
  status: LocateGoStatus;
  onTogglePower: () => void;
  onUpdateMaxDistance: (km: number) => void;
  onUpdateMaxPickupDistance?: (km: number) => void;
  onUpdateSettings: (newSettings: Partial<LocateGoSettings>) => void;
  onGetLiveLocation?: () => void;
  isLocating?: boolean;
}

const DELIVERY_DISTANCE_PRESETS = [1.0, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0];
const PICKUP_DISTANCE_PRESETS = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 4.0];

export const MainControlCard: React.FC<MainControlCardProps> = ({
  settings,
  status,
  onTogglePower,
  onUpdateMaxDistance,
  onUpdateMaxPickupDistance,
  onUpdateSettings,
  onGetLiveLocation,
  isLocating,
}) => {
  // Input string state for Delivery (Customer) Distance
  const [deliveryInput, setDeliveryInput] = useState(settings.maxDistanceKm.toString());
  // Input string state for Pickup (Restaurant) Distance
  const [pickupInput, setPickupInput] = useState((settings.maxPickupDistanceKm ?? 2.0).toString());

  useEffect(() => {
    setDeliveryInput(settings.maxDistanceKm.toString());
  }, [settings.maxDistanceKm]);

  useEffect(() => {
    setPickupInput((settings.maxPickupDistanceKm ?? 2.0).toString());
  }, [settings.maxPickupDistanceKm]);

  const handleDeliveryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDeliveryInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0 && num <= 50) {
      onUpdateMaxDistance(Math.round(num * 10) / 10);
    }
  };

  const handlePickupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPickupInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0 && num <= 50 && onUpdateMaxPickupDistance) {
      onUpdateMaxPickupDistance(Math.round(num * 10) / 10);
    }
  };

  const adjustDeliveryDistance = (delta: number) => {
    const nextVal = Math.max(0.5, Math.min(25, Math.round((settings.maxDistanceKm + delta) * 10) / 10));
    setDeliveryInput(nextVal.toString());
    onUpdateMaxDistance(nextVal);
  };

  const adjustPickupDistance = (delta: number) => {
    const current = settings.maxPickupDistanceKm ?? 2.0;
    const nextVal = Math.max(0.2, Math.min(25, Math.round((current + delta) * 10) / 10));
    setPickupInput(nextVal.toString());
    if (onUpdateMaxPickupDistance) {
      onUpdateMaxPickupDistance(nextVal);
    } else {
      onUpdateSettings({ maxPickupDistanceKm: nextVal });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. BIG START / STOP BUTTON & GPS BAR (Left Column) */}
      <div className="lg:col-span-5 bg-gradient-to-b from-[#121929] to-[#0c1220] rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
        {/* Glow ambient background aura */}
        <div
          className={`absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            status.isRunning ? 'bg-emerald-500/20' : 'bg-rose-500/10'
          }`}
        />

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
                <Power className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white">التحكم الرئيسي بالأداة</h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  status.isRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'
                }`}
              />
              <span className={`font-semibold ${status.isRunning ? 'text-emerald-400' : 'text-slate-400'}`}>
                {status.isRunning ? 'يعمل بنشاط' : 'متوقف مؤقتاً'}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            يراقب الشاشة ويفلتر مسافتي المطعم والعميل لحظياً، ويسحب شريط القبول بأقصى سرعة فور مطابقة الشروط.
          </p>
        </div>

        {/* The Massive Start/Stop Button */}
        <div className="my-2 flex flex-col items-center justify-center">
          <button
            id="btn-master-start-stop"
            onClick={onTogglePower}
            className={`group relative w-full sm:w-64 h-36 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 active:scale-95 cursor-pointer select-none border-2 shadow-2xl ${
              status.isRunning
                ? 'bg-gradient-to-b from-rose-950/80 to-rose-900/60 border-rose-500/80 text-rose-100 hover:border-rose-400 shadow-rose-950/50 hover:shadow-rose-900/40'
                : 'bg-gradient-to-b from-emerald-950/80 to-emerald-900/60 border-emerald-500/80 text-emerald-100 hover:border-emerald-400 shadow-emerald-950/50 hover:shadow-emerald-900/40'
            }`}
          >
            {status.isRunning && (
              <span className="absolute inset-0 rounded-2xl border-2 border-rose-500 animate-ping opacity-25 pointer-events-none" />
            )}

            <div
              className={`w-13 h-13 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg ${
                status.isRunning
                  ? 'bg-rose-500 text-white shadow-rose-600/40'
                  : 'bg-emerald-500 text-slate-950 shadow-emerald-600/40'
              }`}
            >
              {status.isRunning ? (
                <Square className="w-6 h-6 fill-white" />
              ) : (
                <Play className="w-6 h-6 fill-current mr-0.5" />
              )}
            </div>

            <div className="text-center">
              <span className="text-xl font-black tracking-tight block">
                {status.isRunning ? 'إيقاف الأداة' : 'تشغيل الأداة'}
              </span>
              <span
                className={`text-[11px] font-medium block mt-0.5 ${
                  status.isRunning ? 'text-rose-300' : 'text-emerald-300'
                }`}
              >
                {status.isRunning
                  ? 'المراقبة وفلترة المسافات نشطة'
                  : 'اضغط للبدء الفوري برصد الطلبات'}
              </span>
            </div>
          </button>
        </div>

        {/* GPS Location & Live Sync Bar */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>موقع المندوب الجغرافي:</span>
            </div>
            {onGetLiveLocation && (
              <button
                onClick={onGetLiveLocation}
                disabled={isLocating}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/50 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'جاري التحديد...' : 'تحديث GPS'}</span>
              </button>
            )}
          </div>

          <div className="bg-[#090d16] p-2 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400 flex items-center justify-between">
            {status.driverLocation ? (
              <div className="text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>خط العرض: {status.driverLocation.lat.toFixed(4)}</span>
                <span>•</span>
                <span>خط الطول: {status.driverLocation.lng.toFixed(4)}</span>
              </div>
            ) : (
              <span className="text-slate-500">اضغط "تحديث GPS" لالتقاط إحداثيات موقعك الحقيقية</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. DUAL DISTANCE CONTROLS: RESTAURANT & CUSTOMER (Right Column) */}
      <div className="lg:col-span-7 bg-gradient-to-b from-[#121929] to-[#0c1220] rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
                <SlidersHorizontal className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-base font-bold text-white">التحكم المزدوج بمسافة المطعم والعميل</h2>
                <p className="text-[11px] text-slate-400">تحكم مستقل بمسافة الاستلام ومسافة التوصيل</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 cursor-pointer select-none bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="text-slate-300 text-[11px] font-semibold">قبول تلقائي:</span>
                <input
                  id="checkbox-auto-accept"
                  type="checkbox"
                  checked={settings.autoAccept}
                  onChange={(e) => onUpdateSettings({ autoAccept: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-7 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-500 relative"></div>
              </label>
            </div>
          </div>

          {/* CONTROL BOX 1: RESTAURANT DISTANCE (مسافة المطعم / الاستلام) */}
          <div className="bg-[#090d16] p-4 rounded-xl border border-teal-900/40 hover:border-teal-700/50 transition-all mb-3.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-teal-950 text-teal-400 border border-teal-800/60">
                  <Store className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-bold text-teal-200">1. مسافة المطعم (الاستلام):</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-teal-950 text-teal-300 font-mono border border-teal-800/40 font-bold">
                أقصى مسافة: {settings.maxPickupDistanceKm ?? 2.0} كم
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-white font-mono">
                  {settings.maxPickupDistanceKm ?? 2.0}
                </span>
                <span className="text-xs font-bold text-teal-400">كم من موقعك للمطعم</span>
              </div>

              {/* Stepper buttons and input */}
              <div className="flex items-center gap-1.5">
                <button
                  id="btn-decrease-pickup"
                  onClick={() => adjustPickupDistance(-0.5)}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-slate-200 font-bold text-base flex items-center justify-center transition-all cursor-pointer"
                  title="إنقاص نصف كم"
                >
                  -
                </button>
                <div className="relative">
                  <input
                    id="input-pickup-distance"
                    type="number"
                    step="0.1"
                    min="0.2"
                    max="20"
                    value={pickupInput}
                    onChange={handlePickupInputChange}
                    className="w-20 h-9 text-center bg-slate-900 border border-teal-800/60 rounded-lg text-white font-mono font-bold text-sm focus:outline-none focus:border-teal-400"
                  />
                  <span className="absolute left-1.5 top-2 text-[9px] text-slate-500 font-mono pointer-events-none">
                    كم
                  </span>
                </div>
                <button
                  id="btn-increase-pickup"
                  onClick={() => adjustPickupDistance(0.5)}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-slate-200 font-bold text-base flex items-center justify-center transition-all cursor-pointer"
                  title="زيادة نصف كم"
                >
                  +
                </button>
              </div>
            </div>

            {/* Slider */}
            <input
              id="slider-pickup-distance"
              type="range"
              min="0.5"
              max="6.0"
              step="0.1"
              value={settings.maxPickupDistanceKm ?? 2.0}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setPickupInput(val.toString());
                if (onUpdateMaxPickupDistance) onUpdateMaxPickupDistance(val);
                else onUpdateSettings({ maxPickupDistanceKm: val });
              }}
              className="w-full h-1.5 mt-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />

            {/* Quick Presets for Restaurant */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {PICKUP_DISTANCE_PRESETS.map((km) => {
                const isSelected = (settings.maxPickupDistanceKm ?? 2.0) === km;
                return (
                  <button
                    key={km}
                    onClick={() => {
                      setPickupInput(km.toString());
                      if (onUpdateMaxPickupDistance) onUpdateMaxPickupDistance(km);
                      else onUpdateSettings({ maxPickupDistanceKm: km });
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all border ${
                      isSelected
                        ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold shadow-sm'
                        : 'bg-slate-800/70 hover:bg-slate-700 text-slate-300 border-slate-700/50'
                    }`}
                  >
                    {km} كم
                  </button>
                );
              })}
            </div>
          </div>

          {/* CONTROL BOX 2: CUSTOMER DISTANCE (مسافة العميل / الوجهة) */}
          <div className="bg-[#090d16] p-4 rounded-xl border border-emerald-900/40 hover:border-emerald-700/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                  <UserCheck className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-bold text-emerald-200">2. مسافة العميل (التوصيل):</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-800/40 font-bold">
                أقصى مسافة: {settings.maxDistanceKm} كم
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-white font-mono">
                  {settings.maxDistanceKm}
                </span>
                <span className="text-xs font-bold text-emerald-400">كم من المطعم للعميل</span>
              </div>

              {/* Stepper buttons and input */}
              <div className="flex items-center gap-1.5">
                <button
                  id="btn-decrease-delivery"
                  onClick={() => adjustDeliveryDistance(-0.5)}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-slate-200 font-bold text-base flex items-center justify-center transition-all cursor-pointer"
                  title="إنقاص نصف كم"
                >
                  -
                </button>
                <div className="relative">
                  <input
                    id="input-delivery-distance"
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="25"
                    value={deliveryInput}
                    onChange={handleDeliveryInputChange}
                    className="w-20 h-9 text-center bg-slate-900 border border-emerald-800/60 rounded-lg text-white font-mono font-bold text-sm focus:outline-none focus:border-emerald-400"
                  />
                  <span className="absolute left-1.5 top-2 text-[9px] text-slate-500 font-mono pointer-events-none">
                    كم
                  </span>
                </div>
                <button
                  id="btn-increase-delivery"
                  onClick={() => adjustDeliveryDistance(0.5)}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 text-slate-200 font-bold text-base flex items-center justify-center transition-all cursor-pointer"
                  title="زيادة نصف كم"
                >
                  +
                </button>
              </div>
            </div>

            {/* Slider */}
            <input
              id="slider-delivery-distance"
              type="range"
              min="0.5"
              max="10.0"
              step="0.1"
              value={settings.maxDistanceKm}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setDeliveryInput(val.toString());
                onUpdateMaxDistance(val);
              }}
              className="w-full h-1.5 mt-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />

            {/* Quick Presets for Customer */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {DELIVERY_DISTANCE_PRESETS.map((km) => {
                const isSelected = settings.maxDistanceKm === km;
                return (
                  <button
                    key={km}
                    onClick={() => {
                      setDeliveryInput(km.toString());
                      onUpdateMaxDistance(km);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all border ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-sm'
                        : 'bg-slate-800/70 hover:bg-slate-700 text-slate-300 border-slate-700/50'
                    }`}
                  >
                    {km} كم
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. STRICT SWIPE-TO-ACCEPT SPEED & SAFETY GUARANTEE */}
        <div className="p-3 bg-teal-950/30 rounded-xl border border-teal-500/40 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping shrink-0" />
            <div>
              <span className="text-white font-bold block">
                السحب التلقائي الفائق (90ms) لشريط «اسحب لقبول الطلب» ⚡
              </span>
              <span className="text-[11px] text-teal-200">
                يتم سحب مقبض القبول حصرياً بأقصى سرعة عتادية، ومحصن تماماً ضد لمس أزرار الرفض Reject أو أيقونات GPS الخريطة.
              </span>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-1.5 bg-teal-900/60 px-2 py-1 rounded text-[10px] text-teal-200 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
            <span>حماية الأيقونات مفعلة</span>
          </div>
        </div>
      </div>
    </div>
  );
};
