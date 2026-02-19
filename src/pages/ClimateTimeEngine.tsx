import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { Sliders, Play, Info, Target, Brain } from 'lucide-react';
import { StatusBadge, PageHeader, SectionCard } from '@/components/climate/ClimateComponents';
import { todayTimeline } from '@/data/mockData';
import type { ClimateStatus } from '@/data/mockData';
import { cn } from '@/lib/utils';

const factors = [
  { key: 'temperature', label: 'Temperature', weight: 0.25, default: 34 },
  { key: 'humidity', label: 'Humidity', weight: 0.20, default: 78 },
  { key: 'aqi', label: 'AQI Index', weight: 0.20, default: 87 },
  { key: 'co2', label: 'Indoor CO₂', weight: 0.15, default: 1240 },
  { key: 'energy', label: 'Energy Demand', weight: 0.10, default: 6.8 },
  { key: 'cooling', label: 'Night Cooling', weight: 0.10, default: 22 },
];

function computeScore(vals: Record<string, number>) {
  const t = Math.min(100, Math.max(0, (vals.temperature - 20) / 25 * 100));
  const h = Math.min(100, Math.max(0, (vals.humidity - 40) / 50 * 100));
  const a = Math.min(100, Math.max(0, vals.aqi / 200 * 100));
  const c = Math.min(100, Math.max(0, (vals.co2 - 400) / 1600 * 100));
  const e = Math.min(100, Math.max(0, (vals.energy - 2) / 8 * 100));
  const cool = Math.min(100, Math.max(0, (vals.cooling - 18) / 15 * 100));
  return Math.round(t * 0.25 + h * 0.20 + a * 0.20 + c * 0.15 + e * 0.10 + cool * 0.10);
}

function getStatus(score: number): ClimateStatus {
  return score > 70 ? 'critical' : score > 40 ? 'strained' : 'safe';
}

export default function ClimateTimeEngine() {
  const [simVals, setSimVals] = useState<Record<string, number>>({
    temperature: 34, humidity: 78, aqi: 87, co2: 1240, energy: 6.8, cooling: 22,
  });

  const score = computeScore(simVals);
  const status = getStatus(score);

  const radarData = [
    { subject: 'Temp', value: Math.min(100, (simVals.temperature - 20) / 25 * 100), fullMark: 100 },
    { subject: 'Humidity', value: Math.min(100, (simVals.humidity - 40) / 50 * 100), fullMark: 100 },
    { subject: 'AQI', value: Math.min(100, simVals.aqi / 200 * 100), fullMark: 100 },
    { subject: 'CO₂', value: Math.min(100, (simVals.co2 - 400) / 1600 * 100), fullMark: 100 },
    { subject: 'Energy', value: Math.min(100, (simVals.energy - 2) / 8 * 100), fullMark: 100 },
    { subject: 'Cooling', value: Math.min(100, (simVals.cooling - 18) / 15 * 100), fullMark: 100 },
  ];

  const barData = todayTimeline.filter((_, i) => i % 3 === 0).map(s => ({
    time: s.label,
    score: s.stressScore,
    fill: s.status === 'critical' ? '#ef4444' : s.status === 'strained' ? '#f59e0b' : '#10b981',
  }));

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Climate Time Engine"
        subtitle="Dynamic day segmentation using multi-factor stress classification"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Algorithm Explanation */}
        <div className="lg:col-span-1 space-y-4">
          <SectionCard title="Algorithm Components">
            <div className="space-y-3">
              {factors.map((f, i) => (
                <div key={f.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-foreground">{f.label}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">Weight: {(f.weight * 100).toFixed(0)}%</p>
                  </div>
                  <div className="w-20 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${f.weight * 100 / 0.25 * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Classification Logic">
            <div className="space-y-2">
              {[
                { label: 'Safe', range: '< 40', desc: 'All factors within tolerance', status: 'safe' as ClimateStatus },
                { label: 'Strained', range: '40 – 70', desc: 'Elevated risk, moderate caution', status: 'strained' as ClimateStatus },
                { label: 'Critical', range: '> 70', desc: 'High risk, action required', status: 'critical' as ClimateStatus },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-surface-2">
                  <StatusBadge status={c.status} size="sm" showPulse={false} />
                  <div>
                    <p className="text-xs font-mono text-foreground">{c.range}</p>
                    <p className="text-[10px] text-muted-foreground">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Simulation Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Current Output */}
          <div className={cn('rounded-2xl p-5 border',
            status === 'critical' ? 'status-critical-bg animate-critical-pulse' :
            status === 'strained' ? 'status-strained-bg' : 'status-safe-bg'
          )}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Engine Output</p>
                <StatusBadge status={status} score={score} size="xl" />
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold font-mono text-foreground">{score}</p>
                <p className="text-xs text-muted-foreground">/ 100 Stress Score</p>
                <p className="text-xs text-primary mt-1">Confidence: 83%</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {status === 'critical' ? '⚠️ Dangerous conditions. Human health at risk outdoors. Energy grid stressed.' :
               status === 'strained' ? '⚡ Elevated risk. Exercise caution. Schedule activities for safe windows.' :
               '✅ Conditions favorable. Outdoor activity permitted. Recovery in progress.'}
            </p>
          </div>

          {/* Radar Chart */}
          <SectionCard title="Factor Contribution (Radar)">
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(220 14% 16%)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(215 12% 50%)', fontSize: 11 }} />
                <Radar dataKey="value" stroke="hsl(162 72% 45%)" fill="hsl(162 72% 45%)" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>
      </div>

      {/* Manual Simulation */}
      <SectionCard title="Manual Simulation">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {[
            { key: 'temperature', label: 'Temperature (°C)', min: 15, max: 50, step: 0.5 },
            { key: 'humidity', label: 'Humidity (%)', min: 20, max: 100, step: 1 },
            { key: 'aqi', label: 'AQI Index', min: 0, max: 300, step: 5 },
            { key: 'co2', label: 'Indoor CO₂ (ppm)', min: 400, max: 3000, step: 50 },
            { key: 'energy', label: 'Energy Demand (kW)', min: 1, max: 15, step: 0.2 },
            { key: 'cooling', label: 'Night Temp (°C)', min: 15, max: 35, step: 0.5 },
          ].map((slider) => (
            <div key={slider.key}>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">{slider.label}</span>
                <span className="font-mono text-primary font-semibold">
                  {simVals[slider.key]}
                </span>
              </div>
              <input
                type="range"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={simVals[slider.key]}
                onChange={(e) => setSimVals(prev => ({ ...prev, [slider.key]: parseFloat(e.target.value) }))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>{slider.min}</span>
                <span>{slider.max}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Day Segmentation Bar Chart */}
      <SectionCard title="Today's Stress Segmentation (Every 3 Hours)">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" />
            <XAxis dataKey="time" tick={{ fill: 'hsl(215 12% 50%)', fontSize: 10 }} />
            <YAxis domain={[0, 100]} tick={{ fill: 'hsl(215 12% 50%)', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: 'hsl(220 18% 9%)', border: '1px solid hsl(220 14% 16%)', borderRadius: '8px', fontSize: '11px' }} />
            <Bar dataKey="score" fill="hsl(162 72% 45%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>
  );
}
