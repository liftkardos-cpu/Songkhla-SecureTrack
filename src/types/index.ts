export type BusinessType = 
  | 'entertainment'         // สถานบริการ (พ.ร.บ. 2509)
  | 'similar_entertainment' // สถานประกอบการคล้ายสถานบริการ (คำสั่ง คสช. 22/2558)
  | 'hotel'                 // โรงแรม / สถานที่พัก (พ.ร.บ. 2547)
  | 'controlled';           // กิจการควบคุม (ร้านค้าของเก่า / เกม-เน็ต / สุรา)

export type InspectionStatus = 
  | 'normal'            // ปกติ / ผ่านเกณฑ์
  | 'violation'         // พบการกระทำผิด
  | 'pending_followup'  // อยู่ระหว่างติดตามผล / รอตรวจซ้ำ
  | 'suspended';        // สั่งพักใช้ใบอนุญาต / สั่งปิด

export type LegalAction = 
  | 'none'              // ไม่พบความผิด
  | 'warned'            // ว่ากล่าวตักเตือน / ทำทัณฑ์บน
  | 'rectify_ordered'   // สั่งแก้ไขปรับปรุงภายใน 15-30 วัน
  | 'suspended_temp'    // สั่งพักใช้ใบอนุญาตชั่วคราว (30-60 วัน)
  | 'closed_order_22'   // สั่งปิด 5 ปี ตามคำสั่ง คสช. ที่ 22/2558
  | 'police_case';      // ส่งพนักงานสอบสวน สภ. ดำเนินคดี

export interface ComplianceChecklist {
  hasLicense: boolean;         // มีใบอนุญาตถูกต้อง
  noMinors: boolean;           // ไม่พบผู้มีอายุต่ำกว่า 20 ปี
  onTimeClosing: boolean;      // ปิดบริการตามเวลาที่กฎหมายกำหนด
  noDrugs: boolean;            // ปลอดสารเสพติด (ตรวจปัสสาวะ)
  noWeapons: boolean;          // ปลอดอาวุธปืน/วัตถุระเบิด
  fireSafetyPassed: boolean;   // มีระบบป้องกันอัคคีภัย/ทางหนีไฟ
  noiseControlled: boolean;    // ระดับเสียงไม่เกินเกณฑ์รบกวนชุมชน
}

export interface InspectionRecord {
  id: string;
  venueName: string;           // ชื่อสถานประกอบการ / ร้าน
  licenseNumber: string;       // เลขที่ใบอนุญาต
  operatorName: string;        // ชื่อผู้ประกอบการ / ผู้จัดการ
  phone: string;               // เบอร์โทรศัพท์ติดต่อ
  businessType: BusinessType;  // ประเภทกิจการ
  district: string;            // อำเภอ (16 อำเภอ จ.สงขลา)
  subDistrict: string;         // ตำบล
  address: string;             // ที่ตั้ง / รายละเอียดที่อยู่
  lastInspectionDate: string;  // วันที่ตรวจล่าสุด (YYYY-MM-DD)
  inspectionStatus: InspectionStatus; // สถานะการตรวจ
  legalAction: LegalAction;    // มาตรการ / การดำเนินคดี
  violations: string[];        // รายการความผิดที่พบ
  nextInspectionDate: string;  // กำหนดตรวจติดตามผลครั้งต่อไป (YYYY-MM-DD)
  inspectingUnit: string;      // ชุดปฏิบัติการที่เข้าตรวจ
  officerName: string;         // เจ้าหน้าที่ผู้รับผิดชอบ / หัวหน้าชุด
  notes: string;               // หมายเหตุ / ข้อเท็จจริงเพิ่มเติม
  complianceChecklist: ComplianceChecklist;
  createdAt: string;
  updatedAt: string;
}

export interface DistrictSummary {
  name: string;
  nameEn: string;
  totalVenues: number;
  inspected: number;
  normal: number;
  violations: number;
  pendingFollowup: number;
  suspendedOrClosed: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actionType: 'create' | 'update' | 'delete' | 'status_change' | 'legal_order';
  actionLabel: string;
  recordId: string;
  venueName: string;
  officerName: string;
  details: string;
}
