import React, { useState, useEffect } from 'react';
import { InspectionRecord, BusinessType, InspectionStatus, LegalAction } from '../types';
import { 
  SONGKHLA_DISTRICTS, 
  BUSINESS_TYPE_OPTIONS, 
  COMMON_VIOLATIONS, 
  INSPECTING_UNITS 
} from '../data/songkhlaData';
import { X, AlertTriangle, Calendar, Building, CheckCircle2 } from 'lucide-react';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: InspectionRecord) => void;
  editingRecord: InspectionRecord | null;
}

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingRecord,
}) => {
  // Form States
  const [venueName, setVenueName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [operatorName, setOperatorName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('similar_entertainment');
  const [district, setDistrict] = useState(SONGKHLA_DISTRICTS[0].name);
  const [subDistrict, setSubDistrict] = useState(SONGKHLA_DISTRICTS[0].subDistricts[0]);
  const [address, setAddress] = useState('');
  const [lastInspectionDate, setLastInspectionDate] = useState(new Date().toISOString().slice(0, 10));
  const [inspectionStatus, setInspectionStatus] = useState<InspectionStatus>('normal');
  const [legalAction, setLegalAction] = useState<LegalAction>('none');
  const [violations, setViolations] = useState<string[]>([]);
  const [customViolation, setCustomViolation] = useState('');
  const [nextInspectionDate, setNextInspectionDate] = useState('');
  const [inspectingUnit, setInspectingUnit] = useState(INSPECTING_UNITS[0]);
  const [officerName, setOfficerName] = useState('นายมงคล ศักดิ์เจริญ (ปลัดอำเภองานความมั่นคง)');
  const [notes, setNotes] = useState('');

  // 7-point compliance checklist
  const [checklist, setChecklist] = useState({
    hasLicense: true,
    noMinors: true,
    onTimeClosing: true,
    noDrugs: true,
    noWeapons: true,
    fireSafetyPassed: true,
    noiseControlled: true,
  });

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Subdistricts list for selected district
  const availableSubDistricts = SONGKHLA_DISTRICTS.find(d => d.name === district)?.subDistricts || [];

  // Populate data when editing
  useEffect(() => {
    if (editingRecord) {
      setVenueName(editingRecord.venueName);
      setLicenseNumber(editingRecord.licenseNumber);
      setOperatorName(editingRecord.operatorName);
      setPhone(editingRecord.phone);
      setBusinessType(editingRecord.businessType);
      setDistrict(editingRecord.district);
      setSubDistrict(editingRecord.subDistrict);
      setAddress(editingRecord.address);
      setLastInspectionDate(editingRecord.lastInspectionDate);
      setInspectionStatus(editingRecord.inspectionStatus);
      setLegalAction(editingRecord.legalAction);
      setViolations(editingRecord.violations || []);
      setNextInspectionDate(editingRecord.nextInspectionDate || '');
      setInspectingUnit(editingRecord.inspectingUnit);
      setOfficerName(editingRecord.officerName);
      setNotes(editingRecord.notes || '');
      setChecklist(editingRecord.complianceChecklist || {
        hasLicense: true,
        noMinors: true,
        onTimeClosing: true,
        noDrugs: true,
        noWeapons: true,
        fireSafetyPassed: true,
        noiseControlled: true,
      });
    } else {
      // Reset form
      setVenueName('');
      setLicenseNumber('');
      setOperatorName('');
      setPhone('');
      setBusinessType('similar_entertainment');
      setDistrict('อำเภอหาดใหญ่');
      const hatYaiSub = SONGKHLA_DISTRICTS.find(d => d.name === 'อำเภอหาดใหญ่')?.subDistricts[0] || 'หาดใหญ่';
      setSubDistrict(hatYaiSub);
      setAddress('');
      const today = new Date().toISOString().slice(0, 10);
      setLastInspectionDate(today);
      setInspectionStatus('normal');
      setLegalAction('none');
      setViolations([]);
      setCustomViolation('');
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 30);
      setNextInspectionDate(nextDate.toISOString().slice(0, 10));
      setInspectingUnit(INSPECTING_UNITS[0]);
      setOfficerName('นายมงคล ศักดิ์เจริญ (ปลัดอำเภองานความมั่นคง)');
      setNotes('');
      setChecklist({
        hasLicense: true,
        noMinors: true,
        onTimeClosing: true,
        noDrugs: true,
        noWeapons: true,
        fireSafetyPassed: true,
        noiseControlled: true,
      });
      setErrors({});
    }
  }, [editingRecord, isOpen]);

  // When district changes, update default subdistrict
  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    const subList = SONGKHLA_DISTRICTS.find(d => d.name === newDistrict)?.subDistricts || [];
    if (subList.length > 0) {
      setSubDistrict(subList[0]);
    }
  };

  // Toggle checklist item
  const handleChecklistToggle = (key: keyof typeof checklist) => {
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);

    const hasFail = Object.values(updated).some(v => v === false);
    if (hasFail && inspectionStatus === 'normal') {
      setInspectionStatus('violation');
      if (legalAction === 'none') {
        setLegalAction('warned');
      }
    } else if (!hasFail && inspectionStatus === 'violation' && violations.length === 0) {
      setInspectionStatus('normal');
      setLegalAction('none');
    }
  };

  // Toggle violation selection
  const handleToggleViolation = (viol: string) => {
    if (violations.includes(viol)) {
      setViolations(violations.filter(v => v !== viol));
    } else {
      setViolations([...violations, viol]);
      if (inspectionStatus === 'normal') {
        setInspectionStatus('violation');
        if (legalAction === 'none') {
          setLegalAction('warned');
        }
      }
    }
  };

  // Add custom violation
  const handleAddCustomViolation = () => {
    if (customViolation.trim() && !violations.includes(customViolation.trim())) {
      setViolations([...violations, customViolation.trim()]);
      setCustomViolation('');
      if (inspectionStatus === 'normal') {
        setInspectionStatus('violation');
      }
    }
  };

  // Validation & Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!venueName.trim()) {
      newErrors.venueName = 'กรุณาระบุชื่อสถานประกอบการ / ร้าน';
    }
    if (!licenseNumber.trim()) {
      newErrors.licenseNumber = 'กรุณาระบุเลขที่ใบอนุญาต หรือ "อยู่ระหว่างยื่นขอ"';
    }
    if (!district) {
      newErrors.district = 'กรุณาเลือกอำเภอ';
    }
    if (!lastInspectionDate) {
      newErrors.lastInspectionDate = 'กรุณาระบุวันที่เข้าตรวจสอบ';
    }
    if (!officerName.trim()) {
      newErrors.officerName = 'กรุณาระบุชื่อเจ้าหน้าที่ผู้รับผิดชอบ';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newRecord: InspectionRecord = {
      id: editingRecord ? editingRecord.id : `REC-2568-${Math.floor(100 + Math.random() * 900)}`,
      venueName: venueName.trim(),
      licenseNumber: licenseNumber.trim(),
      operatorName: operatorName.trim() || 'ไม่ระบุ',
      phone: phone.trim() || '-',
      businessType,
      district,
      subDistrict,
      address: address.trim() || `อ.${district.replace('อำเภอ', '')} จ.สงขลา`,
      lastInspectionDate,
      inspectionStatus,
      legalAction,
      violations,
      nextInspectionDate,
      inspectingUnit,
      officerName: officerName.trim(),
      notes: notes.trim(),
      complianceChecklist: checklist,
      createdAt: editingRecord ? editingRecord.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newRecord);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-700 text-amber-300">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                {editingRecord ? 'แก้ไขบันทึกผลการตรวจสอบสถานประกอบการ' : 'บันทึกผลการตรวจสอบสถานประกอบการใหม่'}
              </h3>
              <p className="text-[11px] text-slate-400">
                กลุ่มงานความมั่นคง ที่ทำการปกครองจังหวัดสงขลา
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable, touch-friendly inputs text-base sm:text-sm) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-sm">
          {/* Section 1: Venue Information */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              ข้อมูลสถานประกอบการและที่ตั้ง
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs sm:text-sm">
                  ชื่อสถานประกอบการ / ร้าน <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={venueName}
                  onChange={e => setVenueName(e.target.value)}
                  placeholder="เช่น ซาวด์บาร์ หาดใหญ่, ฮาเบอร์ คลับ"
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-base sm:text-sm min-h-[44px] focus:outline-none focus:ring-2 ${
                    errors.venueName ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
                  }`}
                />
                {errors.venueName && <p className="text-rose-500 text-xs mt-1">{errors.venueName}</p>}
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs sm:text-sm">
                  เลขที่ใบอนุญาต / ทะเบียนพาณิชย์ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={e => setLicenseNumber(e.target.value)}
                  placeholder="เช่น สบ.สง. 12/2566, รร.สง. 04/2565 หรือ อยู่ระหว่างยื่นขอ"
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-base sm:text-sm min-h-[44px] focus:outline-none focus:ring-2 ${
                    errors.licenseNumber ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'
                  }`}
                />
                {errors.licenseNumber && <p className="text-rose-500 text-xs mt-1">{errors.licenseNumber}</p>}
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs sm:text-sm">ประเภทกิจการ</label>
                <select
                  value={businessType}
                  onChange={e => setBusinessType(e.target.value as BusinessType)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                >
                  {BUSINESS_TYPE_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs sm:text-sm">ชื่อผู้รับใบอนุญาต / ผู้จัดการ</label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={e => setOperatorName(e.target.value)}
                  placeholder="เช่น นายวิทวัส เกียรติอนันต์"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs sm:text-sm">เบอร์โทรศัพท์ติดต่อ</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="เช่น 081-456-7890"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-xs sm:text-sm">อำเภอ (จ.สงขลา)</label>
                  <select
                    value={district}
                    onChange={e => handleDistrictChange(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  >
                    {SONGKHLA_DISTRICTS.map(d => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-xs sm:text-sm">ตำบล</label>
                  <select
                    value={subDistrict}
                    onChange={e => setSubDistrict(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  >
                    {availableSubDistricts.map(sd => (
                      <option key={sd} value={sd}>
                        ต.{sd}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1 text-xs sm:text-sm">ที่ตั้ง / รายละเอียดที่อยู่</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="เช่น 112/5 ถนนเสน่หานุสรณ์ ย่านใจกลางเมืองหาดใหญ่"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Inspection Details & 7-Point Checklist */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              การปฏิบัติการตรวจสอบและเกณฑ์มาตรฐาน 7 ด้าน
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs sm:text-sm">
                  วันที่เข้าตรวจ <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={lastInspectionDate}
                    onChange={e => setLastInspectionDate(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs sm:text-sm">ชุดปฏิบัติการที่เข้าตรวจ</label>
                <select
                  value={inspectingUnit}
                  onChange={e => setInspectingUnit(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                >
                  {INSPECTING_UNITS.map(unit => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1 text-xs sm:text-sm">
                  เจ้าหน้าที่ผู้รับผิดชอบ / หัวหน้าชุดตรวจ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={e => setOfficerName(e.target.value)}
                  placeholder="เช่น นายมงคล ศักดิ์เจริญ (ปลัดอำเภองานความมั่นคง)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
                {errors.officerName && <p className="text-rose-500 text-xs mt-1">{errors.officerName}</p>}
              </div>
            </div>

            {/* 7-Point Compliance Checklist Box (Touch-friendly height >= 44px) */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 space-y-2">
              <div className="font-bold text-slate-800 text-xs sm:text-sm mb-1 flex items-center justify-between">
                <span>รายการตรวจสอบตามข้อสั่งการและกฎหมาย (Checklist):</span>
                <span className="text-slate-500 font-normal text-xs">แตะเพื่อสลับผลตรวจ</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white border border-slate-200/60 bg-white/70 cursor-pointer transition-colors min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={checklist.hasLicense}
                    onChange={() => handleChecklistToggle('hasLicense')}
                    className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 shrink-0"
                  />
                  <span className={checklist.hasLicense ? 'text-slate-800 font-medium' : 'text-rose-600 font-bold'}>
                    1. มีใบอนุญาตถูกต้องตรงตามประเภท
                  </span>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white border border-slate-200/60 bg-white/70 cursor-pointer transition-colors min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={checklist.noMinors}
                    onChange={() => handleChecklistToggle('noMinors')}
                    className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 shrink-0"
                  />
                  <span className={checklist.noMinors ? 'text-slate-800 font-medium' : 'text-rose-600 font-bold'}>
                    2. ปลอดผู้มีอายุต่ำกว่า 20 ปีบริบูรณ์
                  </span>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white border border-slate-200/60 bg-white/70 cursor-pointer transition-colors min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={checklist.onTimeClosing}
                    onChange={() => handleChecklistToggle('onTimeClosing')}
                    className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 shrink-0"
                  />
                  <span className={checklist.onTimeClosing ? 'text-slate-800 font-medium' : 'text-rose-600 font-bold'}>
                    3. ปิดบริการตามเวลาที่กฎหมายกำหนด
                  </span>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white border border-slate-200/60 bg-white/70 cursor-pointer transition-colors min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={checklist.noDrugs}
                    onChange={() => handleChecklistToggle('noDrugs')}
                    className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 shrink-0"
                  />
                  <span className={checklist.noDrugs ? 'text-slate-800 font-medium' : 'text-rose-600 font-bold'}>
                    4. ปลอดสารเสพติด (ตรวจปัสสาวะ)
                  </span>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white border border-slate-200/60 bg-white/70 cursor-pointer transition-colors min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={checklist.noWeapons}
                    onChange={() => handleChecklistToggle('noWeapons')}
                    className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 shrink-0"
                  />
                  <span className={checklist.noWeapons ? 'text-slate-800 font-medium' : 'text-rose-600 font-bold'}>
                    5. ไม่พบการพกพาอาวุธปืน/วัตถุระเบิด
                  </span>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white border border-slate-200/60 bg-white/70 cursor-pointer transition-colors min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={checklist.fireSafetyPassed}
                    onChange={() => handleChecklistToggle('fireSafetyPassed')}
                    className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 shrink-0"
                  />
                  <span className={checklist.fireSafetyPassed ? 'text-slate-800 font-medium' : 'text-rose-600 font-bold'}>
                    6. ถังดับเพลิงและทางหนีไฟพร้อมใช้งาน
                  </span>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white border border-slate-200/60 bg-white/70 cursor-pointer transition-colors sm:col-span-2 min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={checklist.noiseControlled}
                    onChange={() => handleChecklistToggle('noiseControlled')}
                    className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 shrink-0"
                  />
                  <span className={checklist.noiseControlled ? 'text-slate-800 font-medium' : 'text-rose-600 font-bold'}>
                    7. ระดับเสียงดนตรีไม่เกินเกณฑ์รบกวนชุมชน
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Result & Legal Action */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              สรุปผลการตรวจสอบและมาตรการทางกฎหมาย
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs sm:text-sm">ผลการตรวจ</label>
                <select
                  value={inspectionStatus}
                  onChange={e => setInspectionStatus(e.target.value as InspectionStatus)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-semibold"
                >
                  <option value="normal">ปกติ / ผ่านเกณฑ์มาตรฐาน</option>
                  <option value="violation">พบการกระทำผิด</option>
                  <option value="pending_followup">อยู่ระหว่างติดตามผล / รอแก้ไข</option>
                  <option value="suspended">สั่งพักใช้ใบอนุญาต / สั่งปิด 5 ปี</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs sm:text-sm">มาตรการ / การดำเนินคดี</label>
                <select
                  value={legalAction}
                  onChange={e => setLegalAction(e.target.value as LegalAction)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-semibold"
                >
                  <option value="none">ไม่พบความผิด / ยุติเรื่อง</option>
                  <option value="warned">ว่ากล่าวตักเตือน / ทำทัณฑ์บนเป็นหนังสือ</option>
                  <option value="rectify_ordered">สั่งแก้ไขปรับปรุงภายในกำหนด (15-30 วัน)</option>
                  <option value="suspended_temp">เสนอสั่งพักใช้ใบอนุญาตชั่วคราว (30-60 วัน)</option>
                  <option value="closed_order_22">สั่งปิดสถานประกอบการ 5 ปี (คำสั่ง คสช. 22/2558)</option>
                  <option value="police_case">ส่งพนักงานสอบสวน สภ. ดำเนินคดีตามกฎหมาย</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1 text-xs sm:text-sm">กำหนดตรวจติดตามผลครั้งต่อไป</label>
                <input
                  type="date"
                  value={nextInspectionDate}
                  onChange={e => setNextInspectionDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Violation selector if not normal */}
            {(inspectionStatus !== 'normal' || violations.length > 0) && (
              <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-3.5 sm:p-4 space-y-3">
                <div className="text-xs sm:text-sm font-bold text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  ระบุข้อหา / ความผิดที่ตรวจพบ:
                </div>

                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {COMMON_VIOLATIONS.map(viol => (
                    <label key={viol} className="flex items-start gap-2.5 text-xs text-slate-700 hover:text-slate-900 cursor-pointer min-h-[32px]">
                      <input
                        type="checkbox"
                        checked={violations.includes(viol)}
                        onChange={() => handleToggleViolation(viol)}
                        className="w-4 h-4 text-rose-600 rounded border-slate-300 mt-0.5 shrink-0"
                      />
                      <span className="leading-relaxed">{viol}</span>
                    </label>
                  ))}
                </div>

                {/* Custom violation input */}
                <div className="flex gap-2 pt-2 border-t border-rose-200/60">
                  <input
                    type="text"
                    value={customViolation}
                    onChange={e => setCustomViolation(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomViolation();
                      }
                    }}
                    placeholder="พิมพ์ระบุข้อหาอื่นๆ นอกเหนือจากรายการ..."
                    className="flex-1 px-3 py-2 text-base sm:text-xs bg-white border border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 min-h-[44px]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomViolation}
                    className="px-4 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors shrink-0 min-h-[44px]"
                  >
                    เพิ่มข้อหา
                  </button>
                </div>
              </div>
            )}

            {/* Notes / Facts */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-xs sm:text-sm">
                บันทึกข้อเท็จจริง / รายละเอียดการดำเนินการเพิ่มเติม
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="ระบุข้อเท็จจริงเพิ่มเติม พยานหลักฐาน หรือคำสั่งการของพนักงานเจ้าหน้าที่..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>
          </div>
        </form>

        {/* Modal Sticky Bottom Action Footer (Always reachable without scrolling) */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0 sticky bottom-0 z-10 shadow-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors min-h-[44px] flex items-center justify-center"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 rounded-xl transition-all shadow-md min-h-[44px] flex items-center justify-center"
          >
            {editingRecord ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูลการตรวจสอบ'}
          </button>
        </div>
      </div>
    </div>
  );
};
