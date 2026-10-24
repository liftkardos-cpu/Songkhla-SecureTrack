import React from 'react';
import { InspectionRecord } from '../types';
import { 
  BUSINESS_TYPE_OPTIONS, 
  STATUS_CONFIG, 
  LEGAL_ACTION_OPTIONS, 
  toThaiFullDate, 
  toThaiDate 
} from '../data/songkhlaData';
import { 
  X, 
  Printer, 
  Edit3, 
  Building2, 
  MapPin, 
  UserCheck, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  ShieldAlert,
  FileCheck
} from 'lucide-react';

interface RecordDetailModalProps {
  record: InspectionRecord | null;
  onClose: () => void;
  onEdit: (record: InspectionRecord) => void;
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({
  record,
  onClose,
  onEdit,
}) => {
  if (!record) return null;

  const statusCfg = STATUS_CONFIG[record.inspectionStatus] || STATUS_CONFIG.normal;
  const legalCfg = LEGAL_ACTION_OPTIONS.find(l => l.id === record.legalAction);
  const typeCfg = BUSINESS_TYPE_OPTIONS.find(t => t.id === record.businessType);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden border border-slate-200 my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Actions - Light Tone */}
        <div className="bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 border-b border-slate-200 text-slate-900 px-6 py-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-600 text-amber-300 shadow-sm shadow-blue-500/20">
              <FileCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">บันทึกผลการตรวจสอบสถานประกอบการ</h3>
              <p className="text-xs text-slate-500">เลขที่อ้างอิง: {record.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="พิมพ์เอกสารบันทึกการตรวจสอบ"
            >
              <Printer className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">พิมพ์เอกสาร</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(record);
              }}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="แก้ไขข้อมูล"
            >
              <Edit3 className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">แก้ไข</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Government Docket Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0">
          {/* Official Header (Emblem & Thai Government Department) */}
          <div className="text-center pb-4 border-b border-slate-200">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-900 text-amber-300 flex items-center justify-center font-bold text-lg shadow-sm print:border print:border-black">
              สข
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              แบบบันทึกการตรวจจัดระเบียบสังคมและตรวจสอบสถานบริการ/กิจการควบคุม
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              กลุ่มงานความมั่นคง ที่ทำการปกครองจังหวัดสงขลา ศาลากลางจังหวัดสงขลา
            </p>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              เลขทะเบียนคุม: {record.id} · วันที่ตรวจสอบ: {toThaiFullDate(record.lastInspectionDate)}
            </p>
          </div>

          {/* Section 1: Venue Metadata */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-blue-900">
              <Building2 className="w-4 h-4" />
              1. ข้อมูลสถานประกอบการและผู้รับใบอนุญาต
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block">ชื่อสถานประกอบการ / ร้าน:</span>
                <span className="font-semibold text-slate-900 text-sm">{record.venueName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">เลขที่ใบอนุญาต:</span>
                <span className="font-mono text-slate-900 font-medium">{record.licenseNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">ประเภทกิจการ:</span>
                <span className="text-slate-900 font-medium">{typeCfg?.label}</span>
              </div>
              <div>
                <span className="text-slate-500 block">ชื่อผู้รับใบอนุญาต / ผู้จัดการ:</span>
                <span className="text-slate-900 font-medium">{record.operatorName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">ที่ตั้ง / สถานที่:</span>
                <span className="text-slate-900">{record.address}</span>
              </div>
              <div>
                <span className="text-slate-500 block">พื้นที่การปกครอง:</span>
                <span className="text-slate-900 font-medium">ต.{record.subDistrict} {record.district} จ.สงขลา</span>
              </div>
              <div>
                <span className="text-slate-500 block">เบอร์โทรศัพท์ติดต่อ:</span>
                <span className="text-slate-900 font-mono">{record.phone}</span>
              </div>
            </div>
          </div>

          {/* Section 2: 7 Standards Evaluation */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-blue-900">
              <UserCheck className="w-4 h-4" />
              2. ผลการตรวจสอบตามเกณฑ์มาตรฐาน 7 ด้าน
            </h4>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">หัวข้อการตรวจสอบ</th>
                    <th className="py-2 px-3 text-center w-28">ผลการตรวจสอบ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 px-3">1. ใบอนุญาตประกอบกิจการถูกต้องตามกฎหมาย</td>
                    <td className="py-2 px-3 text-center">
                      {record.complianceChecklist?.hasLicense ? (
                        <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> ถูกต้อง
                        </span>
                      ) : (
                        <span className="text-rose-700 font-medium inline-flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" /> ไม่ถูกต้อง
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">2. ปลอดผู้มีอายุต่ำกว่า 20 ปีบริบูรณ์เข้าใช้บริการ</td>
                    <td className="py-2 px-3 text-center">
                      {record.complianceChecklist?.noMinors ? (
                        <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> ผ่านเกณฑ์
                        </span>
                      ) : (
                        <span className="text-rose-700 font-medium inline-flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" /> พบฝ่าฝืน
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">3. เปิด-ปิด ตรงตามเวลาที่กฎหมายกำหนด</td>
                    <td className="py-2 px-3 text-center">
                      {record.complianceChecklist?.onTimeClosing ? (
                        <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> ผ่านเกณฑ์
                        </span>
                      ) : (
                        <span className="text-rose-700 font-medium inline-flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" /> เกินเวลา
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">4. การสุ่มตรวจสารเสพติดในร่างกาย (ปัสสาวะ)</td>
                    <td className="py-2 px-3 text-center">
                      {record.complianceChecklist?.noDrugs ? (
                        <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> ปลอดภัย
                        </span>
                      ) : (
                        <span className="text-rose-700 font-medium inline-flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" /> พบสารเสพติด
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">5. การตรวจสอบอาวุธปืนและสิ่งเทียมอาวุธปืน</td>
                    <td className="py-2 px-3 text-center">
                      {record.complianceChecklist?.noWeapons ? (
                        <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> ปลอดภัย
                        </span>
                      ) : (
                        <span className="text-rose-700 font-medium inline-flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" /> พบอาวุธ
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">6. ระบบป้องกันอัคคีภัย ถังดับเพลิง และทางหนีไฟ</td>
                    <td className="py-2 px-3 text-center">
                      {record.complianceChecklist?.fireSafetyPassed ? (
                        <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> ผ่านเกณฑ์
                        </span>
                      ) : (
                        <span className="text-rose-700 font-medium inline-flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" /> ไม่พร้อมใช้
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">7. การควบคุมระดับเสียงดนตรีไม่ให้เดือดร้อนรำคาญ</td>
                    <td className="py-2 px-3 text-center">
                      {record.complianceChecklist?.noiseControlled ? (
                        <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> ผ่านเกณฑ์
                        </span>
                      ) : (
                        <span className="text-rose-700 font-medium inline-flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" /> รบกวนชุมชน
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Legal Findings & Actions Taken */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-blue-900">
              <ShieldAlert className="w-4 h-4" />
              3. ข้อเท็จจริงที่ตรวจพบ และมาตรการทางกฎหมาย
            </h4>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                <div>
                  <span className="text-slate-500">ผลการตรวจสอบสรุป: </span>
                  <span className={`font-semibold ml-1 ${statusCfg.text}`}>{statusCfg.label}</span>
                </div>
                <div>
                  <span className="text-slate-500">มาตรการที่ใช้: </span>
                  <span className="font-semibold text-slate-900 ml-1">{legalCfg?.label}</span>
                </div>
              </div>

              {record.violations && record.violations.length > 0 && (
                <div>
                  <span className="text-slate-700 font-semibold block mb-1">รายการข้อหา / การกระทำผิดที่ตรวจพบ:</span>
                  <ul className="list-disc list-inside space-y-1 text-rose-700 font-medium pl-1">
                    {record.violations.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </div>
              )}

              {record.notes && (
                <div>
                  <span className="text-slate-700 font-semibold block mb-1">บันทึกข้อเท็จจริงเพิ่มเติมของเจ้าหน้าที่:</span>
                  <p className="text-slate-800 bg-white p-3 rounded border border-slate-200 leading-relaxed">
                    {record.notes}
                  </p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-slate-600">
                <span>กำหนดการเข้าตรวจติดตามผลครั้งต่อไป:</span>
                <span className="font-bold text-blue-800 font-mono">
                  {record.nextInspectionDate ? toThaiDate(record.nextInspectionDate) : 'ไม่ต้องตรวจซ้ำ'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Signature / Officers Section */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="space-y-8">
              <p className="text-slate-600">ลงชื่อ........................................................ผู้รับการตรวจสอบ<br />( {record.operatorName || 'ผู้ประกอบการ/ผู้จัดการ'} )</p>
            </div>
            <div className="space-y-8">
              <p className="text-slate-600">ลงชื่อ........................................................เจ้าหน้าที่ผู้ตรวจสอบ<br />( {record.officerName} )<br /><span className="text-slate-500">{record.inspectingUnit}</span></p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-2 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
