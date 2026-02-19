import { motion } from 'framer-motion';
import { PageHeader, SectionCard, StatusBadge } from '@/components/climate/ClimateComponents';
import { recoveryWindows } from '@/data/mockData';
import { Shield, Moon, Wind, Zap, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

const recoveryScore = 62;

const recoveryHistory = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  score: [75, 68, 72, 55, 60, 82, 62][i],
  cooling: [85, 78, 80, 62, 70, 90, 72][i],
}));

const communityActions = [
  { action: 'Reduce AC by 1°C during 2–5 PM', participants: 284, impact: '12% grid load reduction', icon: '🌡️' },
  { action: 'Schedule laundry after 10 PM', participants: 512, impact: '8% peak demand shift', icon: '🌙' },
  { action: 'Open windows during 10 PM–6 AM', participants: 347, impact: '3.2°C avg indoor drop', icon: '🪟' },
  { action: 'Limit hot water use before 8 AM', participants: 198, impact: '5% morning load saved', icon: '💧' },
];

export default function RecoveryWindow() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Recovery Window Protection"
        subtitle="Identifying and protecting critical climate recovery periods for human health"
      />

      {/* Recovery Score Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="rounded-2xl p-6 border border-primary/20" style={{ background: 'linear-gradient(135deg, hsl(162 30% 8%), hsl(220 20% 8%))' }}>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Today's Recovery Score</p>
          </div>
          <div className="text-center py-4">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(220 14% 16%)" strokeWidth="2.5" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="hsl(162 72% 45%)"
                  strokeWidth="2.5"
                  strokeDasharray={`${recoveryScore} ${100 - recoveryScore}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-primary font-mono">{recoveryScore}</p>
                <p className="text-[10px] text-muted-foreground">/ 100</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">Moderate Recovery</p>
            <p className="text-xs text-muted-foreground">Night cooling partially effective. Better than yesterday (+7 pts)</p>
          </div>
        </div>

        {/* Recovery Windows */}
        <div className="lg:col-span-2">
          <SectionCard title="Active Recovery Windows">
            <div className="space-y-3">
              {recoveryWindows.map((w, i) => {
                const icons: Record<string, React.ReactNode> = {
                  'Night Cooling': <Moon className="w-4 h-4" />,
                  'Clean Air Window': <Wind className="w-4 h-4" />,
                  'Low Energy Load': <Zap className="w-4 h-4" />,
                  'Evening Cooldown': <TrendingUp className="w-4 h-4" />,
                };
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.09 }}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl border',
                      w.status === 'safe' ? 'status-safe-bg' : 'status-strained-bg'
                    )}
                  >
                    <div className={cn('p-2 rounded-lg',
                      w.status === 'safe' ? 'bg-safe/20 text-safe' : 'bg-strained/20 text-strained'
                    )}>
                      {icons[w.type]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-foreground">{w.type}</p>
                        <StatusBadge status={w.status} size="sm" />
                      </div>
                      <p className="text-xs text-muted-foreground">{w.description}</p>
                      <p className="text-[10px] font-mono text-primary mt-1">{w.start} → {w.end}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn('text-xl font-bold font-mono',
                        w.status === 'safe' ? 'text-safe' : 'text-strained'
                      )}>{w.quality}%</p>
                      <p className="text-[10px] text-muted-foreground">quality</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* 7-Day Recovery Trend */}
      <SectionCard title="7-Day Recovery Score Trend">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={recoveryHistory}>
            <defs>
              <linearGradient id="recovGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(162 72% 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(162 72% 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" />
            <XAxis dataKey="day" tick={{ fill: 'hsl(215 12% 50%)', fontSize: 11 }} />
            <YAxis tick={{ fill: 'hsl(215 12% 50%)', fontSize: 10 }} domain={[40, 100]} />
            <Tooltip contentStyle={{ background: 'hsl(220 18% 9%)', border: '1px solid hsl(220 14% 16%)', borderRadius: '8px', fontSize: '11px' }} />
            <Area type="monotone" dataKey="score" name="Recovery Score" stroke="hsl(162 72% 45%)" fill="url(#recovGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="cooling" name="Night Cooling %" stroke="hsl(200 80% 55%)" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* Community Coordination */}
      <SectionCard title="Community Coordination Actions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {communityActions.map((action, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-surface-2 border border-border"
            >
              <div className="text-2xl">{action.icon}</div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-foreground mb-1">{action.action}</p>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span><Users className="w-2.5 h-2.5 inline mr-0.5" />{action.participants} participants</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <CheckCircle className="w-3 h-3 text-safe" />
                  <span className="text-[10px] text-safe">{action.impact}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          1,341 community members coordinating climate actions today
        </p>
      </SectionCard>

      {/* Protection Recommendations */}
      <SectionCard title="Protection Recommendations">
        <div className="space-y-2">
          {[
            'Protect night cooling window (10 PM–6 AM) by minimizing heat-generating appliances',
            'Keep indoor CO₂ below 800 ppm during recovery hours for optimal cognitive recovery',
            'Coordinate community energy load shifting to maintain grid stability during evening',
            'Open windows immediately after 10 PM to maximize cross-ventilation cooling effect',
            'Avoid running AC units below 24°C during recovery hours to reduce energy waste',
          ].map((rec, i) => (
            <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-surface-2">
              <CheckCircle className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">{rec}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
