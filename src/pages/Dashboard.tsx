import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar, Legend
} from 'recharts';
import { Thermometer, Droplets, Wind, Cpu, Zap, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { StatusBadge, MetricCard, PageHeader, SectionCard } from '@/components/climate/ClimateComponents';
import {
  currentMetrics, currentStatus, currentStressScore,
  todayTimeline, predictions
} from '@/data/mockData';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="card-eco rounded-lg p-3 text-xs border border-border">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const chartData = todayTimeline.map(s => ({
    time: s.label,
    stress: s.stressScore,
    temperature: s.temperature,
    aqi: s.aqi,
    fill: s.status === 'critical' ? '#ef4444' : s.status === 'strained' ? '#f59e0b' : '#10b981',
  }));

  const predData = predictions.slice(0, 6).map(p => ({
    time: p.hour,
    stress: p.stressScore,
    temp: p.temperature,
    confidence: p.confidence,
  }));

  const radialData = [
    { name: 'Safe Hours', value: 10, fill: 'hsl(148 70% 42%)' },
    { name: 'Strained', value: 8, fill: 'hsl(38 92% 52%)' },
    { name: 'Critical', value: 6, fill: 'hsl(0 80% 55%)' },
  ];

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <PageHeader
        title="Climate Dashboard"
        subtitle="Real-time overview of your environmental intelligence system"
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Clock className="w-3 h-3" />
          <span>Updated 30s ago</span>
        </div>
      </PageHeader>

      {/* Hero Status Bar */}
      <motion.div
        {...fadeUp}
        className="relative overflow-hidden rounded-2xl p-6 border border-strained/30"
        style={{ background: 'linear-gradient(135deg, hsl(38 92% 8%), hsl(220 20% 8%))' }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, hsl(38 92% 52%), transparent)', transform: 'translate(30%, -30%)' }} />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Current Climate Status</p>
            <StatusBadge status={currentStatus} score={currentStressScore} size="xl" />
            <p className="text-xs text-muted-foreground mt-3 max-w-sm">
              Elevated temperature + humidity spike detected. Limit outdoor exposure. Peak heat expected 1–3 PM.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Next Safe Window', value: '8:00 PM', icon: <CheckCircle className="w-3.5 h-3.5" /> },
              { label: 'Critical Until', value: '4:00 PM', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
              { label: 'Recovery Score', value: '38 / 100', icon: <TrendingUp className="w-3.5 h-3.5" /> },
              { label: 'AI Confidence', value: '83%', icon: <Cpu className="w-3.5 h-3.5" /> },
            ].map((item, i) => (
              <div key={i} className="bg-background/40 rounded-lg p-3 min-w-[120px]">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  {item.icon}
                  <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
                </div>
                <p className="text-sm font-bold text-foreground font-mono">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'Temperature', value: currentMetrics.temperature, unit: '°C', icon: <Thermometer className="w-4 h-4" />, status: 'strained' as const, subtitle: 'Feels like 41°C' },
          { label: 'Humidity', value: `${currentMetrics.humidity}%`, unit: '', icon: <Droplets className="w-4 h-4" />, status: 'strained' as const, subtitle: 'High moisture' },
          { label: 'AQI', value: currentMetrics.aqi, unit: '', icon: <Wind className="w-4 h-4" />, status: 'strained' as const, subtitle: 'Moderate-Poor' },
          { label: 'Indoor CO₂', value: currentMetrics.co2Indoor, unit: 'ppm', icon: <Cpu className="w-4 h-4" />, status: 'strained' as const, subtitle: 'Above 1000 limit' },
          { label: 'Energy Load', value: currentMetrics.energyDemand, unit: 'kW', icon: <Zap className="w-4 h-4" />, status: 'critical' as const, subtitle: 'Grid strained' },
          { label: 'Heat Index', value: currentMetrics.heatIndex, unit: '°C', icon: <Thermometer className="w-4 h-4" />, status: 'critical' as const, subtitle: 'Danger zone' },
          { label: 'Recovery', value: `${currentMetrics.recoveryIndex}%`, unit: '', icon: <TrendingUp className="w-4 h-4" />, status: 'safe' as const, subtitle: 'Low recovery' },
        ].map((m, i) => (
          <motion.div key={i} variants={fadeUp}>
            <MetricCard {...m} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 24h Timeline */}
        <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <SectionCard title="24-Hour Climate Stress Timeline">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(162 72% 45%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(162 72% 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" />
                <XAxis dataKey="time" tick={{ fill: 'hsl(215 12% 50%)', fontSize: 10 }} tickLine={false} interval={3} />
                <YAxis tick={{ fill: 'hsl(215 12% 50%)', fontSize: 10 }} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="stress" name="Stress Score" stroke="hsl(162 72% 45%)" fill="url(#stressGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
            {/* Safe/Strained/Critical markers */}
            <div className="flex gap-4 mt-3">
              {[
                { label: 'Safe <40', color: 'bg-safe' },
                { label: 'Strained 40-70', color: 'bg-strained' },
                { label: 'Critical >70', color: 'bg-critical' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
                  <span className="text-[10px] text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </motion.div>

        {/* Day Distribution */}
        <motion.div {...fadeUp} transition={{ delay: 0.3 }}>
          <SectionCard title="Day Distribution">
            <ResponsiveContainer width="100%" height={160}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={radialData}>
                <RadialBar dataKey="value" cornerRadius={4} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {radialData.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.fill }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="font-mono font-semibold text-foreground">{d.value}h</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </motion.div>
      </div>

      {/* Next 3 Hours Predictions */}
      <motion.div {...fadeUp} transition={{ delay: 0.35 }}>
        <SectionCard title="Short-Term Predictions (Next 3 Hours)">
          <div className="grid grid-cols-3 gap-3">
            {predData.slice(0, 3).map((p, i) => (
              <div key={i} className={`rounded-xl p-4 ${
                predictions[i + 1]?.status === 'critical' ? 'status-critical-bg' :
                predictions[i + 1]?.status === 'strained' ? 'status-strained-bg' :
                'status-safe-bg'
              }`}>
                <p className="text-xs text-muted-foreground font-mono mb-1">{p.time}</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-xl font-bold text-foreground">{p.stress}</span>
                  <span className="text-xs text-muted-foreground">/100</span>
                </div>
                <StatusBadge status={predictions[i + 1]?.status || 'safe'} size="sm" />
                <p className="text-[10px] text-muted-foreground mt-2">Temp: {p.temp}°C | Conf: {p.confidence}%</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </motion.div>

      {/* AI Quick Recommendation */}
      <motion.div {...fadeUp} transition={{ delay: 0.4 }}>
        <div className="rounded-xl p-4 border border-primary/20 bg-primary/5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary-foreground">AI</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">AI Climate Copilot Recommendation</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Based on current conditions and ML forecast: <strong className="text-foreground">Avoid outdoor activities until 8 PM.</strong> Ensure indoor CO₂ is managed — open windows after 8 PM. Schedule heavy appliance use after 10 PM. Children should remain indoors during 11 AM – 4 PM peak. The next 3 hours will reach <strong className="text-critical">Critical level</strong>; prioritize hydration and energy conservation.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
