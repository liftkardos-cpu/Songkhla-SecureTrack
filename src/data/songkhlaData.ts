import { BusinessType, InspectionRecord, InspectionStatus, LegalAction } from '../types';

export const SONGKHLA_DISTRICTS: { name: string; nameEn: string; subDistricts: string[] }[] = [
  {
    name: 'อำเภอเมืองสงขลา',
    nameEn: 'Mueang Songkhla',
    subDistricts: ['บ่อยาง', 'เขารูปช้าง', 'เกาะแต้ว', 'พะวง', 'ทุ่งหวัง', 'เกาะยอ']
  },
  {
    name: 'อำเภอหาดใหญ่',
    nameEn: 'Hat Yai',
    subDistricts: ['หาดใหญ่', 'ควนลัง', 'คอหงส์', 'คลองแห', 'บ้านพรุ', 'ท่าข้าม', 'น้ำน้อย', 'พะตง', 'ทุ่งตำเสา', 'คูเต่า', 'ฉลุง', 'ทุ่งใหญ่', 'คลองอู่ตะเภา']
  },
  {
    name: 'อำเภอสะเดา',
    nameEn: 'Sadao',
    subDistricts: ['สะเดา', 'ปริก', 'พังลา', 'สำนักแต้ว', 'สำนักขาม (ด่านนอก)', 'ทุ่งหมอ', 'ท่าโพธิ์', 'ยายเต้า', 'เขามีเกียรติ']
  },
  {
    name: 'อำเภอสิงหนคร',
    nameEn: 'Singhanakhon',
    subDistricts: ['สทิงหม้อ', 'หัวเขา', 'ชะแล้', 'ปากรอ', 'ป่าขาด', 'ทำนบ', 'รำแดง', 'บางเขียด', 'ม่วงงาม', 'ช้างให้ตก', 'นาสีทอง']
  },
  {
    name: 'อำเภอจะนะ',
    nameEn: 'Chana',
    subDistricts: ['จะโหนง', 'บ้านนา', 'ป่าชิง', 'สะพานไม้แก่น', 'สะกอม', 'นาหว้า', 'นาทับ', 'น้ำขาว', 'ขุนตัดหวาย', 'ท่าหมอไทร', 'แค', 'คู', 'ตลิ่งชัน']
  },
  {
    name: 'อำเภอนาทวี',
    nameEn: 'Na Thawi',
    subDistricts: ['นาทวี', 'คลองทราย', 'ทับช้าง', 'สะท้อน', 'ประกอบ', 'วังใหญ่', 'คลองกวาง', 'ปลักหนู', 'ท่าประดู่', 'นาหมอศรี']
  },
  {
    name: 'อำเภอเทพา',
    nameEn: 'Thepha',
    subDistricts: ['เทพา', 'ปากบาง', 'เกาะสะบ้า', 'ลำไพล', 'ท่าม่วง', 'วังใหญ่', 'สะกอม']
  },
  {
    name: 'อำเภอสะบ้าย้อย',
    nameEn: 'Saba Yoi',
    subDistricts: ['สะบ้าย้อย', 'จะแหน', 'คูหา', 'เขาแดง', 'บาโหย', 'ทุ่งพอ', 'เปียน', 'ธารคีรี', 'ห้วยเต่า']
  },
  {
    name: 'อำเภอระโนด',
    nameEn: 'Ranot',
    subDistricts: ['ระโนด', 'คลองแดน', 'ตะเครียะ', 'ท่าบอน', 'บ้านขาว', 'บ่อตรุ', 'ปากแตระ', 'พังยาง', 'ระวะ', 'สงโหนด', 'บ้านใหม่', 'แดนสงวน']
  },
  {
    name: 'อำเภอสทิงพระ',
    nameEn: 'Sathing Phra',
    subDistricts: ['จะทิ้งพระ', 'กระดังงา', 'คลองรี', 'คูขุด', 'ท่าหิน', 'ชุมพล', 'ดีหลวง', 'บ่อแดง', 'บ่อดาน', 'วัดจันทร์', 'สนามชัย']
  },
  {
    name: 'อำเภอกระแสสินธุ์',
    nameEn: 'Krasae Sin',
    subDistricts: ['กระแสสินธุ์', 'เชิงแส', 'เกาะใหญ่', 'โรง']
  },
  {
    name: 'อำเภอรัตภูมิ',
    nameEn: 'Rattaphum',
    subDistricts: ['กำแพงเพชร', 'ท่าชะมวง', 'คูหาใต้', 'ควนรู', 'เขาพระ']
  },
  {
    name: 'อำเภอบางกล่ำ',
    nameEn: 'Bang Klam',
    subDistricts: ['บางกล่ำ', 'ท่าช้าง', 'แม่ทอม', 'บ้านหาร']
  },
  {
    name: 'อำเภอควนเนียง',
    nameEn: 'Khuan Niang',
    subDistricts: ['รัตภูมิ', 'ควนโส', 'ห้วยลึก', 'บางเหรียง']
  },
  {
    name: 'อำเภอคลองหอยโข่ง',
    nameEn: 'Khlong Hoi Khong',
    subDistricts: ['คลองหอยโข่ง', 'ทุ่งลาน', 'โคกม่วง', 'คลองหลา']
  },
  {
    name: 'อำเภอนาหม่อม',
    nameEn: 'Na Mom',
    subDistricts: ['นาหม่อม', 'พิจิตร', 'ทุ่งขมิ้น', 'คลองหรัง']
  }
];

export const BUSINESS_TYPE_OPTIONS: { id: BusinessType; label: string; desc: string }[] = [
  {
    id: 'entertainment',
    label: 'สถานบริการ (พ.ร.บ. 2509)',
    desc: 'ผับ บาร์ ไนต์คลับ ดิสโกเธค อาบอบนวด ตาม ม.3 พ.ร.บ.สถานบริการ'
  },
  {
    id: 'similar_entertainment',
    label: 'สถานประกอบการคล้ายสถานบริการ',
    desc: 'ร้านอาหาร สุรา ดนตรีสด คาราโอเกะ ตามคำสั่ง คสช. ที่ 22/2558'
  },
  {
    id: 'hotel',
    label: 'โรงแรมและสถานที่พัก (พ.ร.บ. 2547)',
    desc: 'โรงแรม รีสอร์ท โฮมสเตย์ ห้องพักรายวัน'
  },
  {
    id: 'controlled',
    label: 'กิจการควบคุมตามกฎหมายอื่น',
    desc: 'ร้านรับซื้อของเก่า ร้านเกม/อินเทอร์เน็ต โรงฆ่าสัตว์'
  }
];

export const STATUS_CONFIG: Record<InspectionStatus, { label: string; bg: string; text: string; border: string }> = {
  normal: {
    label: 'ปกติ / ผ่านเกณฑ์',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200'
  },
  violation: {
    label: 'พบการกระทำผิด',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200'
  },
  pending_followup: {
    label: 'อยู่ระหว่างติดตามผล',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200'
  },
  suspended: {
    label: 'สั่งพักใช้ / สั่งปิด',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300'
  }
};

export const LEGAL_ACTION_OPTIONS: { id: LegalAction; label: string; severity: 'low' | 'medium' | 'high' | 'critical' }[] = [
  { id: 'none', label: 'ไม่พบความผิด / ยุติเรื่อง', severity: 'low' },
  { id: 'warned', label: 'ว่ากล่าวตักเตือน / ทำทัณฑ์บนเป็นหนังสือ', severity: 'medium' },
  { id: 'rectify_ordered', label: 'สั่งแก้ไขปรับปรุงภายในกำหนด (15-30 วัน)', severity: 'medium' },
  { id: 'suspended_temp', label: 'เสนอสั่งพักใช้ใบอนุญาตชั่วคราว (30-60 วัน)', severity: 'high' },
  { id: 'closed_order_22', label: 'สั่งปิดสถานประกอบการ 5 ปี (คำสั่ง คสช. 22/2558)', severity: 'critical' },
  { id: 'police_case', label: 'ส่งพนักงานสอบสวน สภ. ดำเนินคดีตามกฎหมาย', severity: 'critical' }
];

export const COMMON_VIOLATIONS = [
  'เปิดให้บริการเกินเวลาที่กฎหมายกำหนด',
  'ยินยอมหรือปล่อยปละละเลยให้ผู้มีอายุต่ำกว่า 20 ปีบริบูรณ์เข้าใช้บริการ',
  'จำหน่ายเครื่องดื่มแอลกอฮอล์ให้แก่บุคคลอายุต่ำกว่า 20 ปี',
  'ตรวจพบสารเสพติดในร่างกายของพนักงานหรือผู้ใช้บริการ',
  'ยินยอมให้มีการพกพาอาวุธปืนหรือวัตถุระเบิดเข้ามาในสถานที่',
  'เปิดดำเนินการโดยไม่ได้รับอนุญาตตาม พ.ร.บ. สถานบริการ',
  'ดัดแปลงอาคารโดยไม่ได้รับอนุญาต / ประตูหนีไฟถูกปิดกั้น',
  'ไม่มีถังดับเพลิงหรืออุปกรณ์ป้องกันอัคคีภัยไม่พร้อมใช้งาน',
  'ส่งเสียงดังอึกทึกครึกโครมสร้างความเดือดร้อนรำคาญแก่ชุมชน',
  'เปิดบริการห้องพักรายวันโดยไม่มีใบอนุญาตประกอบธุรกิจโรงแรม (พ.ร.บ. โรงแรม 2547)',
  'จำหน่ายเครื่องดื่มแอลกอฮอล์นอกเวลาที่กฎหมายกำหนด (เกิน 24.00 น.)',
  'ไม่มีสมุดทะเบียนผู้พักตามแบบ ร.ร. 3 หรือไม่บันทึกข้อมูลผู้เข้าพัก'
];

export const INSPECTING_UNITS = [
  'ชุดปฏิบัติการพิเศษฝ่ายปกครองจังหวัดสงขลา',
  'กลุ่มงานความมั่นคง ที่ทำการปกครองจังหวัดสงขลา',
  'ชุดเฉพาะกิจฝ่ายความมั่นคง อำเภอหาดใหญ่',
  'ชุดเฉพาะกิจฝ่ายความมั่นคง อำเภอสะเดา',
  'ชุดเฉพาะกิจฝ่ายความมั่นคง อำเภอเมืองสงขลา',
  'คณะทำงานตรวจสอบและจัดระเบียบสังคมแบบบูรณาการ จ.สงขลา'
];

export const INITIAL_INSPECTION_RECORDS: InspectionRecord[] = [
  {
    id: 'REC-2568-001',
    venueName: 'ฮาเบอร์ ไนต์คลับ หาดใหญ่ (Harbour Night Club)',
    licenseNumber: 'สบ.สง. 04/2565',
    operatorName: 'นายวิทวัส เกียรติอนันต์',
    phone: '081-456-7890',
    businessType: 'entertainment',
    district: 'อำเภอหาดใหญ่',
    subDistrict: 'หาดใหญ่',
    address: '112/5 ถนนเสน่หานุสรณ์ ต.หาดใหญ่',
    lastInspectionDate: '2026-10-18',
    inspectionStatus: 'violation',
    legalAction: 'police_case',
    violations: [
      'ยินยอมหรือปล่อยปละละเลยให้ผู้มีอายุต่ำกว่า 20 ปีบริบูรณ์เข้าใช้บริการ (พบ 3 ราย)',
      'เปิดให้บริการเกินเวลาที่กฎหมายกำหนด (ตรวจพบเวลา 02.45 น.)'
    ],
    nextInspectionDate: '2026-10-25',
    inspectingUnit: 'ชุดปฏิบัติการพิเศษฝ่ายปกครองจังหวัดสงขลา',
    officerName: 'นายมงคล ศักดิ์เจริญ (ปลัดอำเภองานความมั่นคง)',
    notes: 'ร่วมกับ สภ.หาดใหญ่ นำตัวผู้จัดการส่งพนักงานสอบสวนเพื่อดำเนินคดีตามคำสั่ง คสช. ที่ 22/2558 เตรียมเสนอผู้ว่าฯ มีคำสั่งปิด 5 ปี',
    complianceChecklist: {
      hasLicense: true,
      noMinors: false,
      onTimeClosing: false,
      noDrugs: true,
      noWeapons: true,
      fireSafetyPassed: true,
      noiseControlled: false
    },
    createdAt: '2026-10-18T22:30:00.000Z',
    updatedAt: '2026-10-19T08:15:00.000Z'
  },
  {
    id: 'REC-2568-002',
    venueName: 'โรงแรม แกรนด์ พาราดิโซ ด่านนอก (Grand Paradiso)',
    licenseNumber: 'รร.สง. 18/2566',
    operatorName: 'นางสาวรัชนีพร สุขเกษม',
    phone: '074-301-222',
    businessType: 'hotel',
    district: 'อำเภอสะเดา',
    subDistrict: 'สำนักขาม (ด่านนอก)',
    address: '88/14 หมู่ 7 ต.สำนักขาม อ.สะเดา',
    lastInspectionDate: '2026-10-16',
    inspectionStatus: 'normal',
    legalAction: 'none',
    violations: [],
    nextInspectionDate: '2027-01-16',
    inspectingUnit: 'ชุดเฉพาะกิจฝ่ายความมั่นคง อำเภอสะเดา',
    officerName: 'นายธีรภัทร ชูจิตร (ปลัดอำเภอฝ่ายความมั่นคงสะเดา)',
    notes: 'การตรวจสอบระบบบันทึกทะเบียนผู้เข้าพัก (ร.ร. 3) ถูกต้องครบถ้วน สภาพระบบสัญญาณเตือนอัคคีภัยและทางหนีไฟได้มาตรฐาน',
    complianceChecklist: {
      hasLicense: true,
      noMinors: true,
      onTimeClosing: true,
      noDrugs: true,
      noWeapons: true,
      fireSafetyPassed: true,
      noiseControlled: true
    },
    createdAt: '2026-10-16T14:00:00.000Z',
    updatedAt: '2026-10-16T17:00:00.000Z'
  },
  {
    id: 'REC-2568-003',
    venueName: 'ร้านนั่งชิลล์ บาร์แอนด์บิสโทร ชลาทัศน์',
    licenseNumber: 'อยู่อยู่ระหว่างขออนุญาต',
    operatorName: 'นายกิตติคุณ นิลพัท',
    phone: '089-771-4433',
    businessType: 'similar_entertainment',
    district: 'อำเภอเมืองสงขลา',
    subDistrict: 'บ่อยาง',
    address: '45 ถนนชลาทัศน์ เลียบหาดชลาทัศน์ ต.บ่อยาง',
    lastInspectionDate: '2026-10-14',
    inspectionStatus: 'pending_followup',
    legalAction: 'rectify_ordered',
    violations: [
      'ส่งเสียงดังอึกทึกครึกโครมสร้างความเดือดร้อนรำคาญแก่ชุมชน',
      'ไม่มีถังดับเพลิงหรืออุปกรณ์ป้องกันอัคคีภัยไม่พร้อมใช้งาน'
    ],
    nextInspectionDate: '2026-10-28',
    inspectingUnit: 'ชุดเฉพาะกิจฝ่ายความมั่นคง อำเภอเมืองสงขลา',
    officerName: 'นายอนุชา พงษ์สถิตย์ (ปลัดอำเภอเมืองสงขลา)',
    notes: 'ออกหนังสือคำสั่งเจ้าพนักงานตาม พ.ร.บ. การสาธารณสุข สั่งให้ทำผนังเก็บเสียงและติดตั้งถังดับเพลิงมาตรฐาน 4 จุด ภายใน 14 วัน',
    complianceChecklist: {
      hasLicense: false,
      noMinors: true,
      onTimeClosing: true,
      noDrugs: true,
      noWeapons: true,
      fireSafetyPassed: false,
      noiseControlled: false
    },
    createdAt: '2026-10-14T21:40:00.000Z',
    updatedAt: '2026-10-15T09:00:00.000Z'
  },
  {
    id: 'REC-2568-004',
    venueName: 'โรงแรมนิว สยามอินน์ ปาดังเบซาร์',
    licenseNumber: 'รร.สง. 09/2561',
    operatorName: 'นายประสิทธิ์ เลิศวิชัย',
    phone: '074-521-890',
    businessType: 'hotel',
    district: 'อำเภอสะเดา',
    subDistrict: 'ปริก',
    address: '24 ถนนปาดังเบซาร์ ต.ปริก อ.สะเดา',
    lastInspectionDate: '2026-10-12',
    inspectionStatus: 'normal',
    legalAction: 'none',
    violations: [],
    nextInspectionDate: '2027-01-12',
    inspectingUnit: 'ชุดเฉพาะกิจฝ่ายความมั่นคง อำเภอสะเดา',
    officerName: 'นายธีรภัทร ชูจิตร (ปลัดอำเภอฝ่ายความมั่นคงสะเดา)',
    notes: 'ไม่พบสิ่งผิดกฎหมาย ใบอนุญาตประกอบธุรกิจโรงแรมยังไม่หมดอายุ การรายงานข้อมูลถูกต้อง',
    complianceChecklist: {
      hasLicense: true,
      noMinors: true,
      onTimeClosing: true,
      noDrugs: true,
      noWeapons: true,
      fireSafetyPassed: true,
      noiseControlled: true
    },
    createdAt: '2026-10-12T11:20:00.000Z',
    updatedAt: '2026-10-12T13:00:00.000Z'
  },
  {
    id: 'REC-2568-005',
    venueName: 'ซาวด์บาร์ หาดใหญ่ (Sound Bar Hatyai)',
    licenseNumber: 'สบ.สง. 19/2566',
    operatorName: 'นายสุรชัย วงศ์วานิช',
    phone: '086-339-1100',
    businessType: 'entertainment',
    district: 'อำเภอหาดใหญ่',
    subDistrict: 'หาดใหญ่',
    address: '77 ถนนธรรมนูญวิถี ต.หาดใหญ่',
    lastInspectionDate: '2026-10-11',
    inspectionStatus: 'suspended',
    legalAction: 'closed_order_22',
    violations: [
      'ตรวจพบสารเสพติดในร่างกายของพนักงานหรือผู้ใช้บริการ (ผลตรวจฉี่ม่วง 4 ราย)',
      'จำหน่ายเครื่องดื่มแอลกอฮอล์ให้แก่บุคคลอายุต่ำกว่า 20 ปี',
      'เปิดให้บริการเกินเวลาที่กฎหมายกำหนด'
    ],
    nextInspectionDate: '2031-10-11',
    inspectingUnit: 'ชุดปฏิบัติการพิเศษฝ่ายปกครองจังหวัดสงขลา',
    officerName: 'นายมงคล ศักดิ์เจริญ (ปลัดอำเภองานความมั่นคง)',
    notes: 'ผู้ว่าราชการจังหวัดสงขลาลงนามคำสั่งสั่งปิดสถานประกอบการเป็นเวลา 5 ปี ตามข้อ 4 แห่งคำสั่ง หน.คสช. ที่ 22/2558 มีผลตั้งแต่ 12 ต.ค. 2568',
    complianceChecklist: {
      hasLicense: true,
      noMinors: false,
      onTimeClosing: false,
      noDrugs: false,
      noWeapons: true,
      fireSafetyPassed: false,
      noiseControlled: false
    },
    createdAt: '2026-10-11T23:55:00.000Z',
    updatedAt: '2026-10-13T10:30:00.000Z'
  },
  {
    id: 'REC-2568-006',
    venueName: 'ร้านทรัพย์อนันต์ รีไซเคิล (รับซื้อของเก่า)',
    licenseNumber: 'คก.สข. 31/2564',
    operatorName: 'นายอนันต์ อภิบาลทรัพย์',
    phone: '081-992-3344',
    businessType: 'controlled',
    district: 'อำเภอสิงหนคร',
    subDistrict: 'หัวเขา',
    address: '5/2 หมู่ 1 ต.หัวเขา อ.สิงหนคร',
    lastInspectionDate: '2026-10-09',
    inspectionStatus: 'normal',
    legalAction: 'none',
    violations: [],
    nextInspectionDate: '2027-01-09',
    inspectingUnit: 'กลุ่มงานความมั่นคง ที่ทำการปกครองจังหวัดสงขลา',
    officerName: 'ร.ต.ท. เกรียงศักดิ์ สมบูรณ์ (เจ้าพนักงานปกครองชำนาญการ)',
    notes: 'ตรวจสอบสมุดบัญชีรับซื้อของเก่า ไม่พบสิ่งของโจรกรรม สายไฟ หรือของหลวง ตรวจความปลอดภัยสถานที่เรียบร้อย',
    complianceChecklist: {
      hasLicense: true,
      noMinors: true,
      onTimeClosing: true,
      noDrugs: true,
      noWeapons: true,
      fireSafetyPassed: true,
      noiseControlled: true
    },
    createdAt: '2026-10-09T10:00:00.000Z',
    updatedAt: '2026-10-09T12:00:00.000Z'
  },
  {
    id: 'REC-2568-007',
    venueName: 'ร้านสองเล คาราโอเกะ สิงหนคร',
    licenseNumber: 'ไม่มีใบอนุญาต',
    operatorName: 'นางมาลี บุญครอง',
    phone: '084-555-8822',
    businessType: 'similar_entertainment',
    district: 'อำเภอสิงหนคร',
    subDistrict: 'สทิงหม้อ',
    address: '34/1 หมู่ 3 ต.สทิงหม้อ อ.สิงหนคร',
    lastInspectionDate: '2026-10-08',
    inspectionStatus: 'violation',
    legalAction: 'warned',
    violations: [
      'เปิดดำเนินการโดยไม่ได้รับอนุญาตตาม พ.ร.บ. สถานบริการ',
      'จำหน่ายเครื่องดื่มแอลกอฮอล์นอกเวลาที่กฎหมายกำหนด (เกิน 24.00 น.)'
    ],
    nextInspectionDate: '2026-10-23',
    inspectingUnit: 'กลุ่มงานความมั่นคง ที่ทำการปกครองจังหวัดสงขลา',
    officerName: 'นายอนุชา พงษ์สถิตย์ (ปลัดอำเภอ)',
    notes: 'ทำบันทึกทัณฑ์บนและตักเตือนให้ยุติการเปิดเพลงและจำหน่ายสุราหลังเวลา 24.00 น. พร้อมให้ยื่นขอรับใบอนุญาตตามระเบียบภายใน 15 วัน',
    complianceChecklist: {
      hasLicense: false,
      noMinors: true,
      onTimeClosing: false,
      noDrugs: true,
      noWeapons: true,
      fireSafetyPassed: false,
      noiseControlled: false
    },
    createdAt: '2026-10-08T22:15:00.000Z',
    updatedAt: '2026-10-09T08:30:00.000Z'
  },
  {
    id: 'REC-2568-008',
    venueName: 'โรงแรม คริสตัล หาดใหญ่ (Crystal Hotel)',
    licenseNumber: 'รร.สง. 03/2563',
    operatorName: 'บริษัท คริสตัล โฮเทล จำกัด',
    phone: '074-208-000',
    businessType: 'hotel',
    district: 'อำเภอหาดใหญ่',
    subDistrict: 'หาดใหญ่',
    address: '4 ถนนกาญจนวนิช ต.หาดใหญ่',
    lastInspectionDate: '2026-10-06',
    inspectionStatus: 'normal',
    legalAction: 'none',
    violations: [],
    nextInspectionDate: '2027-01-06',
    inspectingUnit: 'ชุดเฉพาะกิจฝ่ายความมั่นคง อำเภอหาดใหญ่',
    officerName: 'นายมงคล ศักดิ์เจริญ (ปลัดอำเภองานความมั่นคง)',
    notes: 'การตรวจสอบเป็นไปด้วยความเรียบร้อย ระบบป้องกันอัคคีภัย บันไดหนีไฟ และระบบรักษาความปลอดภัยกล้อง CCTV ครอบคลุม',
    complianceChecklist: {
      hasLicense: true,
      noMinors: true,
      onTimeClosing: true,
      noDrugs: true,
      noWeapons: true,
      fireSafetyPassed: true,
      noiseControlled: true
    },
    createdAt: '2026-10-06T13:45:00.000Z',
    updatedAt: '2026-10-06T15:30:00.000Z'
  },
  {
    id: 'REC-2568-009',
    venueName: 'ร้าน ไซเบอร์ สเตชั่น เกมส์ & เน็ต',
    licenseNumber: 'กค.สข. 12/2565',
    operatorName: 'นายวรพจน์ จิตตานนท์',
    phone: '087-123-9988',
    businessType: 'controlled',
    district: 'อำเภอจะนะ',
    subDistrict: 'บ้านนา',
    address: '14/3 ถนนราษฎร์บำรุง ต.บ้านนา อ.จะนะ',
    lastInspectionDate: '2026-10-04',
    inspectionStatus: 'normal',
    legalAction: 'none',
    violations: [],
    nextInspectionDate: '2027-01-04',
    inspectingUnit: 'ชุดเฉพาะกิจฝ่ายความมั่นคง อำเภอจะนะ',
    officerName: 'นายอารีฟีน ดาโอ๊ะ (ปลัดอำเภองานความมั่นคงจะนะ)',
    notes: 'ตรวจสอบเวลาเข้าใช้บริการของเด็กนักเรียน ไม่พบนักเรียนในเวลาเรียน ไม่มีเนื้อหาลามกอนาจารหรือการพนันออนไลน์',
    complianceChecklist: {
      hasLicense: true,
      noMinors: true,
      onTimeClosing: true,
      noDrugs: true,
      noWeapons: true,
      fireSafetyPassed: true,
      noiseControlled: true
    },
    createdAt: '2026-10-04T15:00:00.000Z',
    updatedAt: '2026-10-04T16:30:00.000Z'
  },
  {
    id: 'REC-2568-010',
    venueName: 'ร้านอาหารและดนตรี ริมเล สะกอม',
    licenseNumber: 'สบ.รอ. 05/2566',
    operatorName: 'นายมะดิง สะกอม',
    phone: '082-998-1122',
    businessType: 'similar_entertainment',
    district: 'อำเภอเทพา',
    subDistrict: 'สะกอม',
    address: '99 หมู่ 4 ต.สะกอม อ.เทพา',
    lastInspectionDate: '2026-10-02',
    inspectionStatus: 'normal',
    legalAction: 'none',
    violations: [],
    nextInspectionDate: '2027-01-02',
    inspectingUnit: 'ชุดเฉพาะกิจฝ่ายความมั่นคง อำเภอเทพา',
    officerName: 'นายสุทิน มณีรัตน์ (ปลัดอำเภอเทพา)',
    notes: 'ไม่พบการจำหน่ายสุราผิดกฎหมาย มีใบอนุญาตจำหน่ายสุราประเภท 2 ปิดให้บริการตรงตามเวลา 24.00 น.',
    complianceChecklist: {
      hasLicense: true,
      noMinors: true,
      onTimeClosing: true,
      noDrugs: true,
      noWeapons: true,
      fireSafetyPassed: true,
      noiseControlled: true
    },
    createdAt: '2026-10-02T20:00:00.000Z',
    updatedAt: '2026-10-02T22:30:00.000Z'
  },
  {
    id: 'REC-2568-011',
    venueName: 'ร้าน วังใหญ่ คาราโอเกะ แอนด์ บิสโทร',
    licenseNumber: 'อยู่อยู่ระหว่างขออนุญาต',
    operatorName: 'นางสาวจินตนา ไชยรัตน์',
    phone: '083-441-2099',
    businessType: 'similar_entertainment',
    district: 'อำเภอนาทวี',
    subDistrict: 'วังใหญ่',
    address: '18 หมู่ 2 ต.วังใหญ่ อ.นาทวี',
    lastInspectionDate: '2026-09-28',
    inspectionStatus: 'violation',
    legalAction: 'rectify_ordered',
    violations: [
      'เปิดให้บริการเกินเวลาที่กฎหมายกำหนด',
      'ไม่มีถังดับเพลิงหรืออุปกรณ์ป้องกันอัคคีภัยไม่พร้อมใช้งาน'
    ],
    nextInspectionDate: '2026-10-28',
    inspectingUnit: 'ชุดเฉพาะกิจฝ่ายความมั่นคง อำเภอนาทวี',
    officerName: 'นายพิชัย แก้วมณี (ปลัดอำเภอนาทวี)',
    notes: 'เจ้าพนักงานสั่งให้แก้ไขเรื่องเวลาเปิด-ปิด และให้จัดหาอุปกรณ์ระงับอัคคีภัยให้เรียบร้อยภายใน 30 วัน',
    complianceChecklist: {
      hasLicense: false,
      noMinors: true,
      onTimeClosing: false,
      noDrugs: true,
      noWeapons: true,
      fireSafetyPassed: false,
      noiseControlled: true
    },
    createdAt: '2026-09-28T21:30:00.000Z',
    updatedAt: '2026-09-29T09:10:00.000Z'
  },
  {
    id: 'REC-2568-012',
    venueName: 'โรงแรม ลากูนา ปาร์ค เกาะยอ',
    licenseNumber: 'รร.สง. 22/2567',
    operatorName: 'นายธนาธิป เจริญผล',
    phone: '074-889-111',
    businessType: 'hotel',
    district: 'อำเภอเมืองสงขลา',
    subDistrict: 'เกาะยอ',
    address: '15/9 หมู่ 1 ต.เกาะยอ อ.เมืองสงขลา',
    lastInspectionDate: '2026-09-25',
    inspectionStatus: 'normal',
    legalAction: 'none',
    violations: [],
    nextInspectionDate: '2026-12-25',
    inspectingUnit: 'กลุ่มงานความมั่นคง ที่ทำการปกครองจังหวัดสงขลา',
    officerName: 'นายมงคล ศักดิ์เจริญ (ปลัดอำเภองานความมั่นคง)',
    notes: 'สถานที่พักมาตรฐาน ปฏิบัติตาม พ.ร.บ. โรงแรม ครบถ้วน ระบบความปลอดภัยและการจัดการขยะมูลฝอยถูกสุขลักษณะ',
    complianceChecklist: {
      hasLicense: true,
      noMinors: true,
      onTimeClosing: true,
      noDrugs: true,
      noWeapons: true,
      fireSafetyPassed: true,
      noiseControlled: true
    },
    createdAt: '2026-09-25T14:30:00.000Z',
    updatedAt: '2026-09-25T16:00:00.000Z'
  }
];

// Utility functions for Thai Buddhist Era date formatting
export function toThaiDate(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10) + 543;
      const monthNames = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
      ];
      const month = monthNames[parseInt(parts[1], 10) - 1] || parts[1];
      const day = parseInt(parts[2], 10);
      return `${day} ${month} ${year}`;
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const year = d.getFullYear() + 543;
    const monthNames = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    return `${d.getDate()} ${monthNames[d.getMonth()]} ${year}`;
  } catch {
    return dateStr;
  }
}

export function toThaiFullDate(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10) + 543;
      const monthNames = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ];
      const month = monthNames[parseInt(parts[1], 10) - 1] || parts[1];
      const day = parseInt(parts[2], 10);
      return `วันที่ ${day} เดือน${month} พ.ศ. ${year}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export function toThaiDateTime(isoStr: string): string {
  if (!isoStr) return '-';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    const year = d.getFullYear() + 543;
    const monthNames = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');
    return `${d.getDate()} ${monthNames[d.getMonth()]} ${year} เวลา ${hours}:${mins} น.`;
  } catch {
    return isoStr;
  }
}

import { ActivityLog } from '../types';

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'LOG-2568-108',
    timestamp: '2026-10-19T08:15:00.000Z',
    actionType: 'legal_order',
    actionLabel: 'ส่งพนักงานสอบสวน สภ. ดำเนินคดี',
    recordId: 'REC-2568-001',
    venueName: 'ฮาเบอร์ ไนต์คลับ หาดใหญ่ (Harbour Night Club)',
    officerName: 'นายมงคล ศักดิ์เจริญ (ปลัดอำเภองานความมั่นคง)',
    details: 'ส่งตัวผู้จัดการดำเนินคดีข้อหาเปิดเกินเวลาและปล่อยปละละเลยให้เด็กต่ำกว่า 20 ปีเข้าใช้บริการ'
  },
  {
    id: 'LOG-2568-107',
    timestamp: '2026-10-18T22:30:00.000Z',
    actionType: 'create',
    actionLabel: 'บันทึกผลการตรวจสอบใหม่ (พบความผิด)',
    recordId: 'REC-2568-001',
    venueName: 'ฮาเบอร์ ไนต์คลับ หาดใหญ่ (Harbour Night Club)',
    officerName: 'นายมงคล ศักดิ์เจริญ (ปลัดอำเภองานความมั่นคง)',
    details: 'ตรวจพบผู้มีอายุต่ำกว่า 20 ปี 3 ราย และเปิดให้บริการเกินเวลา 02.45 น.'
  },
  {
    id: 'LOG-2568-106',
    timestamp: '2026-10-16T17:00:00.000Z',
    actionType: 'create',
    actionLabel: 'บันทึกผลการตรวจสอบใหม่ (ปกติ)',
    recordId: 'REC-2568-002',
    venueName: 'โรงแรม แกรนด์ พาราดิโซ ด่านนอก (Grand Paradiso)',
    officerName: 'นายธีรภัทร ชูจิตร (ปลัดอำเภอฝ่ายความมั่นคงสะเดา)',
    details: 'ตรวจสอบระบบทะเบียนผู้พัก ร.ร. 3 และระบบความปลอดภัยอัคคีภัย ผ่านเกณฑ์เรียบร้อย'
  },
  {
    id: 'LOG-2568-105',
    timestamp: '2026-10-15T09:00:00.000Z',
    actionType: 'legal_order',
    actionLabel: 'ออกคำสั่งแก้ไขปรับปรุงภายใน 14 วัน',
    recordId: 'REC-2568-003',
    venueName: 'ร้านนั่งชิลล์ บาร์แอนด์บิสโทร ชลาทัศน์',
    officerName: 'นายอนุชา พงษ์สถิตย์ (ปลัดอำเภอเมืองสงขลา)',
    details: 'สั่งทำผนังเก็บเสียงลดความเดือดร้อนรำคาญ และติดตั้งอุปกรณ์ดับเพลิง 4 จุด'
  },
  {
    id: 'LOG-2568-104',
    timestamp: '2026-10-13T10:30:00.000Z',
    actionType: 'legal_order',
    actionLabel: 'บันทึกคำสั่งปิด 5 ปี (คำสั่ง คสช. 22/2558)',
    recordId: 'REC-2568-005',
    venueName: 'ซาวด์บาร์ หาดใหญ่ (Sound Bar Hatyai)',
    officerName: 'นายมงคล ศักดิ์เจริญ (ปลัดอำเภองานความมั่นคง)',
    details: 'ผู้ว่าราชการจังหวัดสงขลาลงนามคำสั่งสั่งปิด 5 ปี กรณีตรวจพบสารเสพติดและจำหน่ายสุราแก่ผู้เยาว์'
  },
  {
    id: 'LOG-2568-103',
    timestamp: '2026-10-09T12:00:00.000Z',
    actionType: 'create',
    actionLabel: 'บันทึกผลการตรวจสอบใหม่ (ปกติ)',
    recordId: 'REC-2568-006',
    venueName: 'ร้านทรัพย์อนันต์ รีไซเคิล (รับซื้อของเก่า)',
    officerName: 'ร.ต.ท. เกรียงศักดิ์ สมบูรณ์ (เจ้าพนักงานปกครอง)',
    details: 'ตรวจสอบสมุดบัญชีรับซื้อของเก่า ไม่พบสิ่งผิดกฎหมาย สถานที่ปลอดภัย'
  }
];

