import React from 'react';
import { InspectionRecord } from '../types';
import { toThaiDate } from '../data/songkhlaData';
import { AlertCircle, Clock, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface SmartReminderBannerProps {
  records: InspectionRecord[];
  onViewRecord: (record: InspectionRecord) => void;
  onGoToRecordsTable: () => void;
}

export const SmartReminderBanner: React.FC<SmartReminderBannerProps> = ({
  records,
  onViewRecord,
  onGoToRecordsTable,
}) => {
  const today = new Date();
  const next7Days = new Date();
  next7Days.setDate(today.getDate() + 7);

  // Venues that are due for re-inspection within 7 days OR are under active suspension / violation
  const urgentReminders = records.filter(record => {
    if (record.inspectionStatus === 'suspended') return true;
    if (record.inspectionStatus === 'violation' || record.inspectionStatus === 'pending_followup') {
      if (!record.nextInspectionDate) return true;
      const nextDate = new Date(record.nextInspectionDate);
      return nextDate <= next7Days;
    }
    return false;
  });

  if (urgentReminders.length === 0) {
    return (
      <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 shadow-xs flex items-center justify-between text-xs text-emerald-800">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>สถานะติดตามปกติ:</strong> ไม่มีสถานบริการที่ครบกำหนดตรวจซ้ำเร่งด่วนภายใน 7 วันนี้
          </span>
        </div>
        <span className="text-[11px] text-emerald-700 font-mono">การติดตามผลเป็นไปตามแผนงาน 100%</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-rose-950/90 via-slate-900 to-indigo-950 border border-rose-500/40 rounded-2xl p-4 sm:p-5 text-white shadow-lg shadow-rose-950/20 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        {/* Left: Alert Title & Pulse Dot */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              ระบบแจ้งเตือนอัจฉริยะ (Smart Inspection Reminder)
            </div>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            มีสถานบริการต้องเข้าตรวจสอบซ้ำภายใน 7 วัน หรืออยู่ระหว่างสั่งควบคุมพิเศษ{' '}
            <span className="text-rose-400 font-mono underline underline-offset-4 decoration-rose-500">
              {urgentReminders.length} แห่ง
            </span>
          </h3>
          <p className="text-xs text-slate-300">
            โปรดประสานชุดปฏิบัติการพิเศษฝ่ายปกครอง หรือฝ่ายความมั่นคงอำเภอเข้าตรวจติดตามผลตามกำหนดเวลา
          </p>
        </div>

        {/* Right: Quick Action */}
        <button
          onClick={onGoToRecordsTable}
          className="self-start md:self-auto px-4 py-2 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 shrink-0 hover:shadow-md"
        >
          <span>ดูทะเบียนติดตามทั้งหมด</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Scrollable Carousel / List of Urgent Venues */}
      <div className="mt-4 pt-3 border-t border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {urgentReminders.slice(0, 3).map(venue => {
          const isSuspended = venue.inspectionStatus === 'suspended';

          return (
            <div
              key={venue.id}
              onClick={() => onViewRecord(venue)}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 cursor-pointer transition-all hover:border-rose-400/50 group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {venue.venueName}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {venue.district} · {venue.licenseNumber}
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                  isSuspended
                    ? 'bg-rose-900/80 text-rose-200 border border-rose-700/60'
                    : 'bg-amber-900/80 text-amber-200 border border-amber-700/60'
                }`}>
                  {isSuspended ? 'สั่งปิด 5 ปี' : 'ตรวจซ้ำ'}
                </span>
              </div>

              <div className="mt-2 pt-1.5 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-rose-400" />
                  {venue.nextInspectionDate ? toThaiDate(venue.nextInspectionDate) : 'ต้องติดตาม'}
                </span>
                <span className="text-blue-300 group-hover:underline flex items-center gap-0.5">
                  รายละเอียด
                  <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
