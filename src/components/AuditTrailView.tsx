import React, { useState, useMemo } from 'react';
import { ActivityLog } from '../types';
import { toThaiDateTime } from '../data/songkhlaData';
import { History, Search, Filter, ShieldCheck, User, Calendar, Download, RefreshCw, CheckCircle, AlertOctagon, Edit3, Trash2 } from 'lucide-react';

interface AuditTrailViewProps {
  logs: ActivityLog[];
  onClearLogs?: () => void;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (selectedType !== 'all' && log.actionType !== selectedType) {
        return false;
      }
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchVenue = log.venueName.toLowerCase().includes(term);
        const matchOfficer = log.officerName.toLowerCase().includes(term);
        const matchDetails = log.details.toLowerCase().includes(term);
        const matchLabel = log.actionLabel.toLowerCase().includes(term);
        if (!matchVenue && !matchOfficer && !matchDetails && !matchLabel) {
          return false;
        }
      }
      return true;
    });
  }, [logs, selectedType, searchTerm]);

  // Export audit logs to CSV (UTF-8 BOM)
  const handleExportCSV = () => {
    const headers = ['รหัสบันทึกประวัติ', 'วันเวลาที่ทำรายการ', 'ประเภทการดำเนินการ', 'ชื่อการดำเนินการ', 'สถานประกอบการ', 'เจ้าหน้าที่ผู้ปฏิบัติงาน', 'รายละเอียดข้อเท็จจริง'];
    const rows = filteredLogs.map(l => [
      l.id,
      `"${toThaiDateTime(l.timestamp)}"`,
      `"${l.actionType}"`,
      `"${l.actionLabel.replace(/"/g, '""')}"`,
      `"${l.venueName.replace(/"/g, '""')}"`,
      `"${l.officerName.replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ].join(','));

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ประวัติการทำรายการ_กลุ่มงานความมั่นคง_สงขลา_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (type: ActivityLog['actionType']) => {
    switch (type) {
      case 'create':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            เพิ่มข้อมูลใหม่
          </span>
        );
      case 'legal_order':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <AlertOctagon className="w-3 h-3 text-rose-600" />
            คำสั่งทางกฎหมาย
          </span>
        );
      case 'update':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Edit3 className="w-3 h-3 text-blue-600" />
            แก้ไขข้อมูล
          </span>
        );
      case 'delete':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300">
            <Trash2 className="w-3 h-3 text-slate-500" />
            ลบรายการ
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
            อัปเดตสถานะ
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            ระบบความโปร่งใสและตรวจสอบย้อนหลัง (Audit Trail & Governance)
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            ประวัติการทำรายการและการแก้ไขข้อมูลของเจ้าหน้าที่
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            บันทึกการกระทำทุกขั้นตอนของฝ่ายความมั่นคงตามหลักธรรมาภิบาลและการบริหารกิจการบ้านเมืองที่ดี
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            ส่งออกประวัติ (Excel)
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อเจ้าหน้าที่, ชื่อสถานประกอบการ, หรือรายละเอียดการสั่งการ..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          />
        </div>

        {/* Action Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          >
            <option value="all">ทุกประเภทการกระทำ ({logs.length})</option>
            <option value="create">เพิ่มข้อมูลใหม่</option>
            <option value="legal_order">คำสั่งทางกฎหมาย/สั่งการ</option>
            <option value="update">แก้ไขข้อมูล</option>
            <option value="delete">ลบข้อมูล</option>
          </select>

          {(searchTerm || selectedType !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
              }}
              className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100"
              title="ล้างตัวกรอง"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4 w-44">วันเวลาที่บันทึก</th>
                <th className="py-3 px-3">ประเภท</th>
                <th className="py-3 px-3">การดำเนินการ</th>
                <th className="py-3 px-4">สถานประกอบการ</th>
                <th className="py-3 px-4">เจ้าหน้าที่ผู้ปฏิบัติ</th>
                <th className="py-3 px-4">รายละเอียดข้อเท็จจริง</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-700">ไม่พบประวัติการทำรายการที่ตรงกับเงื่อนไข</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Timestamp */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono tabular-nums text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{toThaiDateTime(log.timestamp)}</span>
                      </div>
                    </td>

                    {/* Action Type Badge */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {getActionBadge(log.actionType)}
                    </td>

                    {/* Action Label */}
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {log.actionLabel}
                    </td>

                    {/* Venue Name */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 line-clamp-1">{log.venueName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">รหัส: {log.recordId}</div>
                    </td>

                    {/* Officer */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[10px]">
                          <User className="w-3 h-3" />
                        </div>
                        <span className="font-medium text-slate-800">{log.officerName}</span>
                      </div>
                    </td>

                    {/* Details */}
                    <td className="py-3 px-4 text-slate-600 max-w-xs">
                      <p className="line-clamp-2" title={log.details}>
                        {log.details}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
