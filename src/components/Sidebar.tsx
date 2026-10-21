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
  ChevronRight
} from 'lucide-react';

export type NavTab = 'dashboard' | 'records' | 'analytics' | 'report' | 'audit' | 'legal';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
  totalRecordsCount: number;
  urgentCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  totalRecordsCount,
  urgentCount,
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 border border-blue-400/30 flex items-center justify-center text-amber-300 shadow-lg shadow-blue-900/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight leading-snug">
                กลุ่มงานความมั่นคง
              </div>
              <div className="text-[11px] text-amber-400/90 font-medium">
                ที่ทำการปกครองจังหวัดสงขลา
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
          <span className="font-medium">ระบบติดตามสถานบริการ</span>
          <span className="px-1.5 py-0.5 rounded bg-blue-900/60 text-[10px] text-blue-300 border border-blue-700/40 font-mono">
            V2.0 PRO
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
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/80">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>พื้นที่รับผิดชอบ: 16 อำเภอ</span>
            </div>
            <div className="text-[11px] text-slate-400 leading-relaxed">
              ครอบคลุมสถานบริการ ผับ บาร์ คาราโอเกะ โรงแรม และกิจการควบคุม
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
