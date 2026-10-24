import React from 'react';
import { InspectionRecord } from '../types';
import { SONGKHLA_DISTRICTS, toThaiDate } from '../data/songkhlaData';
import { SmartReminderBanner } from './SmartReminderBanner';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  MapPin, 
  TrendingUp,
  FileText,
  BarChart2,
  ChevronRight,
  Shield,
  ArrowUpRight,
  UploadCloud,
  DownloadCloud,
  RefreshCw,
  FileCheck2
} from 'lucide-react';

interface DashboardViewProps {
  records: InspectionRecord[];
  onSelectDistrict: (districtName: string) => void;
  onViewRecord: (record: InspectionRecord) => void;
  onOpenAddModal: () => void;
  onGoToAnalytics: () => void;
  onGoToRecords: () => void;
  hasUnsyncedChanges?: boolean;
  isSyncing?: boolean;
  onPushToSheet?: () => void;
  onPullFromSheet?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  records,
  onSelectDistrict,
  onViewRecord,
  onOpenAddModal,
  onGoToAnalytics,
  onGoToRecords,
  hasUnsyncedChanges = false,
  isSyncing = false,
  onPushToSheet,
  onPullFromSheet,
}) => {
  // Aggregate KPIs
  const totalVenues = records.length;
  const normalCount = records.filter(r => r.inspectionStatus === 'normal').length;
  const violationCount = records.filter(r => r.inspectionStatus === 'violation').length;
  const pendingCount = records.filter(r => r.inspectionStatus === 'pending_followup').length;
  const suspendedCount = records.filter(r => r.inspectionStatus === 'suspended').length;

  // Breakdown by business type
  const entertainmentCount = records.filter(r => r.businessType === 'entertainment').length;
  const similarCount = records.filter(r => r.businessType === 'similar_entertainment').length;
  const hotelCount = records.filter(r => r.businessType === 'hotel').length;
  const controlledCount = records.filter(r => r.businessType === 'controlled').length;

  // Pending follow-ups queue
  const urgentFollowUps = records
    .filter(r => r.inspectionStatus === 'violation' || r.inspectionStatus === 'pending_followup' || r.inspectionStatus === 'suspended')
    .slice(0, 5);

  // District statistics
  const districtStats = SONGKHLA_DISTRICTS.map(dist => {
    const distRecords = records.filter(r => r.district === dist.name);
    const violations = distRecords.filter(r => r.inspectionStatus === 'violation' || r.inspectionStatus === 'suspended').length;
    const normals = distRecords.filter(r => r.inspectionStatus === 'normal').length;
    return {
      ...dist,
      total: distRecords.length,
      violations,
      normals,
    };
  });

  return (
    <div className="space-y-6">
      {/* 1. Smart Expiry/Inspection Reminder (Alert Banner) */}
      <SmartReminderBanner
        records={records}
        onViewRecord={onViewRecord}
        onGoToRecordsTable={onGoToRecords}
      />

      {/* 1.5 Staging & Cloud Sync Status Banner */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm shadow-xs transition-all ${
        hasUnsyncedChanges
          ? 'bg-amber-50/90 border-amber-300 text-amber-950'
          : 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            hasUnsyncedChanges ? 'bg-amber-200 text-amber-800' : 'bg-emerald-200 text-emerald-800'
          }`}>
            {hasUnsyncedChanges ? <UploadCloud className="w-4 h-4" /> : <FileCheck2 className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">
                {hasUnsyncedChanges 
                  ? '📋 โหมดร่างและตรวจสอบก่อนส่ง (Local Staging)' 
                  : '🟢 ข้อมูลตรงกับ Google Sheets เรียบร้อยแล้ว (Cloud Synced)'}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${
                hasUnsyncedChanges ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold' : 'bg-white/80 border-emerald-200 text-emerald-800'
              }`}>
                {hasUnsyncedChanges ? 'มีรายการรอส่งขึ้นคลาวด์' : 'Google Sheets API'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              {hasUnsyncedChanges
                ? 'ผลตรวจที่ท่านเพิ่มหรือแก้ไขจะถูกบันทึกไว้ในเครื่องก่อน เพื่อให้เจ้าหน้าที่ตรวจสอบความถูกต้อง จากนั้นกดปุ่ม "ส่งข้อมูลขึ้น Google Sheets"'
                : 'ข้อมูลการตรวจสอบเชื่อมต่อโดยตรงกับ Google Sheets (SheetDB API) เจ้าหน้าที่สามารถกดดึงข้อมูลล่าสุด หรือบันทึกผลตรวจใหม่ได้ตลอดเวลา'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {onPullFromSheet && (
            <button
              onClick={onPullFromSheet}
              disabled={isSyncing}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-slate-300 font-semibold rounded-xl text-xs shadow-2xs transition-all flex items-center gap-1.5"
              title="ดึงข้อมูลล่าสุดจาก Google Sheets"
            >
              <DownloadCloud className="w-3.5 h-3.5 text-blue-700" />
              <span>📥 ดึงข้อมูลจาก Sheets</span>
            </button>
          )}

          {onPushToSheet && (
            <button
              onClick={onPushToSheet}
              disabled={isSyncing}
              className={`px-3.5 py-2 font-bold rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5 min-h-[38px] ${
                hasUnsyncedChanges
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white ring-2 ring-emerald-400'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
              title="ส่งข้อมูลที่บันทึกไว้ในเครื่องขึ้น Google Sheets"
            >
              {isSyncing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <UploadCloud className="w-3.5 h-3.5" />
              )}
              <span>📤 ส่งข้อมูลขึ้น Google Sheets</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Executive Welcome & Hero Stat Banner - Light Tone Theme */}
      <div className="bg-gradient-to-br from-white via-blue-50/60 to-indigo-50/70 text-slate-800 rounded-2xl p-6 sm:p-7 shadow-sm border border-blue-200/80 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/90 border border-blue-200 text-xs font-semibold text-blue-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Songkhla SecureTrack · กลุ่มงานความมั่นคง ที่ทำการปกครองจังหวัดสงขลา
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-snug font-heading">
              Songkhla SecureTrack ระบบติดตามและตรวจสอบความปลอดภัยและกิจการควบคุม จังหวัดสงขลา
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              กำกับดูแลบังคับใช้ตาม พ.ร.บ. สถานบริการ พ.ศ. 2509, คำสั่งหัวหน้า คสช. ที่ 22/2558 (สั่งปิด 5 ปี), และ พ.ร.บ. โรงแรม พ.ศ. 2547 บูรณาการ 16 อำเภอ
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onPushToSheet && (
              <button
                onClick={onPushToSheet}
                disabled={isSyncing}
                className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                title="ส่งผลตรวจทั้งหมดขึ้น Google Sheets"
              >
                {isSyncing ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-200" />
                ) : (
                  <UploadCloud className="w-4 h-4 text-emerald-100" />
                )}
                <span>📤 ส่งข้อมูลขึ้น Google Sheets</span>
              </button>
            )}

            {onPullFromSheet && (
              <button
                onClick={onPullFromSheet}
                disabled={isSyncing}
                className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
                title="ดึงข้อมูลจาก Google Sheets"
              >
                <DownloadCloud className="w-4 h-4 text-blue-600" />
                <span>📥 ดึงข้อมูลจาก Google Sheets</span>
              </button>
            )}

            <button
              onClick={onGoToAnalytics}
              className="px-3.5 py-2.5 rounded-xl bg-white/90 hover:bg-white border border-slate-200/90 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <BarChart2 className="w-4 h-4 text-blue-600" />
              <span>ดูกราฟวิเคราะห์</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>บันทึกผลการตรวจใหม่</span>
            </button>
          </div>
        </div>
      </div>

      {/* Zero Data Alert (When venues count is 0) */}
      {totalVenues === 0 && (
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-5 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-200/70 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-amber-900">
                สถานะระบบ: ยังไม่มีข้อมูลในระบบ (0 แห่ง)
              </h4>
              <p className="text-xs text-amber-800/80 mt-0.5 leading-relaxed">
                ขณะนี้ยังไม่มีบันทึกผลการตรวจในเครื่อง ท่านสามารถกด "ดึงข้อมูลจาก Google Sheets" เพื่อดึงข้อมูลเดิมจากคลาวด์ หรือกด "บันทึกผลการตรวจใหม่" เพื่อเริ่มต้นลงข้อมูล
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onPullFromSheet && (
              <button
                onClick={onPullFromSheet}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>📥 ดึงข้อมูลจาก Google Sheets</span>
              </button>
            )}
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4" />
              <span>บันทึกผลตรวจแรก</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Modern KPI Cards Grid (Glassmorphism, rounded-2xl, hover:-translate-y-1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Inspected */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">สถานประกอบการที่ตรวจแล้ว</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100 shadow-2xs">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums font-mono">{totalVenues}</span>
            <span className="text-xs text-slate-500">แห่ง</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>ครอบคลุม 16 อำเภอ</span>
            <span className="text-blue-700 font-semibold flex items-center gap-0.5">
              ข้อมูลปัจจุบัน
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Normal / Passed */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ผลการตรวจปกติ / ผ่านเกณฑ์</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shadow-2xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 tabular-nums font-mono">{normalCount}</span>
            <span className="text-xs text-slate-500">
              แห่ง ({totalVenues ? Math.round((normalCount / totalVenues) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>ปฏิบัติตามกฎหมาย</span>
            <span className="text-emerald-700 font-semibold">เรียบร้อย</span>
          </div>
        </div>

        {/* Violations Found */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ตรวจพบการกระทำความผิด</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-100 shadow-2xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600 tabular-nums font-mono">{violationCount}</span>
            <span className="text-xs text-slate-500">
              แห่ง ({totalVenues ? Math.round((violationCount / totalVenues) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>สั่งแก้ไข / ส่งดำเนินคดี</span>
            <span className="text-rose-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              เฝ้าระวัง
            </span>
          </div>
        </div>

        {/* Pending Follow-up / Suspended */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ติดตามผล & สั่งปิด 5 ปี</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 shadow-2xs">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 tabular-nums font-mono">{pendingCount + suspendedCount}</span>
            <span className="text-xs text-slate-500">
              แห่ง (สั่งปิด {suspendedCount})
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>คำสั่ง คสช. 22/2558</span>
            <span className="text-amber-800 font-semibold">ชุดตรวจติดตาม</span>
          </div>
        </div>
      </div>

      {/* 4. Middle Section: Business Types Breakdown + Urgent Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Types Progress */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">จำแนกตามประเภทกิจการ</h3>
            </div>
            <button
              onClick={onGoToAnalytics}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <span>ดูกราฟ</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-800">สถานบริการ (พ.ร.บ. 2509)</span>
                <span className="font-mono tabular-nums text-slate-900 font-bold">{entertainmentCount} แห่ง</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${totalVenues ? (entertainmentCount / totalVenues) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-800">สถานประกอบการคล้ายสถานบริการ</span>
                <span className="font-mono tabular-nums text-slate-900 font-bold">{similarCount} แห่ง</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-sky-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${totalVenues ? (similarCount / totalVenues) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-800">โรงแรม / ที่พัก (พ.ร.บ. 2547)</span>
                <span className="font-mono tabular-nums text-slate-900 font-bold">{hotelCount} แห่ง</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${totalVenues ? (hotelCount / totalVenues) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-800">กิจการควบคุมตามกฎหมายอื่น</span>
                <span className="font-mono tabular-nums text-slate-900 font-bold">{controlledCount} แห่ง</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-slate-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${totalVenues ? (controlledCount / totalVenues) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-700" />
              ข้อสั่งการฝ่ายปกครอง
            </div>
            <p className="leading-relaxed">
              เน้นย้ำ อ.หาดใหญ่ และ อ.สะเดา ด่านนอก เพิ่มความถี่การตรวจวัดเสียงดนตรีไม่ให้รบกวนชุมชน และตรวจเข้มห้ามมิให้เด็กอายุต่ำกว่า 20 ปีเข้าใช้บริการ
            </p>
          </div>
        </div>

        {/* Urgent Follow-up List */}
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  คิวสถานประกอบการที่ต้องตรวจติดตามผล / สั่งควบคุมพิเศษ
                </h3>
              </div>
              <button
                onClick={onGoToRecords}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <span>ดูทั้งหมด ({urgentFollowUps.length})</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {urgentFollowUps.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  ไม่มีรายการติดตามผลที่ต้องดำเนินการเร่งด่วนในขณะนี้
                </div>
              ) : (
                urgentFollowUps.map(item => {
                  const isSuspended = item.inspectionStatus === 'suspended';

                  return (
                    <div
                      key={item.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-2.5 rounded-xl transition-colors cursor-pointer group"
                      onClick={() => onViewRecord(item)}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {item.venueName}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">({item.district})</span>
                          {isSuspended && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                              สั่งปิด 5 ปี
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-rose-600 line-clamp-1 font-medium">
                          {item.violations.length > 0 ? item.violations[0] : 'อยู่ระหว่างตรวจติดตามผล'}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                          <span>ตรวจล่าสุด: {toThaiDate(item.lastInspectionDate)}</span>
                          <span>·</span>
                          <span className="text-amber-700 font-semibold font-mono">
                            กำหนดตรวจซ้ำ: {toThaiDate(item.nextInspectionDate)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onViewRecord(item);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>บันทึกตรวจ</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>คำสั่ง คสช. ที่ 22/2558 ข้อ 4 สั่งปิดเป็นเวลา 5 ปี</span>
            <button
              onClick={onGoToRecords}
              className="text-blue-600 hover:underline font-medium"
            >
              เปิดตารางติดตามข้อมูล &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 5. 16 Districts Grid (สงขลาทั้ง 16 อำเภอ) */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                สถิติการตรวจสอบรายพื้นที่ (16 อำเภอ จังหวัดสงขลา)
              </h3>
              <p className="text-xs text-slate-500">
                คลิกที่การ์ดอำเภอเพื่อกรองดูรายการสถานบริการและกิจการควบคุมในอำเภอนั้นทันที
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            รวม 16 อำเภอ
          </span>
        </div>

        {/* 16 Districts Grid Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {districtStats.map(dist => (
            <button
              key={dist.name}
              onClick={() => onSelectDistrict(dist.name)}
              className="text-left p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:border-blue-500 hover:bg-blue-50/50 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between h-24 shadow-2xs"
            >
              <div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 line-clamp-1">
                  {dist.name.replace('อำเภอ', 'อ.')}
                </span>
                <span className="text-[10px] text-slate-400 block">{dist.nameEn}</span>
              </div>

              <div className="mt-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 font-mono tabular-nums">{dist.total}</span>
                  <span className="text-[10px] text-slate-500 ml-0.5">แห่ง</span>
                </div>
                {dist.violations > 0 ? (
                  <span className="text-[10px] font-bold text-rose-700 font-mono tabular-nums bg-rose-100/80 px-1.5 py-0.5 rounded">
                    ผิด {dist.violations}
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-700 font-mono tabular-nums font-semibold">
                    ผ่าน {dist.normals}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
