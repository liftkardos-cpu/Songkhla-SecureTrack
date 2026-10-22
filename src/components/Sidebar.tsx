import React from 'react';
import { 
  BarChart3, 
  Database, 
  PieChart, 
  FileSpreadsheet, 
  History, 
  BookOpen, 
  ShieldCheck, 
  MapPin, 
  X,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

export type NavTab = 'dashboard' | 'records' | 'analytics' | 'report' | 'audit' | 'legal';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
  totalRecordsCount: number;
  urgentCount: number;
  dataMode?: 'mock' | 'real';
  onActivateRealDataMode?: () => void;
  onLoadSampleData?: () => void;
  onResetToDefault?: () => void;
  onResetToZero?: () => void;
  onLoadRealData?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  totalRecordsCount,
  urgentCount,
  dataMode = 'mock',
  onActivateRealDataMode,
  onLoadSampleData,
  onResetToDefault,
  onResetToZero,
  onLoadRealData,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'ภาพรวมระบบ & สรุปผล',
      subLabel: 'Dashboard & Quick Overview',
      icon: BarChart3,
      badge: urgentCount > 0 ? `${urgentCount} ด่วน` : undefined,
      badgeColor: 'bg-rose-500 text-white animate-pulse',
    },
    {
      id: 'records' as NavTab,
      label: 'ฐานข้อมูลการตรวจสอบ',
      subLabel: 'Venues Database & Records',
      icon: Database,
      badge: totalRecordsCount.toString(),
      badgeColor: 'bg-slate-700/80 text-slate-300 font-mono',
    },
    {
      id: 'analytics' as NavTab,
      label: 'สถิติและกราฟวิเคราะห์',
      subLabel: '16 Districts & Types Charts',
      icon: PieChart,
    },
    {
      id: 'report' as NavTab,
      label: 'รายงานสรุปผู้บริหาร',
      subLabel: 'Executive Printable Report',
      icon: FileSpreadsheet,
    },
    {
      id: 'audit' as NavTab,
      label: 'ประวัติการทำรายการ',
      subLabel: 'Audit Trail & Activity Log',
      icon: History,
    },
    {
      id: 'legal' as NavTab,
      label: 'คู่มือกฎหมาย & คำสั่ง',
      subLabel: 'Laws & NCPO 22/2558',
      icon: BookOpen,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800/80 text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 border border-blue-400/30 flex items-center justify-center text-amber-300 shadow-lg shadow-blue-900/30 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight leading-snug font-heading flex items-center gap-1.5">
                <span>Songkhla SecureTrack</span>
              </div>
              <div className="text-[11px] text-amber-400/90 font-medium line-clamp-1">
                ระบบติดตามและตรวจสอบความปลอดภัย
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System Subtitle */}
        <div className="px-5 py-2.5 bg-blue-950/40 border-b border-blue-900/30 text-[11px] text-blue-200/80 flex items-center justify-between">
          <span className="font-medium line-clamp-1">กิจการควบคุม จ.สงขลา (16 อำเภอ)</span>
          <span className="px-1.5 py-0.5 rounded bg-blue-900/60 text-[10px] text-blue-300 border border-blue-700/40 font-mono shrink-0">
            SECURE-V2
          </span>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            เมนูหลักระบบงาน
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-md shadow-blue-950/50 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-amber-300' : 'text-slate-400 group-hover:text-blue-400'
                  }`} />
                  <div>
                    <div className="leading-tight">{item.label}</div>
                    <div className={`text-[10px] font-normal leading-tight mt-0.5 ${
                      isActive ? 'text-blue-200' : 'text-slate-400'
                    }`}>
                      {item.subLabel}
                    </div>
                  </div>
                </div>

                {item.badge ? (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isActive ? 'opacity-100 text-blue-200' : 'text-slate-500'
                  }`} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Officer & Jurisdiction Card */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 space-y-2">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>พื้นที่ 16 อำเภอ</span>
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Storage พร้อม
              </span>
            </div>
            <div className="text-[11px] text-slate-400 leading-relaxed">
              บันทึกข้อมูลปลอดภัยลงในอุปกรณ์อัตโนมัติ (Persistent localStorage)
            </div>
          </div>

          {(onActivateRealDataMode || onLoadRealData) && (
            <button
              onClick={onActivateRealDataMode || onLoadRealData}
              className={`w-full py-2 px-3 rounded-xl border text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                dataMode === 'real'
                  ? 'border-emerald-500/80 bg-emerald-900/60 text-emerald-200 ring-1 ring-emerald-500/40'
                  : 'border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-950/40 hover:bg-emerald-950/70 text-emerald-300'
              }`}
              title="สลับเข้าสู่โหมดข้อมูลจริง เริ่มต้นจาก 0 รายการ บันทึกอัตโนมัติลง localStorage"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>โหมดข้อมูลจริง / เริ่มต้นใหม่</span>
            </button>
          )}

          {onLoadSampleData && (
            <button
              onClick={onLoadSampleData}
              className="w-full py-1.5 px-3 rounded-xl border border-slate-700/60 hover:border-slate-600 bg-slate-900/70 hover:bg-slate-800 text-slate-300 text-[11px] font-medium transition-all flex items-center justify-center gap-1.5"
              title="โหลดข้อมูลตัวอย่าง 16 อำเภอของสงขลาสำหรับทดสอบระบบ"
            >
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>โหลดข้อมูลตัวอย่าง (16 อำเภอ)</span>
            </button>
          )}

          {onResetToZero && (
            <button
              onClick={onResetToZero}
              className="w-full py-1.5 px-3 rounded-xl border border-rose-900/40 hover:border-rose-700/60 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 text-[11px] font-medium transition-all flex items-center justify-center gap-1.5"
              title="รีเซ็ตข้อมูลเป็น 0 (Reset All to 0) เคลียร์สถิติและ localStorage ทั้งหมด"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>รีเซ็ตข้อมูลเป็น 0 (Reset All to 0)</span>
            </button>
          )}

          {/* Direct link to Google Sheets Single-File HTML */}
          <a
            href="/songkhla_securetrack.html"
            target="_blank"
            rel="noreferrer"
            className="w-full py-1.5 px-3 rounded-xl border border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-950/30 text-emerald-400 hover:text-emerald-300 text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            title="เปิดเว็บแอปไฟล์เดี่ยว Google Sheets Real-time Synchronization"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>เปิดแอป Google Sheets (HTML)</span>
          </a>
        </div>
      </aside>
    </>
  );
};
