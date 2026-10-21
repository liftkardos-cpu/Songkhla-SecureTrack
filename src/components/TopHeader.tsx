import React, { useState, useEffect } from 'react';
import { Menu, Plus, Clock, User, Shield, Bell } from 'lucide-react';
import { NavTab } from './Sidebar';

interface TopHeaderProps {
  activeTab: NavTab;
  onOpenMobileMenu: () => void;
  onOpenAddModal: () => void;
  urgentCount: number;
  onSelectUrgentNotification?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  onOpenMobileMenu,
  onOpenAddModal,
  urgentCount,
  onSelectUrgentNotification,
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
      title: 'แดชบอร์ดภาพรวมการจัดระเบียบสังคม',
      subtitle: 'Dashboard & Executive Overview · จังหวัดสงขลา',
    },
    records: {
      title: 'ฐานข้อมูลและทะเบียนผลการตรวจสอบ',
      subtitle: 'Inspection Database & Records Management',
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
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs h-16 flex items-center justify-between px-4 sm:px-6 transition-all">
      {/* Left: Mobile Toggle & Context Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="เปิดเมนู"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight flex items-center gap-2">
            <span>{currentMeta.title}</span>
          </h1>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Live Clock, Urgent Notification & Officer Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live Clock Display (Tabular Numerals) */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/80 border border-slate-200/60 text-xs font-mono text-slate-700 tabular-nums shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-blue-700" />
          <span>{currentDateTime}</span>
        </div>

        {/* Urgent Notification Bell with Pulsing Indicator */}
        {urgentCount > 0 && (
          <button
            onClick={onSelectUrgentNotification}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors group"
            title={`มีสถานบริการต้องตรวจซ้ำเร่งด่วน ${urgentCount} แห่ง`}
          >
            <Bell className="w-5 h-5 text-slate-600 group-hover:text-blue-700" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
          </button>
        )}

        {/* Add Record Primary Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 active:from-blue-800 active:to-indigo-800 text-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">เพิ่มบันทึกผลการตรวจ</span>
          <span className="sm:hidden">เพิ่มตรวจ</span>
        </button>

        {/* Officer Profile Badge */}
        <div className="hidden md:flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 to-blue-900 text-amber-300 flex items-center justify-center font-bold text-xs shadow-xs border border-blue-400/20">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left text-xs leading-tight">
            <div className="font-bold text-slate-900 flex items-center gap-1">
              <span>นายสมชาย มั่นคง</span>
              <Shield className="w-3 h-3 text-blue-600" />
            </div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>ปลัดอำเภอ หน.กลุ่มงานความมั่นคง</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
