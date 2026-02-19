import { useState } from 'react';
import { motion } from 'framer-motion';
import { todayTimeline, yesterdayTimeline } from '@/data/mockData';
import { StatusBadge, PageHeader, SectionCard } from '@/components/climate/ClimateComponents';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ClimateStatus } from '@/data/mockData';

const statusColors: Record<ClimateStatus, string> = {
  safe: 'bg-safe',
  strained: 'bg-strained',
  critical: 'bg-critical',
};

const statusBorder: Record<ClimateStatus, string> = {
  safe: 'border-safe/40',
  strained: 'border-strained/40',
  critical: 'border-critical/40',
};

export default function DailyTimeline() {
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'today' | 'compare'>('today');

  const compareData = todayTimeline.map((t, i) => ({
    time: t.label,
    today: t.stressScore,
    yesterday: yesterdayTimeline[i].stressScore,
  }));

  const hovered = hoveredHour !== null ? todayTimeline[hoveredHour] : null;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Daily Climate Timeline"
        subtitle="Complete 24-hour color-coded climate segmentation"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'today' ? 'compare' : 'today')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 text-xs text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors"
          >
            <Calendar className="w-3 h-3" />
            {viewMode === 'today' ? 'Compare Yesterday' : 'Today Only'}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs hover:bg-primary/20 transition-colors">
            <Download className="w-3 h-3" />
            Export PDF
          </button>
        </div>
      </PageHeader>

      {/* Visual Timeline Blocks */}
      <SectionCard title="24-Hour Climate Map — Hover for Details">
        <div className="flex gap-0.5 h-16 rounded-xl overflow-hidden border border-border mb-3">
          {todayTimeline.map((seg, i) => (
            <motion.div
              key={i}
              className={cn(
                'flex-1 cursor-pointer transition-all relative group',
                statusColors[seg.status],
                hoveredHour === i ? 'opacity-100 scale-y-110' : 'opacity-70 hover:opacity-90'
              )}
              onMouseEnter={() => setHoveredHour(i)}
              onMouseLeave={() => setHoveredHour(null)}
              whileHover={{ scaleY: 1.1 }}
            >
              {(i % 4 === 0) && (
                <div className="absolute bottom-0 left-0 text-[8px] text-white/70 px-0.5 font-mono">
                  {seg.hour}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Hover detail */}
        <div className={cn(
          'rounded-xl p-4 border transition-all',
          hovered ? (
            hovered.status === 'critical' ? 'status-critical-bg' :
            hovered.status === 'strained' ? 'status-strained-bg' : 'status-safe-bg'
          ) : 'bg-surface-2 border-border'
        )}>
          {hovered ? (
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-bold text-foreground font-mono">{hovered.label}</p>
                  <StatusBadge status={hovered.status} size="sm" />
                </div>
                <p className="text-xs text-muted-foreground">{hovered.explanation}</p>
                <div className="flex gap-4 mt-2 text-[10px] font-mono text-muted-foreground">
                  <span>Temp: {hovered.temperature}°C</span>
                  <span>Humidity: {hovered.humidity}%</span>
                  <span>AQI: {hovered.aqi}</span>
                  <span>Confidence: {hovered.confidence}%</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold font-mono text-foreground">{hovered.stressScore}</p>
                <p className="text-[10px] text-muted-foreground">stress score</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Hover over the timeline to see details for each hour</p>
          )}
        </div>
      </SectionCard>

      {/* Segment List */}
      <SectionCard title="Hour-by-Hour Breakdown">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-72 overflow-y-auto">
          {todayTimeline.map((seg, i) => (
            <div
              key={i}
              className={cn(
                'rounded-lg p-2.5 border text-center cursor-pointer transition-all hover:scale-105',
                statusBorder[seg.status],
                seg.status === 'critical' ? 'bg-critical/8' :
                seg.status === 'strained' ? 'bg-strained/8' : 'bg-safe/8'
              )}
              onMouseEnter={() => setHoveredHour(i)}
            >
              <p className="text-[10px] text-muted-foreground font-mono">{seg.label}</p>
              <p className={cn('text-base font-bold font-mono',
                seg.status === 'critical' ? 'text-critical' :
                seg.status === 'strained' ? 'text-strained' : 'text-safe'
              )}>{seg.stressScore}</p>
              <div className={cn('w-1.5 h-1.5 rounded-full mx-auto mt-1', statusColors[seg.status])} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Compare Chart */}
      {viewMode === 'compare' && (
        <SectionCard title="Today vs Yesterday — Stress Score Comparison">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={compareData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" />
              <XAxis dataKey="time" tick={{ fill: 'hsl(215 12% 50%)', fontSize: 9 }} interval={2} />
              <YAxis tick={{ fill: 'hsl(215 12% 50%)', fontSize: 10 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: 'hsl(220 18% 9%)', border: '1px solid hsl(220 14% 16%)', borderRadius: '8px', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: 'hsl(215 12% 50%)' }} />
              <Bar dataKey="today" name="Today" fill="hsl(38 92% 52%)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="yesterday" name="Yesterday" fill="hsl(162 72% 45%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        {[
          { label: '🟢 Safe Period (Score < 40)', desc: 'Outdoor activities recommended' },
          { label: '🟡 Strained Period (40–70)', desc: 'Caution advised, limit exposure' },
          { label: '🔴 Critical Period (> 70)', desc: 'Avoid outdoor activities' },
        ].map((item, i) => (
          <div key={i} className="flex flex-col">
            <span className="font-medium text-foreground">{item.label}</span>
            <span>{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
