/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SheetDB API Integration for Songkhla SecureTrack
 * Connected to Google Sheets: https://sheetdb.io/api/v1/vf15xfki4q5dx
 */

import { InspectionRecord } from '../types';

export const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/vf15xfki4q5dx';

// Map business type key to Thai label
export function getBusinessTypeLabel(type: string): string {
  switch (type) {
    case 'similar_entertainment':
      return 'ร้านคล้ายสถานบริการ (คสช. 22/2558)';
    case 'hotel':
      return 'โรงแรม / ที่พัก (พ.ร.บ. โรงแรม 2547)';
    case 'controlled':
      return 'กิจการควบคุม (ของเก่า/ค้าอาวุธปืน)';
    case 'entertainment':
    default:
      return 'สถานบริการ (พ.ร.บ. 2509)';
  }
}

// Map inspection status to Thai label
export function getInspectionStatusLabel(status: string): string {
  switch (status) {
    case 'violation':
      return 'พบการกระทำความผิด';
    case 'pending_followup':
      return 'อยู่ระหว่างรอตรวจซ้ำ';
    case 'suspended':
      return 'สั่งพักใช้ใบอนุญาต / สั่งปิด 5 ปี';
    case 'normal':
    default:
      return 'ปกติ (ผ่านเกณฑ์มาตรฐาน)';
  }
}

// Parse Excel serial dates or ISO date strings
export function parseSheetDate(raw: any): string {
  if (!raw) return new Date().toISOString().slice(0, 10);
  const num = Number(raw);
  if (!isNaN(num) && num > 30000 && num < 65000) {
    const d = new Date((num - 25569) * 86400 * 1000);
    if (!isNaN(d.getTime())) {
      return d.toISOString().slice(0, 10);
    }
  }
  return String(raw).trim();
}

export interface SheetDBRow {
  'id (รหัส)': string;
  'venue_name (ชื่อสถานประกอบการ)': string;
  'business_type (ประเภทกิจการ)': string;
  'district (อำเภอ)': string;
  'last_inspection_date (วันที่ตรวจล่าสุด)': string;
  'status (สถานะการตรวจสอบ)': string;
  'officer (เจ้าหน้าที่ผู้รับผิดชอบ)': string;
  [key: string]: any;
}

// Map Google Sheet Row to App Record
export function mapSheetRowToRecord(row: Record<string, any>): InspectionRecord {
  const id = String(row['id (รหัส)'] || row['id'] || row['ID'] || `REC-${Math.floor(1000 + Math.random() * 9000)}`);
  const venueName = String(row['venue_name (ชื่อสถานประกอบการ)'] || row['venue_name'] || row['venueName'] || 'ไม่ระบุชื่อ');

  const rawType = String(row['business_type (ประเภทกิจการ)'] || row['business_type'] || row['businessType'] || '').trim();
  let mappedType: InspectionRecord['businessType'] = 'entertainment';
  if (rawType.includes('คล้าย') || rawType === 'similar_entertainment') mappedType = 'similar_entertainment';
  else if (rawType.includes('โรงแรม') || rawType.includes('ที่พัก') || rawType === 'hotel') mappedType = 'hotel';
  else if (rawType.includes('ควบคุม') || rawType.includes('ของเก่า') || rawType.includes('อาวุธ') || rawType === 'controlled') mappedType = 'controlled';
  else mappedType = 'entertainment';

  const district = String(row['district (อำเภอ)'] || row['district'] || 'อำเภอเมืองสงขลา').trim();
  const rawDate = row['last_inspection_date (วันที่ตรวจล่าสุด)'] || row['last_inspection_date'] || row['lastInspectionDate'];
  const formattedDate = parseSheetDate(rawDate);

  const rawStatus = String(row['status (สถานะการตรวจสอบ)'] || row['status'] || row['inspectionStatus'] || 'normal').trim();
  let mappedStatus: InspectionRecord['inspectionStatus'] = 'normal';
  if (rawStatus.includes('ผิด') || rawStatus === 'violation') mappedStatus = 'violation';
  else if (rawStatus.includes('รอ') || rawStatus.includes('ซ้ำ') || rawStatus === 'pending_followup') mappedStatus = 'pending_followup';
  else if (rawStatus.includes('พัก') || rawStatus.includes('ปิด') || rawStatus === 'suspended') mappedStatus = 'suspended';
  else mappedStatus = 'normal';

  const officer = String(row['officer (เจ้าหน้าที่ผู้รับผิดชอบ)'] || row['officer'] || row['officerName'] || 'นายสมชาย มั่นคง (ปลัดอำเภอ หน.กลุ่มงาน)').trim();
  const license = String(row['licenseNumber'] || 'สข ' + id.replace(/\D/g, '').slice(-4) || 'สข 01/2567');
  const legal = (mappedStatus === 'normal' ? 'none' : 'rectify_ordered') as InspectionRecord['legalAction'];

  return {
    id,
    venueName,
    licenseNumber: license,
    operatorName: String(row['operatorName'] || 'ผู้จัดการ ' + venueName),
    phone: String(row['phone'] || '074-312-000'),
    businessType: mappedType,
    district,
    subDistrict: String(row['subDistrict'] || '-'),
    address: String(row['address'] || `${district} จ.สงขลา`),
    lastInspectionDate: formattedDate,
    inspectionStatus: mappedStatus,
    legalAction: legal,
    violations: Array.isArray(row['violations']) ? row['violations'] : (mappedStatus === 'normal' ? [] : ['พบข้อบกพร่องตามมาตรฐานการตรวจ']),
    nextInspectionDate: String(row['nextInspectionDate'] || new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10)),
    inspectingUnit: String(row['inspectingUnit'] || 'ชุดปฏิบัติการพิเศษฝ่ายปกครองจังหวัดสงขลา'),
    officerName: officer,
    notes: String(row['notes'] || 'ซิงค์จากฐานข้อมูลกลาง Google Sheets'),
    complianceChecklist: row['complianceChecklist'] || {
      hasLicense: true,
      noMinors: mappedStatus !== 'violation',
      onTimeClosing: true,
      noDrugs: true,
      noWeapons: true,
      fireSafetyPassed: true,
      noiseControlled: true,
    },
    createdAt: String(row['createdAt'] || new Date().toISOString()),
    updatedAt: String(row['updatedAt'] || new Date().toISOString()),
  };
}

// Map App Record to Google Sheet Row
export function mapRecordToSheetRow(record: InspectionRecord): SheetDBRow {
  return {
    'id (รหัส)': record.id,
    'venue_name (ชื่อสถานประกอบการ)': record.venueName,
    'business_type (ประเภทกิจการ)': getBusinessTypeLabel(record.businessType),
    'district (อำเภอ)': record.district,
    'last_inspection_date (วันที่ตรวจล่าสุด)': record.lastInspectionDate || new Date().toISOString().slice(0, 10),
    'status (สถานะการตรวจสอบ)': getInspectionStatusLabel(record.inspectionStatus),
    'officer (เจ้าหน้าที่ผู้รับผิดชอบ)': record.officerName || 'นายสมชาย มั่นคง (ปลัดอำเภอ หน.กลุ่มงาน)',
  };
}

// 1. GET: Fetch all rows from Google Sheets
export async function fetchSheetDBRecords(): Promise<InspectionRecord[]> {
  const response = await fetch(SHEETDB_API_URL);
  if (!response.ok) {
    throw new Error(`SheetDB GET failed: ${response.status}`);
  }
  const data = await response.json();
  if (Array.isArray(data)) {
    return data.map(mapSheetRowToRecord);
  }
  return [];
}

// 2. POST: Add a new record to Google Sheets
export async function addSheetDBRecord(record: InspectionRecord): Promise<void> {
  const row = mapRecordToSheetRow(record);
  const response = await fetch(SHEETDB_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: [row] }),
  });
  if (!response.ok) {
    throw new Error(`SheetDB POST failed: ${response.status}`);
  }
}

// 3. PATCH: Update existing record in Google Sheets
export async function updateSheetDBRecord(id: string, record: InspectionRecord): Promise<void> {
  const row = mapRecordToSheetRow(record);
  const response = await fetch(`${SHEETDB_API_URL}/id%20(%E0%B8%A3%E0%B8%AB%E0%B8%B1%E0%B8%AA)/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: row }),
  });
  if (!response.ok) {
    throw new Error(`SheetDB PATCH failed: ${response.status}`);
  }
}

// 4. DELETE: Delete single record from Google Sheets
export async function deleteSheetDBRecord(id: string): Promise<void> {
  const response = await fetch(`${SHEETDB_API_URL}/id%20(%E0%B8%A3%E0%B8%AB%E0%B8%B1%E0%B8%AA)/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`SheetDB DELETE failed: ${response.status}`);
  }
}

// 5. DELETE ALL: Clear all records from Google Sheets (Reset to 0)
export async function clearAllSheetDBRecords(): Promise<void> {
  const response = await fetch(`${SHEETDB_API_URL}/all`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`SheetDB clear all failed: ${response.status}`);
  }
}

// 6. Bulk Sync: Push all local staged records to Google Sheets
export async function pushAllToSheetDB(records: InspectionRecord[]): Promise<void> {
  try {
    await clearAllSheetDBRecords();
  } catch (e) {
    console.warn('Clear before sync warning:', e);
  }
  if (records.length === 0) {
    return;
  }
  const rows = records.map(mapRecordToSheetRow);
  const response = await fetch(SHEETDB_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: rows }),
  });
  if (!response.ok) {
    throw new Error(`SheetDB bulk push failed: ${response.status}`);
  }
}

export const seedSheetDBRecords = pushAllToSheetDB;

