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
  UploadCloud,
  DownloadCloud,
  RefreshCw
} from 'lucide-react';

export type NavTab = 'dashboard' | 'records' | 'analytics' | 'report' | 'audit' | 'legal';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
  totalRecordsCount: number;
  urgentCount: number;
  hasUnsyncedChanges?: boolean;
  isSyncing?: boolean;
  onPushToSheet?: () => void;
  onPullFromSheet?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  totalRecordsCount,
  urgentCount,
  hasUnsyncedChanges = false,
  isSyncing = false,
  onPushToSheet,
  onPullFromSheet,
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
      badgeColor: 'bg-slate-200 text-slate-700 font-mono',
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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container - Light Tone Theme */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/90 text-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-sm ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between bg-gradient-to-b from-slate-50/80 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/40 flex items-center justify-center text-amber-300 shadow-md shadow-blue-500/20 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 tracking-tight leading-snug font-heading flex items-center gap-1.5">
                <span>Songkhla SecureTrack</span>
              </div>
              <div className="text-[11px] text-blue-700 font-semibold line-clamp-1">
                ระบบติดตามและตรวจสอบความปลอดภัย
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System Subtitle */}
        <div className="px-5 py-2.5 bg-blue-50/70 border-b border-blue-100/80 text-[11px] text-blue-900 flex items-center justify-between">
          <span className="font-semibold line-clamp-1">กิจการควบคุม จ.สงขลา (16 อำเภอ)</span>
          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-[10px] text-blue-800 font-mono font-bold shrink-0 border border-blue-200">
            SECURE-V2
          </span>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
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
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 font-semibold'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/80'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-amber-300' : 'text-slate-400 group-hover:text-blue-600'
                  }`} />
                  <div>
                    <div className="leading-tight">{item.label}</div>
                    <div className={`text-[10px] font-normal leading-tight mt-0.5 ${
                      isActive ? 'text-blue-100' : 'text-slate-400 group-hover:text-slate-500'
                    }`}>
                      {item.subLabel}
                    </div>
                  </div>
                </div>

                {item.badge ? (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor
                  }`}>
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isActive ? 'opacity-100 text-blue-100' : 'text-slate-400'
                  }`} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Officer & Jurisdiction Card */}
        <div className="p-3 border-t border-slate-200/90 bg-slate-50/80 space-y-2">
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-700 font-semibold">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>พื้นที่ 16 อำเภอ</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono ${
                hasUnsyncedChanges 
                  ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${hasUnsyncedChanges ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`}></span>
                {hasUnsyncedChanges ? 'มีร่างรอส่ง' : 'ซิงค์แล้ว'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 leading-relaxed">
              {hasUnsyncedChanges 
                ? 'ตรวจพบข้อมูลฉบับร่างที่บันทึกในเครื่อง รอส่งขึ้น Google Sheets' 
                : 'บันทึกฉบับร่างและเชื่อมต่อ Google Sheets ผ่าน SheetDB API'}
            </div>
          </div>

          {/* Sync to Sheet Button */}
          {onPushToSheet && (
            <button
              onClick={onPushToSheet}
              disabled={isSyncing}
              className={`w-full py-2 px-3 rounded-xl border text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                hasUnsyncedChanges
                  ? 'border-emerald-600 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 ring-1 ring-emerald-400'
                  : 'border-emerald-200 hover:border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
              }`}
              title="ส่งข้อมูลในเครื่องขึ้น Google Sheets"
            >
              {isSyncing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <UploadCloud className="w-3.5 h-3.5 text-current" />
              )}
              <span>📤 ส่งข้อมูลขึ้น Google Sheets</span>
            </button>
          )}

          {/* Fetch from Sheet Button */}
          {onPullFromSheet && (
            <button
              onClick={onPullFromSheet}
              disabled={isSyncing}
              className="w-full py-1.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-medium transition-all flex items-center justify-center gap-1.5 shadow-2xs"
              title="ดึงข้อมูลที่ตรวจสอบล่าสุดจาก Google Sheets เข้าสู่หน้าจอ"
            >
              <DownloadCloud className="w-3.5 h-3.5 text-blue-600" />
              <span>📥 ดึงข้อมูลจาก Google Sheets</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
