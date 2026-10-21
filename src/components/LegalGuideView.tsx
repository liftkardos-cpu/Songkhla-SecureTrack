import React from 'react';
import { BookOpen, Scale, AlertOctagon, ShieldCheck, MapPin, FileCheck2 } from 'lucide-react';

export const LegalGuideView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-800">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              คู่มือกฎหมายและแนวทางปฏิบัติการตรวจสอบสถานประกอบการ
            </h2>
            <p className="text-xs text-slate-500">
              สำหรับพนักงานเจ้าหน้าที่ฝ่ายปกครอง กลุ่มงานความมั่นคง ที่ทำการปกครองจังหวัดสงขลา
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Legal Provisions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: NCPO Order 22/2558 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <AlertOctagon className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">
              คำสั่งหัวหน้า คสช. ที่ 22/2558 และที่แก้ไขเพิ่มเติม (ฉบับที่ 46/2559)
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            มาตรการควบคุมสถานบริการหรือสถานประกอบการที่เปิดให้บริการในลักษณะที่คล้ายกับสถานบริการ หากตรวจพบการกระทำผิดข้อใดข้อหนึ่ง <strong>ผู้ว่าราชการจังหวัดมีอำนาจสั่งปิดเป็นเวลา 5 ปี หรือเพิกถอนใบอนุญาต</strong>:
          </p>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-rose-50/60 border border-rose-100 text-slate-800">
              <strong>1. ยินยอมหรือปล่อยปละละเลยให้ผู้มีอายุต่ำกว่า 20 ปีบริบูรณ์</strong> เข้าไปใช้บริการ
            </div>
            <div className="p-2.5 rounded bg-rose-50/60 border border-rose-100 text-slate-800">
              <strong>2. จำหน่ายเครื่องดื่มแอลกอฮอล์</strong> แก่ผู้มีอายุต่ำกว่า 20 ปีบริบูรณ์
            </div>
            <div className="p-2.5 rounded bg-rose-50/60 border border-rose-100 text-slate-800">
              <strong>3. เปิดทำการเกินเวลา</strong> ที่กฎหมายกำหนด
            </div>
            <div className="p-2.5 rounded bg-rose-50/60 border border-rose-100 text-slate-800">
              <strong>4. ยินยอมให้มีการพกพาอาวุธ วัตถุระเบิด หรือยาเสพติด</strong> เข้าไปในสถานที่
            </div>
            <div className="p-2.5 rounded bg-rose-50/60 border border-rose-100 text-slate-800">
              <strong>5. ยินยอมหรือปล่อยปละละเลยให้มีการค้ามนุษย์</strong> ในสถานที่ของตน
            </div>
          </div>
        </div>

        {/* Card 2: Place of Service Act B.E. 2509 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Scale className="w-5 h-5 text-blue-700" />
            <h3 className="text-sm font-bold text-slate-900">
              พระราชบัญญัติสถานบริการ พ.ศ. 2509 (และที่แก้ไขเพิ่มเติม)
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            นิยามสถานบริการตามมาตรา 3 และเงื่อนไขการออกใบอนุญาต:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 pl-1 leading-relaxed">
            <li><strong>มาตรา 3(1):</strong> เต้นรำ รำวง หรือรองเง็ง</li>
            <li><strong>มาตรา 3(2):</strong> สถานที่ที่มีอาหาร สุรา น้ำชา หรือเครื่องดื่มจำหน่าย โดยจัดให้มีการแสดงดนตรี หรือการแสดงอื่นเพื่อการบันเทิง</li>
            <li><strong>มาตรา 3(3):</strong> อาบ อบ นวด ซึ่งมีผู้บำเรอสำหรับนวด</li>
            <li><strong>มาตรา 3(4):</strong> สถานที่ที่มีอาหาร สุรา หรือเครื่องดื่มจำหน่าย โดยมีผู้ปรนนิบัติลูกค้า</li>
            <li><strong>มาตรา 3(5):</strong> สถานที่ที่มีอาหาร สุรา หรือเครื่องดื่มจำหน่าย และปิดทำการหลังเวลา 24.00 นาฬิกา</li>
          </ul>
          <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            * บทลงโทษเปิดสถานบริการโดยไม่ได้รับอนุญาต: จำคุกไม่เกิน 1 ปี หรือปรับไม่เกิน 20,000 บาท หรือทั้งจำทั้งปรับ (ม.26)
          </div>
        </div>

        {/* Card 3: Hotel Act B.E. 2547 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileCheck2 className="w-5 h-5 text-indigo-700" />
            <h3 className="text-sm font-bold text-slate-900">
              พระราชบัญญัติโรงแรม พ.ศ. 2547
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            แนวทางการตรวจสอบโรงแรมและสถานที่พักที่ไม่เป็นโรงแรมในพื้นที่สงขลา:
          </p>
          <div className="space-y-2 text-xs text-slate-700">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <strong>ทะเบียนผู้พัก (แบบ ร.ร. 3):</strong> ผู้จัดการโรงแรมต้องจัดให้มีบัตรทะเบียนผู้พักและบันทึกรายละเอียดทันทีที่มีผู้เข้าพัก และส่งรายงานให้นายทะเบียนทุกสัปดาห์
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
              <strong>การเปิดบริการห้องพักรายวันโดยไม่มีใบอนุญาต:</strong> มีความผิดตามมาตรา 15 ระวางโทษจำคุกไม่เกิน 1 ปี หรือปรับไม่เกิน 20,000 บาท หรือทั้งจำทั้งปรับ และปรับอีกวันละไม่เกิน 10,000 บาท
            </div>
          </div>
        </div>

        {/* Card 4: Songkhla Zoning Area */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">
              เขตพื้นที่อนุญาต (Zoning) จังหวัดสงขลา
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            พื้นที่ที่กำหนดให้เป็นเขตโซนนิ่งสถานบริการตามพระราชกฤษฎีกากำหนดเขตพื้นที่เพื่อการอนุญาตให้ตั้งสถานบริการในท้องที่จังหวัดสงขลา:
          </p>
          <div className="space-y-2 text-xs text-slate-700">
            <div className="p-2.5 rounded bg-blue-50/50 border border-blue-100">
              <strong>อำเภอหาดใหญ่:</strong> เขตโซนนิ่งศูนย์กลางการท่องเที่ยวและการค้า (บริเวณถนนเสน่หานุสรณ์ ถนนธรรมนูญวิถี ถนนประชาธิปัตย์ และแนวเขตที่กำหนด)
            </div>
            <div className="p-2.5 rounded bg-blue-50/50 border border-blue-100">
              <strong>อำเภอสะเดา:</strong> ชายแดนไทย-มาเลเซีย ตำบลสำนักขาม (บ้านด่านนอก) และตำบลปริก (ปาดังเบซาร์)
            </div>
            <div className="p-2.5 rounded bg-amber-50/50 border border-amber-100 text-amber-900">
              <strong>ข้อพึงระวัง:</strong> ห้ามตั้งสถานบริการใกล้เคียงสถานศึกษาหรือหอพักในรัศมีที่กฎหมายกำหนดเด็ดขาด
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
