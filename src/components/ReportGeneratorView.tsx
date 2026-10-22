import React, { useState, useMemo } from 'react';
import { InspectionRecord } from '../types';
import { SONGKHLA_DISTRICTS } from '../data/songkhlaData';
import { Printer, Download, FileSpreadsheet, Building2, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ReportGeneratorViewProps {
  records: InspectionRecord[];
}

export const ReportGeneratorView: React.FC<ReportGeneratorViewProps> = ({ records }) => {
  const [selectedMonth, setSelectedMonth] = useState('10'); // October (Start of Thai fiscal year)
  const [selectedYearBE, setSelectedYearBE] = useState('2568'); // B.E. 2568

  // Month names in Thai
  const THAI_MONTHS = [
    { value: 'all', label: 'ทั้งปีงบประมาณ' },
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

  // Convert selected BE year to CE year
  const selectedYearCE = (parseInt(selectedYearBE, 10) - 543).toString();

  // Filter records by selected period
  const periodRecords = useMemo(() => {
    return records.filter(r => {
      const parts = r.lastInspectionDate.split('-');
      if (parts.length < 2) return true;
      const recYear = parts[0];
      const recMonth = parts[1];

      if (recYear !== selectedYearCE) return false;
      if (selectedMonth !== 'all' && recMonth !== selectedMonth) return false;
      return true;
    });
  }, [records, selectedMonth, selectedYearCE]);

  // Aggregate metrics across 16 districts
  const districtMatrix = useMemo(() => {
    return SONGKHLA_DISTRICTS.map((dist, index) => {
      const distRecs = periodRecords.filter(r => r.district === dist.name);
      const total = distRecs.length;
      const normal = distRecs.filter(r => r.inspectionStatus === 'normal').length;
      const violations = distRecs.filter(r => r.inspectionStatus === 'violation' || r.inspectionStatus === 'suspended').length;
      const warned = distRecs.filter(r => r.legalAction === 'warned').length;
      const rectify = distRecs.filter(r => r.legalAction === 'rectify_ordered').length;
      const suspendedOrClosed = distRecs.filter(r => r.legalAction === 'suspended_temp' || r.legalAction === 'closed_order_22').length;
      const policeCase = distRecs.filter(r => r.legalAction === 'police_case').length;
      const pendingFollowup = distRecs.filter(r => r.inspectionStatus === 'pending_followup').length;

      return {
        no: index + 1,
        district: dist.name,
        total,
        normal,
        violations,
        warned,
        rectify,
        suspendedOrClosed,
        policeCase,
        pendingFollowup,
      };
    });
  }, [periodRecords]);

  // Totals row
  const totals = useMemo(() => {
    return districtMatrix.reduce(
      (acc, cur) => ({
        total: acc.total + cur.total,
        normal: acc.normal + cur.normal,
        violations: acc.violations + cur.violations,
        warned: acc.warned + cur.warned,
        rectify: acc.rectify + cur.rectify,
        suspendedOrClosed: acc.suspendedOrClosed + cur.suspendedOrClosed,
        policeCase: acc.policeCase + cur.policeCase,
        pendingFollowup: acc.pendingFollowup + cur.pendingFollowup,
      }),
      { total: 0, normal: 0, violations: 0, warned: 0, rectify: 0, suspendedOrClosed: 0, policeCase: 0, pendingFollowup: 0 }
    );
  }, [districtMatrix]);

  // Top violations list
  const violationCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    periodRecords.forEach(r => {
      r.violations.forEach(v => {
        counts[v] = (counts[v] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [periodRecords]);

  // Export Summary Table to CSV (UTF-8 BOM)
  const handleExportSummaryCSV = () => {
    const monthLabel = THAI_MONTHS.find(m => m.value === selectedMonth)?.label;
    const title = `รายงานสรุปผลการตรวจสอบสถานบริการและกิจการควบคุม_จ_สงขลา_ประจำเดือน_${monthLabel}_พศ_${selectedYearBE}`;

    const headers = [
      'ลำดับ',
      'อำเภอ',
      'จำนวนสถานบริการที่ตรวจ (แห่ง)',
      'ผลปกติ (แห่ง)',
      'พบการกระทำผิด (แห่ง)',
      'ว่ากล่าวตักเตือน (แห่ง)',
      'สั่งแก้ไขปรับปรุง (แห่ง)',
      'สั่งพักใช้/สั่งปิด 5 ปี (แห่ง)',
      'ส่งดำเนินคดี สภ. (แห่ง)',
      'อยู่ระหว่างติดตามผล (แห่ง)'
    ];

    const rows = districtMatrix.map(d => [
      d.no,
      `"${d.district}"`,
      d.total,
      d.normal,
      d.violations,
      d.warned,
      d.rectify,
      d.suspendedOrClosed,
      d.policeCase,
      d.pendingFollowup
    ].join(','));

    // Totals row
    rows.push([
      'รวมทั้งสิ้น',
      '"16 อำเภอ"',
      totals.total,
      totals.normal,
      totals.violations,
      totals.warned,
      totals.rectify,
      totals.suspendedOrClosed,
      totals.policeCase,
      totals.pendingFollowup
    ].join(','));

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${title}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentMonthName = THAI_MONTHS.find(m => m.value === selectedMonth)?.label;

  return (
    <div className="space-y-6">
      {/* Control Bar: Month/Year selector & Print/Export actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 no-print">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-slate-700">ประจำเดือน:</span>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            >
              {THAI_MONTHS.map(m => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-slate-700">ปี พ.ศ.:</span>
            <select
              value={selectedYearBE}
              onChange={e => setSelectedYearBE(e.target.value)}
              className="py-1.5 px-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            >
              <option value="2568">2568</option>
              <option value="2569">2569</option>
              <option value="2567">2567</option>
            </select>
          </div>

          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs text-slate-500">
            จำนวนบันทึกในช่วงเวลา: <strong className="text-slate-900 font-mono tabular-nums">{periodRecords.length}</strong> รายการ
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href="/songkhla_securetrack.html"
            target="_blank"
            rel="noreferrer"
            download="Songkhla_SecureTrack_ระบบติดตามและตรวจสอบความปลอดภัยและกิจการควบคุม_สงขลา.html"
            className="px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
            title="ดาวน์โหลดไฟล์ Single-file HTML (Songkhla SecureTrack) พกพาเปิดใช้งานได้ทุกที่ ไม่ต้องต่อเน็ต"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>ดาวน์โหลด Single-file HTML</span>
          </a>

          <button
            onClick={handleExportSummaryCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>ส่งออก Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์รายงานสรุปราชการ (A4)</span>
          </button>
        </div>
      </div>

      {/* Official Government Memorandum / Report Format */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-xs space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Official Header */}
        <div className="text-center pb-4 border-b border-slate-300">
          <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-blue-900 text-amber-300 flex items-center justify-center font-bold text-xl shadow-xs print:border print:border-black">
            สข
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            รายงานผลการจัดระเบียบสังคมและตรวจสอบสถานบริการ โรงแรม และกิจการควบคุม
          </h2>
          <p className="text-sm font-medium text-slate-700 mt-1">
            จังหวัดสงขลา ประจำเดือน{currentMonthName} พุทธศักราช {selectedYearBE}
          </p>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-center gap-3">
            <span>กลุ่มงานความมั่นคง ที่ทำการปกครองจังหวัดสงขลา</span>
            <span>·</span>
            <span>ที่ทำการปกครองจังหวัดสงขลา ศาลากลางจังหวัดสงขลา</span>
          </div>
        </div>

        {/* Narrative Executive Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs sm:text-sm text-slate-800 space-y-2 leading-relaxed">
          <div className="font-bold text-blue-900 flex items-center gap-2 text-sm">
            <ShieldCheck className="w-4 h-4" />
            กราบเรียน ผู้ว่าราชการจังหวัดสงขลา (ผ่าน ปลัดจังหวัดสงขลา)
          </div>
          <p className="indent-6 text-justify">
            กลุ่มงานความมั่นคง ที่ทำการปกครองจังหวัดสงขลา ขอรายงานผลการบูรณาการกำลังร่วมกับอำเภอทั้ง 16 อำเภอ สถานีตำรวจภูธรในพื้นที่ และหน่วยงานที่เกี่ยวข้อง ในการลงพื้นที่ตรวจสอบจัดระเบียบสังคมสถานบริการ สถานประกอบการคล้ายสถานบริการ โรงแรม และกิจการควบคุม ประจำเดือน{currentMonthName} พ.ศ. {selectedYearBE} ปรากฏผลการดำเนินงานดังนี้:
          </p>
          <p className="indent-6 text-justify">
            ได้เข้าตรวจสอบสถานประกอบการรวมทั้งสิ้น <strong>{totals.total}</strong> แห่ง พบว่าเป็นสถานบริการที่ปฏิบัติตามกฎหมายถูกต้อง <strong>{totals.normal}</strong> แห่ง (คิดเป็นร้อยละ {totals.total ? Math.round((totals.normal / totals.total) * 100) : 0}) และตรวจพบการกระทำความผิดหรือไม่ปฏิบัติตามมาตรฐาน <strong>{totals.violations}</strong> แห่ง โดยได้ดำเนินการว่ากล่าวตักเตือนทำทัณฑ์บน <strong>{totals.warned}</strong> แห่ง, สั่งให้แก้ไขปรับปรุงภายในกำหนด <strong>{totals.rectify}</strong> แห่ง, เสนอคำสั่งพักใช้ใบอนุญาต/สั่งปิด 5 ปีตามคำสั่ง คสช. 22/2558 จำนวน <strong>{totals.suspendedOrClosed}</strong> แห่ง และส่งพนักงานสอบสวน สภ. ดำเนินคดีตามกฎหมาย <strong>{totals.policeCase}</strong> แห่ง
          </p>
        </div>

        {/* 16 Districts Matrix Table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">
              ตารางสรุปสถิติผลการตรวจสอบสถานประกอบการ จำแนกรายอำเภอ (16 อำเภอ)
            </h3>
            <span className="text-xs text-slate-500">หน่วย: แห่ง</span>
          </div>

          <div className="border border-slate-300 rounded-lg overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-300">
                  <th className="py-2.5 px-2 text-center w-10">ที่</th>
                  <th className="py-2.5 px-3">อำเภอ</th>
                  <th className="py-2.5 px-2 text-center font-mono">จำนวนตรวจ</th>
                  <th className="py-2.5 px-2 text-center font-mono text-emerald-700">ผลปกติ</th>
                  <th className="py-2.5 px-2 text-center font-mono text-rose-700">พบผิด</th>
                  <th className="py-2.5 px-2 text-center font-mono">ตักเตือน</th>
                  <th className="py-2.5 px-2 text-center font-mono">สั่งแก้ไข</th>
                  <th className="py-2.5 px-2 text-center font-mono text-amber-800">พักใช้/ปิด</th>
                  <th className="py-2.5 px-2 text-center font-mono text-rose-800">ส่ง สภ.</th>
                  <th className="py-2.5 px-2 text-center font-mono">รอติดตาม</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {districtMatrix.map(row => (
                  <tr key={row.district} className="hover:bg-slate-50">
                    <td className="py-2 px-2 text-center text-slate-500 font-mono tabular-nums">{row.no}</td>
                    <td className="py-2 px-3 font-medium text-slate-900">{row.district}</td>
                    <td className="py-2 px-2 text-center font-mono tabular-nums">{row.total}</td>
                    <td className="py-2 px-2 text-center font-mono tabular-nums text-emerald-700">{row.normal}</td>
                    <td className="py-2 px-2 text-center font-mono tabular-nums font-semibold text-rose-700">{row.violations}</td>
                    <td className="py-2 px-2 text-center font-mono tabular-nums text-slate-600">{row.warned}</td>
                    <td className="py-2 px-2 text-center font-mono tabular-nums text-slate-600">{row.rectify}</td>
                    <td className="py-2 px-2 text-center font-mono tabular-nums text-amber-800">{row.suspendedOrClosed}</td>
                    <td className="py-2 px-2 text-center font-mono tabular-nums text-rose-800">{row.policeCase}</td>
                    <td className="py-2 px-2 text-center font-mono tabular-nums text-slate-600">{row.pendingFollowup}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-200/80 font-bold text-slate-900 border-t-2 border-slate-300">
                  <td colSpan={2} className="py-2.5 px-3 text-center">รวมทั้งสิ้น (16 อำเภอ)</td>
                  <td className="py-2.5 px-2 text-center font-mono tabular-nums">{totals.total}</td>
                  <td className="py-2.5 px-2 text-center font-mono tabular-nums text-emerald-800">{totals.normal}</td>
                  <td className="py-2.5 px-2 text-center font-mono tabular-nums text-rose-800">{totals.violations}</td>
                  <td className="py-2.5 px-2 text-center font-mono tabular-nums">{totals.warned}</td>
                  <td className="py-2.5 px-2 text-center font-mono tabular-nums">{totals.rectify}</td>
                  <td className="py-2.5 px-2 text-center font-mono tabular-nums text-amber-900">{totals.suspendedOrClosed}</td>
                  <td className="py-2.5 px-2 text-center font-mono tabular-nums text-rose-900">{totals.policeCase}</td>
                  <td className="py-2.5 px-2 text-center font-mono tabular-nums">{totals.pendingFollowup}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Violations Summary Ranking */}
        {violationCounts.length > 0 && (
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 text-rose-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              สรุปฐานความผิดที่ตรวจพบมากที่สุดในรอบเดือน:
            </h4>
            <div className="space-y-1.5 text-xs text-slate-700">
              {violationCounts.map(([name, count], idx) => (
                <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-200/60 last:border-0">
                  <span>{idx + 1}. {name}</span>
                  <span className="font-mono tabular-nums font-semibold text-rose-700">{count} คดี/แห่ง</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Official Sign-off Block */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
          <div className="space-y-8">
            <p className="text-slate-600">
              (ลงชื่อ)........................................................<br />
              ( นายมงคล ศักดิ์เจริญ )<br />
              ปลัดอำเภอ กลุ่มงานความมั่นคง<br />
              ผู้จัดทำรายงาน
            </p>
          </div>
          <div className="space-y-8">
            <p className="text-slate-600">
              (ลงชื่อ)........................................................<br />
              ( นายสมชาย มั่นคง )<br />
              ปลัดอำเภอหัวหน้ากลุ่มงานความมั่นคง<br />
              ที่ทำการปกครองจังหวัดสงขลา
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
