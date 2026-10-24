import React, { useState, useEffect } from 'react';
import { Menu, Plus, Clock, User, Shield, Bell, UploadCloud, DownloadCloud, RefreshCw } from 'lucide-react';
import { NavTab } from './Sidebar';

interface TopHeaderProps {
  activeTab: NavTab;
  onOpenMobileMenu: () => void;
  onOpenAddModal: () => void;
  urgentCount: number;
  onSelectUrgentNotification?: () => void;
  hasUnsyncedChanges?: boolean;
  isSyncing?: boolean;
  syncStatus?: 'synced' | 'syncing' | 'error' | 'idle';
  onPushToSheet: () => void;
  onPullFromSheet: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  onOpenMobileMenu,
  onOpenAddModal,
  urgentCount,
  onSelectUrgentNotification,
  hasUnsyncedChanges = false,
  isSyncing = false,
  syncStatus = 'idle',
  onPushToSheet,
  onPullFromSheet,
}) => {
  const [currentDateTime, setCurrentDateTime] = useState('');

  // Live Thai clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const thaiDays = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
      const thaiMonths = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
      ];
      const dayName = thaiDays[now.getDay()];
      const day = now.getDate();
      const month = thaiMonths[now.getMonth()];
      const year = now.getFullYear() + 543;
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');

      setCurrentDateTime(`วัน${dayName}ที่ ${day} ${month} ${year} · ${hours}:${minutes}:${seconds} น.`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const tabTitles: Record<NavTab, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Songkhla SecureTrack · ภาพรวมความปลอดภัยและกิจการควบคุม',
      subtitle: 'ระบบติดตามและตรวจสอบความปลอดภัยและกิจการควบคุม จังหวัดสงขลา (16 อำเภอ)',
    },
    records: {
      title: 'ฐานข้อมูลและทะเบียนผลการตรวจสอบ (Songkhla SecureTrack)',
      subtitle: 'Inspection Database & Controlled Business Records Management',
    },
    analytics: {
      title: 'สถิติและกราฟวิเคราะห์เชิงลึก (Analytics)',
      subtitle: 'Real-time Chart.js Analytics & 16 Districts Distribution',
    },
    report: {
      title: 'ระบบสรุปรายงานราชการเสนอผู้บริหาร',
      subtitle: 'Official Monthly Administrative Report (A4 Printable View)',
    },
    audit: {
      title: 'บันทึกประวัติการทำรายการ (Audit Trail)',
      subtitle: 'Security Group Activity Log & Transparency Tracking',
    },
    legal: {
      title: 'คู่มือกฎหมายและแนวทางปฏิบัติงาน',
      subtitle: 'Legal Guidelines, NCPO 22/2558 & Place of Service Act',
    },
  };

  const currentMeta = tabTitles[activeTab] || tabTitles.dashboard;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs h-16 flex items-center justify-between px-3 sm:px-6 w-full flex-nowrap transition-all">
      {/* Left: Mobile Toggle & Context Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2 sm:mr-4">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
          title="เปิดเมนูหลัก"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0 flex flex-col justify-center">
          <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight truncate flex items-center gap-2">
            <span className="truncate">{currentMeta.title}</span>
          </h1>
          <p className="text-[11px] text-slate-500 truncate hidden md:block mt-0.5">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Balanced, Single-Row Controls (All unified h-9 height, perfectly aligned) */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-nowrap">
        {/* 1. Live Thai Clock */}
        <div 
          className="hidden 2xl:flex items-center gap-1.5 h-9 px-2.5 rounded-lg bg-slate-50 border border-slate-200/90 text-xs font-mono text-slate-600 tabular-nums shadow-2xs"
          title="เวลาปัจจุบันตามระบบราชการ"
        >
          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="whitespace-nowrap">{currentDateTime}</span>
        </div>

        {/* 2. Staging Sync Status Pill */}
        {hasUnsyncedChanges ? (
          <div 
            className="hidden xl:flex items-center gap-1.5 h-9 px-2.5 rounded-lg bg-amber-50 border border-amber-300 text-[11px] font-semibold text-amber-800 shadow-2xs animate-pulse"
            title="มีข้อมูลที่บันทึกไว้ในเครื่อง รอส่งขึ้น Google Sheets"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
            <span className="whitespace-nowrap">รอส่งขึ้น Google Sheets (ร่าง)</span>
          </div>
        ) : (
          <div 
            className="hidden xl:flex items-center gap-1.5 h-9 px-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-[11px] font-semibold text-emerald-800 shadow-2xs"
            title="ข้อมูลในเครื่องตรงกับ Google Sheets เรียบร้อยแล้ว"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="whitespace-nowrap">ซิงค์กับ Google Sheets แล้ว</span>
          </div>
        )}

        {/* 3. Pull Button ("ดึงข้อมูลจาก Google Sheets") */}
        <button
          onClick={onPullFromSheet}
          disabled={isSyncing}
          className="hidden sm:flex items-center gap-1.5 h-9 px-2.5 sm:px-3 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200/80 active:bg-slate-300/80 text-slate-700 border border-slate-200/90 transition-all shadow-2xs whitespace-nowrap"
          title="ดึงข้อมูลที่ผ่านการตรวจสอบล่าสุดจาก Google Sheets (SheetDB API) เข้าสู่หน้าจอ"
        >
          <DownloadCloud className={`w-3.5 h-3.5 text-blue-600 shrink-0 ${isSyncing ? 'animate-bounce' : ''}`} />
          <span className="hidden lg:inline">ดึงข้อมูล Sheets</span>
          <span className="lg:hidden">ดึงข้อมูล</span>
        </button>

        {/* 4. Push Button ("ส่งข้อมูลขึ้น Google Sheets") */}
        <button
          onClick={onPushToSheet}
          disabled={isSyncing}
          className={`flex items-center gap-1.5 h-9 px-2.5 sm:px-3 text-xs font-semibold rounded-lg transition-all shadow-2xs whitespace-nowrap ${
            hasUnsyncedChanges
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xs ring-1 ring-emerald-400'
              : 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-300'
          }`}
          title="ส่งข้อมูลที่บันทึกร่างไว้ในเครื่องขึ้น Google Sheets ถาวร"
        >
          {isSyncing ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-current shrink-0" />
          ) : (
            <UploadCloud className="w-3.5 h-3.5 text-current shrink-0" />
          )}
          <span className="hidden md:inline">ส่งขึ้น Google Sheets</span>
          <span className="md:hidden">ส่งขึ้นชีต</span>
          {hasUnsyncedChanges && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shrink-0 animate-ping"></span>
          )}
        </button>

        {/* 5. Add Record Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 h-9 px-2.5 sm:px-3.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg shadow-2xs hover:shadow-xs transition-all whitespace-nowrap"
          title="เพิ่มบันทึกผลการตรวจสอบสถานบริการ/กิจการควบคุมใหม่"
        >
          <Plus className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">เพิ่มผลการตรวจ</span>
          <span className="sm:hidden">เพิ่มตรวจ</span>
        </button>

        {/* 6. Urgent Alert Bell (with Notification Count) */}
        {urgentCount > 0 && (
          <button
            onClick={onSelectUrgentNotification}
            className="relative h-9 w-9 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg border border-slate-200/80 transition-colors shrink-0"
            title={`มีสถานบริการต้องตรวจซ้ำเร่งด่วน ${urgentCount} แห่ง`}
          >
            <Bell className="w-4 h-4 text-slate-600 hover:text-blue-600" />
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
              {urgentCount}
            </span>
          </button>
        )}

        {/* 7. Officer Profile Badge (นายเอกประวีร์ แสงคง) */}
        <div className="hidden lg:flex items-center gap-2 pl-2.5 sm:pl-3 border-l border-slate-200 h-9 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-amber-300 flex items-center justify-center font-bold text-xs shadow-2xs border border-blue-400/30 shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left leading-tight flex flex-col justify-center">
            <div className="font-bold text-xs text-slate-800 flex items-center gap-1 whitespace-nowrap">
              <span>นายเอกประวีร์ แสงคง</span>
              <Shield className="w-3 h-3 text-blue-600 shrink-0" />
            </div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span>ปลัดอำเภอ หน.กลุ่มงานความมั่นคง</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
