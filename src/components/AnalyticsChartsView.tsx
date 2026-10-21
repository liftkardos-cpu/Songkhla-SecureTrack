import React, { useEffect, useRef } from 'react';
import { InspectionRecord } from '../types';
import { SONGKHLA_DISTRICTS } from '../data/songkhlaData';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  DoughnutController,
  BarController
} from 'chart.js';
import { PieChart, BarChart2, ShieldCheck, TrendingUp, AlertTriangle, Building2 } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  DoughnutController,
  BarController
);

interface AnalyticsChartsViewProps {
  records: InspectionRecord[];
}

export const AnalyticsChartsView: React.FC<AnalyticsChartsViewProps> = ({ records }) => {
  const donutCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const barCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const statusCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const donutChartInstance = useRef<ChartJS | null>(null);
  const barChartInstance = useRef<ChartJS | null>(null);
  const statusChartInstance = useRef<ChartJS | null>(null);

  // Business Types counts
  const entertainmentCount = records.filter(r => r.businessType === 'entertainment').length;
  const similarCount = records.filter(r => r.businessType === 'similar_entertainment').length;
  const hotelCount = records.filter(r => r.businessType === 'hotel').length;
  const controlledCount = records.filter(r => r.businessType === 'controlled').length;

  // 16 Districts breakdown
  const districtLabels = SONGKHLA_DISTRICTS.map(d => d.name.replace('อำเภอ', 'อ.'));
  const districtTotalCounts = SONGKHLA_DISTRICTS.map(d => records.filter(r => r.district === d.name).length);
  const districtViolationCounts = SONGKHLA_DISTRICTS.map(d => 
    records.filter(r => r.district === d.name && (r.inspectionStatus === 'violation' || r.inspectionStatus === 'suspended')).length
  );

  // Statuses & Actions breakdown
  const normalCount = records.filter(r => r.inspectionStatus === 'normal').length;
  const warnedCount = records.filter(r => r.legalAction === 'warned').length;
  const rectifyCount = records.filter(r => r.legalAction === 'rectify_ordered').length;
  const suspendedCount = records.filter(r => r.legalAction === 'suspended_temp' || r.legalAction === 'closed_order_22').length;
  const policeCount = records.filter(r => r.legalAction === 'police_case').length;

  useEffect(() => {
    // 1. Donut Chart: Business Types
    if (donutCanvasRef.current) {
      if (donutChartInstance.current) {
        donutChartInstance.current.destroy();
      }

      donutChartInstance.current = new ChartJS(donutCanvasRef.current, {
        type: 'doughnut',
        data: {
          labels: [
            'สถานบริการ (พ.ร.บ. 2509)',
            'คล้ายสถานบริการ (คสช. 22/2558)',
            'โรงแรม/ที่พัก (พ.ร.บ. 2547)',
            'กิจการควบคุมตามกฎหมายอื่น'
          ],
          datasets: [
            {
              data: [entertainmentCount, similarCount, hotelCount, controlledCount],
              backgroundColor: [
                '#1d4ed8', // Royal Blue
                '#0284c7', // Sky Blue
                '#6366f1', // Indigo
                '#64748b', // Slate
              ],
              borderColor: '#ffffff',
              borderWidth: 2,
              hoverOffset: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  family: 'Sarabun, sans-serif',
                  size: 11,
                },
                boxWidth: 12,
                padding: 14,
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const val = context.parsed;
                  const total = records.length || 1;
                  const pct = Math.round((val / total) * 100);
                  return ` ${context.label}: ${val} แห่ง (${pct}%)`;
                },
              },
            },
          },
          cutout: '65%',
        },
      });
    }

    // 2. Bar Chart: 16 Districts
    if (barCanvasRef.current) {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }

      barChartInstance.current = new ChartJS(barCanvasRef.current, {
        type: 'bar',
        data: {
          labels: districtLabels,
          datasets: [
            {
              label: 'ตรวจแล้วทั้งหมด (แห่ง)',
              data: districtTotalCounts,
              backgroundColor: '#3b82f6',
              borderRadius: 6,
            },
            {
              label: 'พบการกระทำผิด/สั่งปิด (แห่ง)',
              data: districtViolationCounts,
              backgroundColor: '#ef4444',
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              ticks: {
                font: {
                  family: 'Sarabun, sans-serif',
                  size: 10,
                },
                maxRotation: 45,
                minRotation: 45,
              },
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                font: {
                  family: 'JetBrains Mono, monospace',
                  size: 11,
                },
              },
              grid: {
                color: 'rgba(226, 232, 240, 0.6)',
              },
            },
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  family: 'Sarabun, sans-serif',
                  size: 12,
                },
                boxWidth: 14,
              },
            },
            tooltip: {
              titleFont: { family: 'Sarabun, sans-serif' },
              bodyFont: { family: 'Sarabun, sans-serif' },
            },
          },
        },
      });
    }

    // 3. Statuses and Legal Actions Breakdown
    if (statusCanvasRef.current) {
      if (statusChartInstance.current) {
        statusChartInstance.current.destroy();
      }

      statusChartInstance.current = new ChartJS(statusCanvasRef.current, {
        type: 'bar',
        data: {
          labels: [
            'ผ่านเกณฑ์ปกติ',
            'ว่ากล่าวตักเตือน',
            'สั่งปรับปรุง',
            'สั่งปิด/พักใช้ 5 ปี',
            'ส่ง สภ. ดำเนินคดี'
          ],
          datasets: [
            {
              label: 'จำนวนสถานประกอบการ',
              data: [normalCount, warnedCount, rectifyCount, suspendedCount, policeCount],
              backgroundColor: [
                '#10b981', // Emerald
                '#f59e0b', // Amber
                '#3b82f6', // Blue
                '#881337', // Dark Rose
                '#ef4444', // Red
              ],
              borderRadius: 6,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                font: { family: 'JetBrains Mono, monospace' },
              },
              grid: { color: 'rgba(226, 232, 240, 0.6)' },
            },
            y: {
              ticks: {
                font: { family: 'Sarabun, sans-serif', size: 11 },
              },
              grid: { display: false },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              titleFont: { family: 'Sarabun, sans-serif' },
              bodyFont: { family: 'Sarabun, sans-serif' },
            },
          },
        },
      });
    }

    return () => {
      if (donutChartInstance.current) donutChartInstance.current.destroy();
      if (barChartInstance.current) barChartInstance.current.destroy();
      if (statusChartInstance.current) statusChartInstance.current.destroy();
    };
  }, [records]);

  return (
    <div className="space-y-6">
      {/* Overview Stat Strip */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-blue-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            การวิเคราะห์เชิงลึกและสารสนเทศภูมิศาสตร์
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            สถิติผลการตรวจติดตามสถานบริการ 16 อำเภอ จังหวัดสงขลา
          </h2>
          <p className="text-xs text-blue-200/80 mt-1">
            ประมวลผลข้อมูลแบบเรียลไทม์จากฐานข้อมูลเพื่อสนับสนุนการตัดสินใจของผู้ว่าราชการจังหวัดและฝ่ายความมั่นคง
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <span className="text-[11px] text-blue-200 block">อัตราการผ่านเกณฑ์</span>
            <span className="text-xl font-bold font-mono text-emerald-400">
              {records.length ? Math.round((normalCount / records.length) * 100) : 0}%
            </span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <span className="text-[11px] text-blue-200 block">ต้องบังคับใช้กฎหมาย</span>
            <span className="text-xl font-bold font-mono text-rose-400">
              {records.length ? Math.round(((records.length - normalCount) / records.length) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Row 1: Donut (Business Types) + Horizontal Bar (Legal Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Business Types Donut */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <PieChart className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                สัดส่วนสถานประกอบการแยกตามประเภทกิจการ
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">{records.length} แห่ง</span>
          </div>

          <div className="h-64 relative flex items-center justify-center">
            <canvas ref={donutCanvasRef} />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px]">สถานบริการ พ.ร.บ. 2509</span>
              <span className="font-bold text-slate-800 font-mono">{entertainmentCount} แห่ง</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px]">คล้ายสถานบริการ (คสช. 22/2558)</span>
              <span className="font-bold text-slate-800 font-mono">{similarCount} แห่ง</span>
            </div>
          </div>
        </div>

        {/* Card 2: Legal Actions & Status */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                ผลการตรวจสอบและมาตรการบังคับใช้กฎหมาย
              </h3>
            </div>
            <span className="text-xs text-slate-500">จำแนกตามความเด็ดขาด</span>
          </div>

          <div className="h-64 relative">
            <canvas ref={statusCanvasRef} />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs text-center">
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
              <span className="text-emerald-700 block text-[10px]">ผ่านเกณฑ์</span>
              <span className="font-bold text-emerald-800 font-mono">{normalCount}</span>
            </div>
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-100">
              <span className="text-amber-700 block text-[10px]">ตักเตือน/แก้ไข</span>
              <span className="font-bold text-amber-800 font-mono">{warnedCount + rectifyCount}</span>
            </div>
            <div className="p-2 rounded-lg bg-rose-50 border border-rose-100">
              <span className="text-rose-700 block text-[10px]">สั่งปิด/คดีอาญา</span>
              <span className="font-bold text-rose-800 font-mono">{suspendedCount + policeCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Full Width Bar Chart across 16 Districts */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                สถิติการตรวจสอบรายพื้นที่ทั้ง 16 อำเภอของจังหวัดสงขลา
              </h3>
              <p className="text-xs text-slate-500">
                เปรียบเทียบจำนวนสถานบริการที่ตรวจแล้วทั้งหมด กับจำนวนที่พบการกระทำผิด
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block"></span>
              <span>ตรวจทั้งหมด</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block"></span>
              <span>พบความผิด</span>
            </span>
          </div>
        </div>

        <div className="h-80 relative">
          <canvas ref={barCanvasRef} />
        </div>
      </div>
    </div>
  );
};
