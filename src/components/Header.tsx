import React from 'react';
import { ShieldCheck, Plus, BarChart3, Database, FileSpreadsheet, BookOpen, MapPin } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'records' | 'report' | 'legal';
  setActiveTab: (tab: 'dashboard' | 'records' | 'report' | 'legal') => void;
  onOpenAddModal: () => void;
  totalRecordsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  totalRecordsCount,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      {/* Top Ministry & Provincial Identifier Bar */}
      <div className="bg-slate-950 px-4 sm:px-6 py-1.5 border-b border-slate-800/80 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
          <span>กลุ่มงานความมั่นคง ที่ทำการปกครองจังหวัดสงขลา</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">ศาลากลางจังหวัดสงขลา ถนนราชดำเนิน อ.เมืองสงขลา 90000</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" />
            พื้นที่รับผิดชอบ 16 อำเภอ
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-mono tabular-nums">ข้อมูลในระบบ: {totalRecordsCount} แห่ง</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark / Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-700/80 border border-blue-500/40 flex items-center justify-center text-amber-300 shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
              ระบบฐานข้อมูลและติดตามผลการตรวจสอบสถานบริการ
            </h1>
            <p className="text-xs text-slate-400">
              กิจการควบคุมและโรงแรม · ฝ่ายความมั่นคง ที่ทำการปกครองจังหวัดสงขลา
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Buttons styled cleanly) */}
        <nav className="flex items-center gap-1 bg-slate-800/60 p-1 rounded-lg border border-slate-700/60 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            ภาพรวมสถิติ
          </button>
          
          <button
            onClick={() => setActiveTab('records')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'records'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Database className="w-4 h-4" />
            ฐานข้อมูลการตรวจ ({totalRecordsCount})
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'report'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            สรุปรายงานราชการ
          </button>

          <button
            onClick={() => setActiveTab('legal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'legal'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            คู่มือกฎหมาย
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-500 active:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            เพิ่มบันทึกการตรวจใหม่
          </button>
        </div>
      </div>
    </header>
  );
};
