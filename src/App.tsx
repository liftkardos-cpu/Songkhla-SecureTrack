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
import {
  fetchSheetDBRecords,
  pushAllToSheetDB,
} from './services/sheetDbService';

const STORAGE_KEY_RECORDS = 'songkhla_securetrack_records_v1';
const STORAGE_KEY_UNSYNCED = 'songkhla_securetrack_unsynced_v1';
const STORAGE_KEY_LOGS = 'songkhla_securetrack_logs_v1';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Staging tracking: Are there unpushed local changes?
  const [hasUnsyncedChanges, setHasUnsyncedChanges] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_UNSYNCED) === 'true';
    } catch {
      return false;
    }
  });

  // Inspection records list with localStorage persistence
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

  // SheetDB Google Sheets sync state
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'idle'>('idle');

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

  // Initial Fetch Data (GET) from Google Sheets via SheetDB on load
  useEffect(() => {
    let isMounted = true;
    const fetchFromSheets = async () => {
      // If there are unsynced staged changes in localStorage, do not overwrite them automatically
      const hasPending = localStorage.getItem(STORAGE_KEY_UNSYNCED) === 'true';
      if (hasPending) {
        setSyncStatus('idle');
        return;
      }

      setIsSyncing(true);
      setSyncStatus('syncing');
      try {
        const sheetData = await fetchSheetDBRecords();
        if (isMounted) {
          if (sheetData.length > 0) {
            setRecords(sheetData);
            setHasUnsyncedChanges(false);
            localStorage.setItem(STORAGE_KEY_UNSYNCED, 'false');
            localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(sheetData));
            addAuditLog(
              'create',
              'ซิงค์ข้อมูลจาก Google Sheets (SheetDB)',
              'SHEET-SYNC',
              'Google Sheets Backend',
              'ระบบอัตโนมัติ',
              `ดึงข้อมูลการตรวจสอบ ${sheetData.length} รายการจาก Google Sheets เรียบร้อยแล้ว`
            );
          }
          setSyncStatus('synced');
        }
      } catch (err) {
        console.warn('SheetDB GET on load failed, using local storage cache:', err);
        if (isMounted) {
          setSyncStatus('error');
        }
      } finally {
        if (isMounted) {
          setIsSyncing(false);
        }
      }
    };

    fetchFromSheets();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync records and staging flag to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
      localStorage.setItem(STORAGE_KEY_UNSYNCED, hasUnsyncedChanges ? 'true' : 'false');
    } catch (e) {
      console.error('Failed to save records:', e);
    }
  }, [records, hasUnsyncedChanges]);

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

  // Staging Save: Local Draft & Review before Cloud Sync
  const handleSaveRecord = (savedRecord: InspectionRecord) => {
    const exists = records.some(r => r.id === savedRecord.id);

    if (exists) {
      setRecords(prev => prev.map(r => (r.id === savedRecord.id ? savedRecord : r)));
      addAuditLog(
        'update',
        'แก้ไขบันทึกผลการตรวจสอบ (แบบร่างในเครื่อง)',
        savedRecord.id,
        savedRecord.venueName,
        savedRecord.officerName,
        `ปรับปรุงผลการตรวจเป็น ${savedRecord.inspectionStatus} มาตรการ: ${savedRecord.legalAction} (รอส่งขึ้น Google Sheets)`
      );
    } else {
      setRecords(prev => [savedRecord, ...prev]);
      addAuditLog(
        savedRecord.legalAction === 'closed_order_22' || savedRecord.legalAction === 'police_case' ? 'legal_order' : 'create',
        'บันทึกผลการตรวจสอบใหม่ (แบบร่างในเครื่อง)',
        savedRecord.id,
        savedRecord.venueName,
        savedRecord.officerName,
        `บันทึกผลตรวจสถานประกอบการในพื้นที่ ${savedRecord.district} ผล: ${savedRecord.inspectionStatus} (รอส่งขึ้น Google Sheets)`
      );
    }

    setHasUnsyncedChanges(true);
  };

  // Staging Delete: Local Delete before Cloud Sync
  const handleDeleteRecord = (id: string) => {
    const target = records.find(r => r.id === id);
    if (target) {
      addAuditLog(
        'delete',
        'ลบบันทึกข้อมูลสถานประกอบการ (แบบร่างในเครื่อง)',
        target.id,
        target.venueName,
        'นายสมชาย มั่นคง (ปลัดอำเภอ หน.กลุ่มงาน)',
        `ลบรายการตรวจของ ${target.venueName} ออกจากแบบร่างในเครื่อง (รอส่งขึ้น Google Sheets)`
      );
    }
    setRecords(prev => prev.filter(r => r.id !== id));
    setHasUnsyncedChanges(true);
  };

  // Manual Push Button: "📤 ส่งข้อมูลขึ้น Google Sheets (Sync to Sheet)"
  const handlePushToSheet = async () => {
    setIsSyncing(true);
    setSyncStatus('syncing');
    try {
      await pushAllToSheetDB(records);
      setHasUnsyncedChanges(false);
      localStorage.setItem(STORAGE_KEY_UNSYNCED, 'false');
      setSyncStatus('synced');
      addAuditLog(
        'update',
        'ส่งข้อมูลขึ้น Google Sheets สำเร็จ',
        'PUSH-SHEET',
        'Google Sheets Backend',
        'นายสมชาย มั่นคง (ปลัดอำเภอ หน.กลุ่มงาน)',
        `ซิงค์ส่งผลตรวจจำนวน ${records.length} รายการขึ้น Google Sheets เรียบร้อยแล้ว`
      );
      alert(`📤 ส่งข้อมูลขึ้น Google Sheets (SheetDB API) สำเร็จเรียบร้อยแล้ว!\n\nจำนวนข้อมูลที่ซิงค์: ${records.length} รายการ`);
    } catch (err) {
      console.error('Push to Google Sheets failed:', err);
      setSyncStatus('error');
      alert('ไม่สามารถส่งข้อมูลขึ้น Google Sheets ได้ในขณะนี้ โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
    } finally {
      setIsSyncing(false);
    }
  };

  // Manual Pull Button: "📥 ดึงข้อมูลจาก Google Sheets (Fetch from Sheet)"
  const handlePullFromSheet = async () => {
    if (hasUnsyncedChanges) {
      const confirmOverride = confirm(
        '⚠️ มีข้อมูลฉบับร่างที่บันทึกอยู่ในเครื่องแต่ยังไม่ได้ส่งขึ้น Google Sheets\n\n' +
        'หากดึงข้อมูลจาก Google Sheets ข้อมูลในเครื่องจะถูกแทนที่ด้วยข้อมูลล่าสุดบนคลาวด์\n\n' +
        'ต้องการดึงข้อมูลต่อหรือไม่?'
      );
      if (!confirmOverride) return;
    }

    setIsSyncing(true);
    setSyncStatus('syncing');
    try {
      const sheetData = await fetchSheetDBRecords();
      setRecords(sheetData);
      setHasUnsyncedChanges(false);
      localStorage.setItem(STORAGE_KEY_UNSYNCED, 'false');
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(sheetData));
      setSyncStatus('synced');
      addAuditLog(
        'create',
        'ดึงข้อมูลจาก Google Sheets สำเร็จ',
        'PULL-SHEET',
        'Google Sheets Backend',
        'นายสมชาย มั่นคง (ปลัดอำเภอ หน.กลุ่มงาน)',
        `ดึงข้อมูลการตรวจสอบ ${sheetData.length} รายการจาก Google Sheets เข้าสู่หน้าจอ`
      );
      alert(`📥 ดึงข้อมูลจาก Google Sheets สำเร็จ!\n\nปัจจุบันมีข้อมูล ${sheetData.length} รายการในระบบ`);
    } catch (err) {
      console.error('Fetch from Google Sheets failed:', err);
      setSyncStatus('error');
      alert('ไม่สามารถเชื่อมต่อ Google Sheets ได้ในขณะนี้ โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
    } finally {
      setIsSyncing(false);
    }
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

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* 1. Modern Sidebar for Desktop & Slide-over Drawer for Mobile */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        totalRecordsCount={records.length}
        urgentCount={urgentCount}
        hasUnsyncedChanges={hasUnsyncedChanges}
        isSyncing={isSyncing}
        onPushToSheet={handlePushToSheet}
        onPullFromSheet={handlePullFromSheet}
      />

      {/* 2. Main Content Viewport */}
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
          hasUnsyncedChanges={hasUnsyncedChanges}
          isSyncing={isSyncing}
          syncStatus={syncStatus}
          onPushToSheet={handlePushToSheet}
          onPullFromSheet={handlePullFromSheet}
        />

        {/* Responsive Content Body */}
        <main className="flex-1 w-full max-w-[1850px] mx-auto p-3 sm:p-5 lg:p-7 xl:p-8 space-y-5 sm:space-y-6 pb-20 lg:pb-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              records={records}
              onSelectDistrict={handleSelectDistrictFromDashboard}
              onViewRecord={handleViewRecord}
              onOpenAddModal={handleOpenAddModal}
              onGoToAnalytics={() => setActiveTab('analytics')}
              onGoToRecords={() => setActiveTab('records')}
              hasUnsyncedChanges={hasUnsyncedChanges}
              isSyncing={isSyncing}
              onPushToSheet={handlePushToSheet}
              onPullFromSheet={handlePullFromSheet}
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
              <span>ระบบฐานข้อมูลและติดตามผลการตรวจสอบสถานบริการและกิจการควบคุม</span>
            </div>
            <div className="text-[11px] text-slate-400">
              ศาลากลางจังหวัดสงขลา ถ.ราชดำเนิน อ.เมืองสงขลา 90000
            </div>
          </div>
        </footer>

        {/* Mobile Quick Action Bottom Dock */}
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
