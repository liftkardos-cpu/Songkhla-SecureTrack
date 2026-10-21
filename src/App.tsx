/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { InspectionRecord, ActivityLog } from './types';
import { INITIAL_INSPECTION_RECORDS, INITIAL_ACTIVITY_LOGS } from './data/songkhlaData';
import { Sidebar, NavTab } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { RecordsTableView } from './components/RecordsTableView';
import { AnalyticsChartsView } from './components/AnalyticsChartsView';
import { RecordModal } from './components/RecordModal';
import { RecordDetailModal } from './components/RecordDetailModal';
import { ReportGeneratorView } from './components/ReportGeneratorView';
import { AuditTrailView } from './components/AuditTrailView';
import { LegalGuideView } from './components/LegalGuideView';
import { 
  BarChart3, 
  Database, 
  PieChart, 
  FileSpreadsheet, 
  Plus
} from 'lucide-react';

const STORAGE_KEY_RECORDS = 'songkhla_securetrack_records_v1';
const STORAGE_KEY_LOGS = 'songkhla_securetrack_logs_v1';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Inspection records list with localStorage persistence (with empty array persistence)
  const [records, setRecords] = useState<InspectionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      const legacy = localStorage.getItem('songkhla_security_inspection_records_v2');
      if (legacy !== null) {
        const parsed = JSON.parse(legacy);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse records:', e);
    }
    return INITIAL_INSPECTION_RECORDS;
  });

  // Activity logs / Audit trail with localStorage persistence
  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      const legacy = localStorage.getItem('songkhla_security_inspection_logs_v2');
      if (legacy !== null) {
        const parsed = JSON.parse(legacy);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse logs:', e);
    }
    return INITIAL_ACTIVITY_LOGS;
  });

  // Selected district filter for records table
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  // Modal states
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<InspectionRecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<InspectionRecord | null>(null);

  // Sync records to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save records:', e);
    }
  }, [records]);

  // Sync logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to save logs:', e);
    }
  }, [logs]);

  // Count urgent cases (due within 7 days or under active sanction)
  const urgentCount = records.filter(
    r => r.inspectionStatus === 'violation' || r.inspectionStatus === 'suspended' || r.inspectionStatus === 'pending_followup'
  ).length;

  // Add audit log helper
  const addAuditLog = (
    actionType: ActivityLog['actionType'],
    actionLabel: string,
    recordId: string,
    venueName: string,
    officerName: string,
    details: string
  ) => {
    const newLog: ActivityLog = {
      id: `LOG-2568-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
      actionType,
      actionLabel,
      recordId,
      venueName,
      officerName,
      details,
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Handle Save (Add / Update)
  const handleSaveRecord = (savedRecord: InspectionRecord) => {
    setRecords(prev => {
      const exists = prev.some(r => r.id === savedRecord.id);
      if (exists) {
        addAuditLog(
          'update',
          'แก้ไขบันทึกผลการตรวจสอบ',
          savedRecord.id,
          savedRecord.venueName,
          savedRecord.officerName,
          `ปรับปรุงผลการตรวจเป็น ${savedRecord.inspectionStatus} มาตรการ: ${savedRecord.legalAction}`
        );
        return prev.map(r => (r.id === savedRecord.id ? savedRecord : r));
      } else {
        addAuditLog(
          savedRecord.legalAction === 'closed_order_22' || savedRecord.legalAction === 'police_case' ? 'legal_order' : 'create',
          'บันทึกผลการตรวจสอบใหม่',
          savedRecord.id,
          savedRecord.venueName,
          savedRecord.officerName,
          `บันทึกผลตรวจสถานประกอบการในพื้นที่ ${savedRecord.district} ผล: ${savedRecord.inspectionStatus}`
        );
        return [savedRecord, ...prev];
      }
    });
  };

  // Handle Delete
  const handleDeleteRecord = (id: string) => {
    const target = records.find(r => r.id === id);
    if (target) {
      addAuditLog(
        'delete',
        'ลบบันทึกข้อมูลสถานประกอบการ',
        target.id,
        target.venueName,
        'นายสมชาย มั่นคง (ปลัดอำเภอ หน.กลุ่มงาน)',
        `ลบรายการตรวจของ ${target.venueName} ออกจากระบบ`
      );
    }
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  // Open modal for new record
  const handleOpenAddModal = () => {
    setEditingRecord(null);
    setIsRecordModalOpen(true);
  };

  // Open modal for editing record
  const handleEditRecord = (record: InspectionRecord) => {
    setEditingRecord(record);
    setIsRecordModalOpen(true);
  };

  // View detail docket
  const handleViewRecord = (record: InspectionRecord) => {
    setViewingRecord(record);
  };

  // Jump from Dashboard district card to records table
  const handleSelectDistrictFromDashboard = (districtName: string) => {
    setSelectedDistrict(districtName);
    setActiveTab('records');
  };

  // 1. Reset all records and statistics to 0 (Reset Data)
  const handleResetToZero = () => {
    if (confirm('ยืนยันการ "รีเซ็ตข้อมูลเป็น 0 (Reset Data)" หรือไม่?\n\n*ข้อควรทราบ: ข้อมูลสถานประกอบการทั้งหมดจะถูกล้างเป็น 0 แห่ง และบันทึกลงใน localStorage ทันที (ท่านสามารถกด "โหลดข้อมูลตัวอย่างจริง" เพื่อดึงข้อมูลกลับมาได้ทุกเมื่อ)')) {
      setRecords([]);
      const clearLog: ActivityLog = {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actionType: 'delete',
        actionLabel: 'รีเซ็ตข้อมูลเป็น 0 (Reset Data)',
        recordId: 'RESET-ZERO',
        venueName: 'ทุกสถานประกอบการ (16 อำเภอ)',
        officerName: 'นายสมชาย มั่นคง (ปลัดอำเภอ หน.กลุ่มงาน)',
        details: 'ดำเนินการล้างข้อมูลทะเบียนตรวจและสถิติทั้งหมดเป็น 0 รายการ บันทึกลง localStorage แล้ว'
      };
      setLogs(prev => [clearLog, ...prev]);
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify([]));
      alert('รีเซ็ตข้อมูลสถานประกอบการและสถิติทั้งหมดเป็น 0 แห่งเรียบร้อยแล้ว');
    }
  };

  // 2. Load Real/Sample Data for Songkhla (16 districts)
  const handleLoadRealData = () => {
    setRecords(INITIAL_INSPECTION_RECORDS);
    setLogs(INITIAL_ACTIVITY_LOGS);
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(INITIAL_INSPECTION_RECORDS));
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(INITIAL_ACTIVITY_LOGS));
    alert('โหลดข้อมูลตัวอย่างจริงของ 16 อำเภอในจังหวัดสงขลา (12 แห่ง) เรียบร้อยแล้ว ข้อมูลถูกบันทึกลง localStorage แล้ว');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* 1. Sleek Modern Sidebar for Desktop & Slide-over Drawer for Mobile */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        totalRecordsCount={records.length}
        urgentCount={urgentCount}
        onResetToZero={handleResetToZero}
        onLoadRealData={handleLoadRealData}
      />

      {/* 2. Main Content Viewport (Fluid widescreen width scaling up to 1920px) */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen transition-all w-full overflow-x-hidden">
        {/* Fixed Top Header */}
        <TopHeader
          activeTab={activeTab}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onOpenAddModal={handleOpenAddModal}
          urgentCount={urgentCount}
          onSelectUrgentNotification={() => {
            setSelectedDistrict('all');
            setActiveTab('records');
          }}
          onResetToZero={handleResetToZero}
          onLoadRealData={handleLoadRealData}
        />

        {/* Fluid Responsive Content Body (Optimized for Mobile, Tablet & Widescreen Desktop) */}
        <main className="flex-1 w-full max-w-[1850px] mx-auto p-3 sm:p-5 lg:p-7 xl:p-8 space-y-5 sm:space-y-6 pb-20 lg:pb-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              records={records}
              onSelectDistrict={handleSelectDistrictFromDashboard}
              onViewRecord={handleViewRecord}
              onOpenAddModal={handleOpenAddModal}
              onGoToAnalytics={() => setActiveTab('analytics')}
              onGoToRecords={() => setActiveTab('records')}
              onResetToZero={handleResetToZero}
              onLoadRealData={handleLoadRealData}
            />
          )}

          {activeTab === 'records' && (
            <RecordsTableView
              records={records}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              onOpenAddModal={handleOpenAddModal}
              onEditRecord={handleEditRecord}
              onViewRecord={handleViewRecord}
              onDeleteRecord={handleDeleteRecord}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsChartsView records={records} />
          )}

          {activeTab === 'report' && (
            <ReportGeneratorView records={records} />
          )}

          {activeTab === 'audit' && (
            <AuditTrailView logs={logs} />
          )}

          {activeTab === 'legal' && (
            <LegalGuideView />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white/80 border-t border-slate-200/80 text-slate-500 text-xs py-4 px-4 sm:px-6 no-print mt-auto hidden lg:block">
          <div className="w-full max-w-[1850px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">
                กลุ่มงานความมั่นคง ที่ทำการปกครองจังหวัดสงขลา
              </span>
              <span>·</span>
              <span>ระบบสารสนเทศจัดระเบียบสังคมและควบคุมสถานบริการ V2.0</span>
            </div>
            <div className="text-[11px] text-slate-400">
              ศาลากลางจังหวัดสงขลา ถ.ราชดำเนิน อ.เมืองสงขลา 90000
            </div>
          </div>
        </footer>

        {/* Mobile Quick Action Bottom Dock (Thumb-friendly navigation for Field Officers on Patrol) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 flex items-center justify-around shadow-lg no-print">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[56px] px-2 py-1 rounded-xl transition-all ${
              activeTab === 'dashboard' ? 'text-blue-700 font-bold bg-blue-50/80' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">ภาพรวม</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[56px] px-2 py-1 rounded-xl transition-all relative ${
              activeTab === 'records' ? 'text-blue-700 font-bold bg-blue-50/80' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Database className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">ทะเบียน</span>
            {records.length > 0 && (
              <span className="absolute top-1 right-2 px-1 text-[9px] font-bold rounded-full bg-slate-200 text-slate-700">
                {records.length}
              </span>
            )}
          </button>

          {/* Quick Floating Add Button */}
          <button
            onClick={handleOpenAddModal}
            className="flex flex-col items-center justify-center w-12 h-12 -mt-4 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-lg shadow-blue-900/40 active:scale-95 transition-all"
            title="เพิ่มบันทึกการตรวจใหม่"
          >
            <Plus className="w-6 h-6" />
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[56px] px-2 py-1 rounded-xl transition-all ${
              activeTab === 'analytics' ? 'text-blue-700 font-bold bg-blue-50/80' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <PieChart className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">กราฟสถิติ</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[56px] px-2 py-1 rounded-xl transition-all ${
              activeTab === 'report' ? 'text-blue-700 font-bold bg-blue-50/80' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">รายงาน</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Record Modal */}
      <RecordModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSave={handleSaveRecord}
        editingRecord={editingRecord}
      />

      {/* Record Full Docket Modal */}
      <RecordDetailModal
        record={viewingRecord}
        onClose={() => setViewingRecord(null)}
        onEdit={handleEditRecord}
      />
    </div>
  );
}
