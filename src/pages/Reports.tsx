import { useRef } from 'react';
import { motion } from 'framer-motion';
import { PageHeader, SectionCard } from '@/components/climate/ClimateComponents';
import { Download, FileText, BarChart3, Wind, Activity, Calendar } from 'lucide-react';
import { historicalData } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

const reports = [
  { title: 'Daily Climate Report', date: 'Today', icon: <Calendar className="w-4 h-4" />, status: 'Ready', pages: 4, color: 'primary' },
  { title: 'Weekly Resilience Report', date: 'This Week', icon: <BarChart3 className="w-4 h-4" />, status: 'Ready', pages: 8, color: 'chart-2' },
  { title: 'Behavior Shift Report', date: 'Last 7 days', icon: <Activity className="w-4 h-4" />, status: 'Ready', pages: 6, color: 'chart-3' },
  { title: 'Environmental Stress Report', date: 'This Month', icon: <Wind className="w-4 h-4" />, status: 'Generating', pages: 12, color: 'chart-4' },
  { title: 'Indoor Air Quality Report', date: 'Last 30 days', icon: <FileText className="w-4 h-4" />, status: 'Ready', pages: 5, color: 'chart-5' },
];

export default function Reports() {
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      toast.info('Generating PDF report...');
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#1E293B', // Dark background for PDF
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('climate-report.pdf');
      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <div className="p-6 space-y-6" ref={reportRef}>
      <PageHeader title="Reports & Insights" subtitle="AI-generated climate analysis reports with historical data and predictions" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {reports.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="card-eco rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{r.icon}</div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${r.status === 'Ready' ? 'bg-safe/15 text-safe' : 'bg-strained/15 text-strained'}`}>{r.status}</span>
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">{r.title}</p>
            <p className="text-[10px] text-muted-foreground mb-3">{r.date} · {r.pages} pages</p>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs hover:bg-primary/20 transition-colors"
              >
                <Download className="w-3 h-3" /> PDF
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-surface-2 text-muted-foreground text-xs hover:bg-surface-3 transition-colors">
                <Download className="w-3 h-3" /> CSV
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <SectionCard title="30-Day Climate Stress Overview">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" />
            <XAxis dataKey="day" tick={{ fill: 'hsl(215 12% 50%)', fontSize: 9 }} interval={4} />
            <YAxis tick={{ fill: 'hsl(215 12% 50%)', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: 'hsl(220 18% 9%)', border: '1px solid hsl(220 14% 16%)', borderRadius: '8px', fontSize: '11px' }} />
            <Bar dataKey="avgStress" name="Avg Stress" fill="hsl(162 72% 45%)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="criticalHours" name="Critical Hours" fill="hsl(0 80% 55%)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title="AI Summary — Today's Report">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary-foreground">AI</span>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <p>Today's climate conditions were <strong className="text-strained">above average stress levels</strong>, with a 6-hour critical window from 11 AM to 5 PM driven by combined temperature, humidity, and AQI peaks.</p>
            <p>Key anomalies included a <strong className="text-foreground">humidity burst (+14% above threshold)</strong> at 11:42 AM and a <strong className="text-foreground">micro-pollution spike (AQI 112)</strong> at 12:30 PM.</p>
            <p>Community coordination resulted in <strong className="text-safe">1,341 behavioral shifts</strong> reducing peak grid load by approximately 12%. Tonight's recovery window (10 PM – 6 AM) looks strong with an expected recovery score of 78/100.</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
