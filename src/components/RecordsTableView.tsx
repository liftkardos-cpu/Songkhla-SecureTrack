import React, { useState, useMemo } from 'react';
import { InspectionRecord, BusinessType, InspectionStatus } from '../types';
import { 
  SONGKHLA_DISTRICTS, 
  BUSINESS_TYPE_OPTIONS, 
  STATUS_CONFIG, 
  LEGAL_ACTION_OPTIONS, 
  toThaiDate 
} from '../data/songkhlaData';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  RotateCcw, 
  Eye, 
  Edit3, 
  Trash2, 
  Calendar,
  AlertCircle,
  Building2,
  MapPin,
  Clock,
  LayoutGrid,
  Table as TableIcon,
  ChevronDown,
  ChevronUp,
  UserCheck
} from 'lucide-react';

interface RecordsTableViewProps {
  records: InspectionRecord[];
  selectedDistrict: string;
  setSelectedDistrict: (d: string) => void;
  onOpenAddModal: () => void;
  onEditRecord: (record: InspectionRecord) => void;
  onViewRecord: (record: InspectionRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export const RecordsTableView: React.FC<RecordsTableViewProps> = ({
  records,
  selectedDistrict,
  setSelectedDistrict,
  onOpenAddModal,
  onEditRecord,
  onViewRecord,
  onDeleteRecord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<BusinessType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<InspectionStatus | 'all'>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'name' | 'next_date'>('date_desc');
  
  // Layout view mode: 'table' or 'cards' (default responsive: table on desktop, cards on mobile)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isFilterOpenMobile, setIsFilterOpenMobile] = useState(false);

  const THAI_MONTHS = [
    { value: 'all', label: 'ทุกช่วงเดือนที่ตรวจ' },
    { value: '10', label: 'ตุลาคม' },
    { value: '11', label: 'พฤศจิกายน' },
    { value: '12', label: 'ธันวาคม' },
    { value: '01', label: 'มกราคม' },
    { value: '02', label: 'กุมภาพันธ์' },
    { value: '03', label: 'มีนาคม' },
    { value: '04', label: 'เมษายน' },
    { value: '05', label: 'พฤษภาคม' },
    { value: '06', label: 'มิถุนายน' },
    { value: '07', label: 'กรกฎาคม' },
    { value: '08', label: 'สิงหาคม' },
    { value: '09', label: 'กันยายน' },
  ];

  // Advanced Multi-filter Logic
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      // 1. District filter
      if (selectedDistrict && selectedDistrict !== 'all' && record.district !== selectedDistrict) {
        return false;
      }
      // 2. Business Type filter
      if (selectedType !== 'all' && record.businessType !== selectedType) {
        return false;
      }
      // 3. Status filter
      if (selectedStatus !== 'all' && record.inspectionStatus !== selectedStatus) {
        return false;
      }
      // 4. Inspection Month filter
      if (selectedMonth !== 'all') {
        const parts = record.lastInspectionDate.split('-');
        if (parts.length >= 2 && parts[1] !== selectedMonth) {
          return false;
        }
      }
      // 5. Free-text search
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = record.venueName.toLowerCase().includes(term);
        const matchLicense = record.licenseNumber.toLowerCase().includes(term);
        const matchOfficer = record.officerName.toLowerCase().includes(term);
        const matchOperator = record.operatorName.toLowerCase().includes(term);
        const matchSubDistrict = record.subDistrict.toLowerCase().includes(term);
        const matchViolations = record.violations.some(v => v.toLowerCase().includes(term));
        if (!matchName && !matchLicense && !matchOfficer && !matchOperator && !matchSubDistrict && !matchViolations) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.lastInspectionDate).getTime() - new Date(a.lastInspectionDate).getTime();
      }
      if (sortBy === 'date_asc') {
        return new Date(a.lastInspectionDate).getTime() - new Date(b.lastInspectionDate).getTime();
      }
      if (sortBy === 'name') {
        return a.venueName.localeCompare(b.venueName, 'th');
      }
      if (sortBy === 'next_date') {
        return new Date(a.nextInspectionDate).getTime() - new Date(b.nextInspectionDate).getTime();
      }
      return 0;
    });
  }, [records, selectedDistrict, selectedType, selectedStatus, selectedMonth, searchTerm, sortBy]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDistrict('all');
    setSelectedType('all');
    setSelectedStatus('all');
    setSelectedMonth('all');
    setSortBy('date_desc');
  };

  // Export to CSV with UTF-8 BOM
  const handleExportCSV = () => {
    const headers = [
      'รหัสบันทึก',
      'ชื่อสถานประกอบการ',
      'เลขที่ใบอนุญาต',
      'ประเภทกิจการ',
      'อำเภอ',
      'ตำบล',
      'วันที่ตรวจล่าสุด',
      'สถานะการตรวจ',
      'มาตรการ/การดำเนินคดี',
      'รายการความผิดที่ตรวจพบ',
      'กำหนดตรวจซ้ำ',
      'เจ้าหน้าที่ผู้รับผิดชอบ',
      'ชุดปฏิบัติการ'
    ];

    const rows = filteredRecords.map(r => {
      const typeLabel = BUSINESS_TYPE_OPTIONS.find(t => t.id === r.businessType)?.label || r.businessType;
      const statusLabel = STATUS_CONFIG[r.inspectionStatus]?.label || r.inspectionStatus;
      const legalActionLabel = LEGAL_ACTION_OPTIONS.find(l => l.id === r.legalAction)?.label || r.legalAction;
      const violationsStr = r.violations.join('; ');

      return [
        r.id,
        `"${r.venueName.replace(/"/g, '""')}"`,
        `"${r.licenseNumber.replace(/"/g, '""')}"`,
        `"${typeLabel}"`,
        `"${r.district}"`,
        `"${r.subDistrict}"`,
        r.lastInspectionDate,
        `"${statusLabel}"`,
        `"${legalActionLabel}"`,
        `"${violationsStr.replace(/"/g, '""')}"`,
        r.nextInspectionDate,
        `"${r.officerName.replace(/"/g, '""')}"`,
        `"${r.inspectingUnit.replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ทะเบียนผลการตรวจสอบสถานประกอบการ_สงขลา_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasActiveFilters = searchTerm || selectedDistrict !== 'all' || selectedType !== 'all' || selectedStatus !== 'all' || selectedMonth !== 'all';
  const activeFiltersCount = (selectedDistrict !== 'all' ? 1 : 0) + (selectedType !== 'all' ? 1 : 0) + (selectedStatus !== 'all' ? 1 : 0) + (selectedMonth !== 'all' ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search and Advanced Multi-filter Container */}
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        {/* Search & Actions Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input with min-height for touch */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อร้าน, เลขที่ใบอนุญาต, ชื่อผู้จัดการ, หรือเจ้าหน้าที่ผู้ตรวจ..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-12 py-2.5 text-base sm:text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all placeholder:text-slate-400 min-h-[44px]"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200/80 rounded px-2 py-1"
              >
                ล้าง
              </button>
            )}
          </div>

          {/* Action Buttons & View Mode Toggle */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setIsFilterOpenMobile(!isFilterOpenMobile)}
              className="lg:hidden px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 min-h-[44px]"
            >
              <Filter className="w-4 h-4 text-slate-600" />
              <span>ตัวกรอง</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
              {isFilterOpenMobile ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {/* View Mode Toggle: Table vs Cards */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 min-h-[36px] ${
                  viewMode === 'table' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="มุมมองตารางข้อมูล"
              >
                <TableIcon className="w-4 h-4" />
                <span className="hidden sm:inline">ตาราง</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 min-h-[36px] ${
                  viewMode === 'cards' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="มุมมองการ์ด (Touch-friendly)"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">การ์ด</span>
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 min-h-[44px] whitespace-nowrap shadow-2xs"
              title="ส่งออกไฟล์ Excel/CSV (UTF-8)"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">ส่งออก Excel</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 active:from-blue-800 active:to-indigo-800 rounded-xl transition-all flex items-center gap-1.5 min-h-[44px] shadow-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มบันทึก</span>
            </button>
          </div>
        </div>

        {/* Multi-Condition Filters Grid (Always visible on desktop, toggleable on mobile) */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-100 text-xs ${
          isFilterOpenMobile ? 'block' : 'hidden lg:grid'
        }`}>
          {/* 1. District */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-blue-600" />
              <span>อำเภอ (16 อำเภอ):</span>
            </label>
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-100 focus:outline-none min-h-[44px] text-base sm:text-xs"
            >
              <option value="all">ทั้งหมด (16 อำเภอ)</option>
              {SONGKHLA_DISTRICTS.map(dist => (
                <option key={dist.name} value={dist.name}>
                  {dist.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Business Type */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">ประเภทกิจการ:</label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value as BusinessType | 'all')}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-100 focus:outline-none min-h-[44px] text-base sm:text-xs"
            >
              <option value="all">ทุกประเภทกิจการ</option>
              {BUSINESS_TYPE_OPTIONS.map(type => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Status */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">ผลการตรวจสอบ:</label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value as InspectionStatus | 'all')}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-100 focus:outline-none min-h-[44px] text-base sm:text-xs"
            >
              <option value="all">ทุกสถานะผลการตรวจ</option>
              <option value="normal">ปกติ / ผ่านเกณฑ์</option>
              <option value="violation">พบการกระทำผิด</option>
              <option value="pending_followup">อยู่ระหว่างติดตามผล</option>
              <option value="suspended">สั่งพักใช้ / สั่งปิด 5 ปี</option>
            </select>
          </div>

          {/* 4. Month */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">ช่วงเดือนที่ตรวจ:</label>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-100 focus:outline-none min-h-[44px] text-base sm:text-xs"
            >
              {THAI_MONTHS.map(m => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Sort & Reset */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">เรียงลำดับ:</label>
            <div className="flex items-center gap-1.5">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full py-2.5 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-100 focus:outline-none min-h-[44px] text-base sm:text-xs"
              >
                <option value="date_desc">ตรวจล่าสุด (ใหม่ไปเก่า)</option>
                <option value="date_asc">ตรวจล่าสุด (เก่าไปใหม่)</option>
                <option value="next_date">นัดตรวจซ้ำ (เร็วสุดก่อน)</option>
                <option value="name">ชื่อสถานประกอบการ</option>
              </select>
              <button
                onClick={handleResetFilters}
                className="p-2.5 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="ล้างตัวกรองทั้งหมด"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Summary & Active Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span>
              แสดง <strong className="text-slate-900 font-mono tabular-nums">{filteredRecords.length}</strong> จากทั้งหมด{' '}
              <span className="font-mono tabular-nums">{records.length}</span> แห่ง
            </span>
            {selectedDistrict !== 'all' && (
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[11px]">
                {selectedDistrict}
              </span>
            )}
            {selectedType !== 'all' && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold text-[11px]">
                {BUSINESS_TYPE_OPTIONS.find(t => t.id === selectedType)?.label.split('(')[0].trim()}
              </span>
            )}
            {selectedStatus !== 'all' && (
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[11px]">
                {STATUS_CONFIG[selectedStatus]?.label}
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline"
            >
              ล้างเงื่อนไขทั้งหมด
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredRecords.length === 0 && (
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-10 text-center text-slate-500 space-y-2">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-base font-bold text-slate-700">ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา</p>
          <p className="text-xs text-slate-400">โปรดลองเปลี่ยนคำค้นหา หรือกดปุ่ม "ล้างเงื่อนไขทั้งหมด"</p>
          <button
            onClick={handleResetFilters}
            className="mt-3 px-4 py-2 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl font-bold transition-colors min-h-[44px]"
          >
            ล้างเงื่อนไขทั้งหมด
          </button>
        </div>
      )}

      {/* Mode 1: High-Density Table (Used when viewMode === 'table') */}
      {filteredRecords.length > 0 && viewMode === 'table' && (
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">ชื่อสถานประกอบการ / ทะเบียน</th>
                  <th className="py-3 px-3">ประเภทกิจการ</th>
                  <th className="py-3 px-3">อำเภอ / ตำบล</th>
                  <th className="py-3 px-3 whitespace-nowrap">วันที่ตรวจล่าสุด</th>
                  <th className="py-3 px-3">สถานะผลการตรวจ</th>
                  <th className="py-3 px-3">มาตรการทางกฎหมาย</th>
                  <th className="py-3 px-3 whitespace-nowrap">กำหนดตรวจซ้ำ</th>
                  <th className="py-3 px-3">เจ้าหน้าที่ผู้ตรวจ</th>
                  <th className="py-3 px-4 text-right">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredRecords.map(record => {
                  const statusCfg = STATUS_CONFIG[record.inspectionStatus] || STATUS_CONFIG.normal;
                  const legalCfg = LEGAL_ACTION_OPTIONS.find(l => l.id === record.legalAction);
                  const typeCfg = BUSINESS_TYPE_OPTIONS.find(t => t.id === record.businessType);
                  const isUrgent = record.inspectionStatus === 'violation' || record.inspectionStatus === 'suspended';

                  return (
                    <tr 
                      key={record.id}
                      className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                      onClick={() => onViewRecord(record)}
                    >
                      {/* Name & License */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors text-xs sm:text-sm">
                          {record.venueName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                          <span>{record.licenseNumber}</span>
                          {record.operatorName && (
                            <>
                              <span>·</span>
                              <span className="text-slate-500">{record.operatorName}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Business Type */}
                      <td className="py-3.5 px-3 text-slate-600">
                        <div className="font-semibold text-slate-800">
                          {typeCfg ? typeCfg.label.split('(')[0].trim() : record.businessType}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {record.businessType === 'entertainment' && 'พ.ร.บ. 2509'}
                          {record.businessType === 'similar_entertainment' && 'คสช. 22/2558'}
                          {record.businessType === 'hotel' && 'พ.ร.บ. 2547'}
                          {record.businessType === 'controlled' && 'กิจการควบคุม'}
                        </div>
                      </td>

                      {/* District & Sub-district */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{record.district}</div>
                        <div className="text-[11px] text-slate-500">ต.{record.subDistrict}</div>
                      </td>

                      {/* Last Inspection Date */}
                      <td className="py-3.5 px-3 whitespace-nowrap font-mono tabular-nums text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{toThaiDate(record.lastInspectionDate)}</span>
                        </div>
                      </td>

                      {/* Inspection Status with Pulsing animation */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                          {isUrgent && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                            </span>
                          )}
                          {!isUrgent && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          )}
                          <span>{statusCfg.label}</span>
                        </span>
                      </td>

                      {/* Legal Action */}
                      <td className="py-3.5 px-3 text-xs">
                        <div className="font-semibold text-slate-900">
                          {legalCfg ? legalCfg.label : '-'}
                        </div>
                        {record.violations.length > 0 && (
                          <div className="text-[11px] text-rose-600 truncate max-w-[190px] font-medium" title={record.violations.join(', ')}>
                            {record.violations[0]}
                          </div>
                        )}
                      </td>

                      {/* Next Inspection Date */}
                      <td className="py-3.5 px-3 whitespace-nowrap font-mono tabular-nums">
                        {record.nextInspectionDate ? (
                          <span className={isUrgent ? 'text-amber-800 font-bold' : 'text-slate-600'}>
                            {toThaiDate(record.nextInspectionDate)}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Officer */}
                      <td className="py-3.5 px-3 text-slate-600 max-w-[150px] truncate" title={record.officerName}>
                        <div className="font-semibold text-slate-800 truncate">{record.officerName}</div>
                        <div className="text-[10px] text-slate-400 truncate">{record.inspectingUnit}</div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewRecord(record)}
                            className="p-2 text-slate-500 hover:text-blue-700 hover:bg-blue-100/60 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                            title="ดูรายละเอียดการตรวจ"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditRecord(record)}
                            className="p-2 text-slate-500 hover:text-amber-700 hover:bg-amber-100/60 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                            title="แก้ไขข้อมูล"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`ยืนยันการลบรายการตรวจของ "${record.venueName}" หรือไม่?`)) {
                                onDeleteRecord(record.id);
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-rose-700 hover:bg-rose-100/60 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                            title="ลบรายการ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mode 2: Touch-Friendly Responsive Card Grid (Ideal for Mobile Devices & Field Officers) */}
      {filteredRecords.length > 0 && viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredRecords.map(record => {
            const statusCfg = STATUS_CONFIG[record.inspectionStatus] || STATUS_CONFIG.normal;
            const legalCfg = LEGAL_ACTION_OPTIONS.find(l => l.id === record.legalAction);
            const typeCfg = BUSINESS_TYPE_OPTIONS.find(t => t.id === record.businessType);
            const isUrgent = record.inspectionStatus === 'violation' || record.inspectionStatus === 'suspended';

            return (
              <div
                key={record.id}
                className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                {/* Card Top: Title, License & Status Pill */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {record.venueName}
                      </h4>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        เลขทะเบียน: {record.licenseNumber}
                      </div>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border shrink-0 ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                      {isUrgent && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                        </span>
                      )}
                      <span>{statusCfg.label}</span>
                    </span>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-medium text-[11px] flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {record.district} · ต.{record.subDistrict}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {typeCfg ? typeCfg.label.split('(')[0].trim() : record.businessType}
                    </span>
                  </div>
                </div>

                {/* Card Middle: Inspection Findings & Dates */}
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      ตรวจล่าสุด:
                    </span>
                    <span className="font-mono tabular-nums font-semibold text-slate-800">
                      {toThaiDate(record.lastInspectionDate)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      กำหนดตรวจซ้ำ:
                    </span>
                    <span className="font-mono tabular-nums font-bold text-amber-800">
                      {record.nextInspectionDate ? toThaiDate(record.nextInspectionDate) : 'ไม่ต้องตรวจซ้ำ'}
                    </span>
                  </div>

                  <div className="pt-1.5 border-t border-slate-200/60">
                    <span className="text-slate-500 block text-[11px]">มาตรการทางกฎหมาย:</span>
                    <span className="font-semibold text-slate-800 block mt-0.5">
                      {legalCfg ? legalCfg.label : '-'}
                    </span>
                  </div>

                  {record.violations.length > 0 && (
                    <div className="text-[11px] text-rose-600 font-medium bg-rose-50 p-2 rounded-lg border border-rose-100">
                      <strong>ความผิดที่พบ:</strong> {record.violations[0]}
                    </div>
                  )}

                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>ผู้ตรวจ: {record.officerName}</span>
                  </div>
                </div>

                {/* Card Bottom: Full Touch Target Action Buttons (min-height 44px) */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => onViewRecord(record)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 font-semibold rounded-xl text-xs transition-colors min-h-[44px]"
                  >
                    <Eye className="w-4 h-4" />
                    <span>ดูผล</span>
                  </button>
                  <button
                    onClick={() => onEditRecord(record)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-800 font-semibold rounded-xl text-xs transition-colors min-h-[44px]"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>แก้ไข</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`ยืนยันการลบรายการตรวจของ "${record.venueName}" หรือไม่?`)) {
                        onDeleteRecord(record.id);
                      }
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 font-semibold rounded-xl text-xs transition-colors min-h-[44px]"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>ลบ</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
