import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader, SectionCard, StatusBadge } from '@/components/climate/ClimateComponents';
import { weeklyResilience } from '@/data/mockData';
import { User, School, Briefcase, Building2, TrendingUp, Shield, Clock } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

const roles = [
  {
    id: 'family',
    label: 'Family',
    icon: User,
    color: 'primary',
    resilience: weeklyResilience.family,
    suggestions: [
      { time: 'Morning (5–8 AM)', action: 'Kids outdoor play, exercise, grocery shopping', status: 'safe' },
      { time: 'Late Morning (8–11 AM)', action: 'Return home, begin indoor tasks', status: 'strained' },
      { time: 'Afternoon (11–4 PM)', action: 'Stay indoors, close blinds, minimize AC use', status: 'critical' },
      { time: 'Evening (7–10 PM)', action: 'Outdoor walks, community events, gardening', status: 'safe' },
    ],
    weeklyData: [
      { metric: 'Heat Avoidance', value: 80 },
      { metric: 'Air Quality', value: 70 },
      { metric: 'Energy Savings', value: 60 },
      { metric: 'Scheduling', value: 85 },
      { metric: 'Recovery', value: 75 },
    ],
  },
  {
    id: 'school',
    label: 'School',
    icon: School,
    color: 'chart-2',
    resilience: weeklyResilience.school,
    suggestions: [
      { time: 'Morning Assembly (7–8 AM)', action: 'Safe for outdoor assembly', status: 'safe' },
      { time: 'Outdoor PE (Before 9 AM)', action: 'Schedule all physical activities early', status: 'safe' },
      { time: 'Midday (11 AM–2 PM)', action: 'Cancel all outdoor events, ensure indoor ventilation', status: 'critical' },
      { time: 'Afternoon sessions (2–5 PM)', action: 'Minimize CO₂ buildup — open windows', status: 'strained' },
    ],
    weeklyData: [
      { metric: 'Student Safety', value: 65 },
      { metric: 'Schedule Adapt.', value: 55 },
      { metric: 'Air Quality', value: 70 },
      { metric: 'Heat Protocol', value: 60 },
      { metric: 'Communication', value: 75 },
    ],
  },
  {
    id: 'business',
    label: 'Small Business',
    icon: Briefcase,
    color: 'chart-3',
    resilience: weeklyResilience.business,
    suggestions: [
      { time: 'Deliveries (6–9 AM)', action: 'Optimal window for driver safety', status: 'safe' },
      { time: 'Outdoor Setup (Before 10 AM)', action: 'Market stalls, street vendors — early start', status: 'safe' },
      { time: 'Peak Hours (11 AM–3 PM)', action: 'Prioritize indoor operations, avoid field visits', status: 'critical' },
      { time: 'Evening (5–8 PM)', action: 'Resume outdoor operations, customer events', status: 'strained' },
    ],
    weeklyData: [
      { metric: 'Operations', value: 82 },
      { metric: 'Staff Safety', value: 80 },
      { metric: 'Energy Use', value: 78 },
      { metric: 'Delivery Opt.', value: 85 },
      { metric: 'Customer UX', value: 80 },
    ],
  },
  {
    id: 'office',
    label: 'Office',
    icon: Building2,
    color: 'chart-4',
    resilience: weeklyResilience.office,
    suggestions: [
      { time: 'Early Start (7–9 AM)', action: 'Best for commute, cross-ventilation before heat', status: 'safe' },
      { time: 'Core Hours (9 AM–5 PM)', action: 'Manage AC load, monitor indoor CO₂ every hour', status: 'strained' },
      { time: 'Afternoon (12–3 PM)', action: 'Reduce unnecessary equipment load, avoid hot desks', status: 'critical' },
      { time: 'End of Day (5–7 PM)', action: 'Staggered exits recommended to reduce heat exposure', status: 'strained' },
    ],
    weeklyData: [
      { metric: 'Comfort', value: 70 },
      { metric: 'Energy Mgmt', value: 65 },
      { metric: 'CO₂ Control', value: 60 },
      { metric: 'Scheduling', value: 72 },
      { metric: 'Commute Opt.', value: 75 },
    ],
  },
];

export default function ClimatePlanning() {
  const [activeRole, setActiveRole] = useState('family');
  const role = roles.find(r => r.id === activeRole)!;

  const statusColors: Record<string, string> = { safe: 'text-safe', strained: 'text-strained', critical: 'text-critical' };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Climate Planning"
        subtitle="Multi-role adaptive climate scheduling and resilience management"
      />

      {/* Role Tabs */}
      <div className="flex gap-2 flex-wrap">
        {roles.map((r) => {
          const Icon = r.icon;
          return (
            <button
              key={r.id}
              onClick={() => setActiveRole(r.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all',
                activeRole === r.id
                  ? 'bg-primary text-primary-foreground glow-primary'
                  : 'bg-surface-2 text-muted-foreground hover:text-foreground hover:bg-surface-3'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {r.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Resilience Score */}
        <div className="space-y-4">
          <SectionCard title="Weekly Resilience Score">
            <div className="text-center py-4">
              <div className="relative w-28 h-28 mx-auto mb-4">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(220 14% 16%)" strokeWidth="2.5" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="hsl(162 72% 45%)"
                    strokeWidth="2.5"
                    strokeDasharray={`${role.resilience} ${100 - role.resilience}`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold text-foreground font-mono">{role.resilience}</p>
                  <p className="text-[10px] text-muted-foreground">/ 100</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-foreground">{role.label} Resilience</p>
              <p className="text-xs text-muted-foreground mt-1">
                {role.resilience >= 75 ? '✅ Good adaptation' : role.resilience >= 55 ? '⚠️ Moderate — room to improve' : '❌ Low resilience — action needed'}
              </p>
            </div>
          </SectionCard>

          <SectionCard title="Capability Radar">
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={role.weeklyData}>
                <PolarGrid stroke="hsl(220 14% 16%)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: 'hsl(215 12% 50%)', fontSize: 9 }} />
                <Radar dataKey="value" stroke="hsl(162 72% 45%)" fill="hsl(162 72% 45%)" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>

        {/* Time Adjustments */}
        <div className="lg:col-span-2">
          <SectionCard title={`${role.label} — Daily Schedule Recommendations`}>
            <div className="space-y-3">
              {role.suggestions.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={cn(
                    'flex items-start gap-4 p-4 rounded-xl border',
                    s.status === 'critical' ? 'status-critical-bg' :
                    s.status === 'strained' ? 'status-strained-bg' : 'status-safe-bg'
                  )}
                >
                  <div className="flex-shrink-0">
                    <Clock className={cn('w-4 h-4', statusColors[s.status])} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-bold text-foreground font-mono">{s.time}</p>
                      <StatusBadge status={s.status as any} size="sm" />
                    </div>
                    <p className="text-xs text-muted-foreground">{s.action}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* All Roles Comparison */}
      <SectionCard title="Cross-Role Resilience Comparison">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.id} className="bg-surface-2 rounded-xl p-4 text-center">
                <Icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="text-xs font-semibold text-foreground mb-3">{r.label}</p>
                <div className="w-full h-2 bg-surface-3 rounded-full mb-2">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${r.resilience}%` }}
                  />
                </div>
                <p className="text-lg font-bold font-mono text-foreground">{r.resilience}</p>
                <p className="text-[10px] text-muted-foreground">resilience score</p>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
