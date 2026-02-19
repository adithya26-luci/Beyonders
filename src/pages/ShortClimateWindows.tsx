import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Droplets, Wind, Zap, Cpu, TrendingUp, Activity } from 'lucide-react';
import { StatusBadge, PageHeader, SectionCard } from '@/components/climate/ClimateComponents';
import { stressTriggers } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

const typeIcons: Record<string, React.ReactNode> = {
  'Humidity Burst': <Droplets className="w-4 h-4" />,
  'Indoor CO₂ Buildup': <Cpu className="w-4 h-4" />,
  'Digital Heat Spike': <Zap className="w-4 h-4" />,
  'Weak Night Cooling': <Clock className="w-4 h-4" />,
  'Micro Pollution Peak': <Wind className="w-4 h-4" />,
  'Energy Demand Surge': <TrendingUp className="w-4 h-4" />,
};

const anomalyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  co2: 800 + Math.sin(i * 0.4) * 300 + (i > 8 && i < 18 ? 300 : 0),
  humidity: 60 + Math.cos(i * 0.3) * 15 + (i > 6 && i < 14 ? 15 : 0),
  energy: 3 + Math.sin(i * 0.5) * 2 + (i > 7 && i < 20 ? 2.5 : 0),
  threshold_co2: 1000,
  threshold_humidity: 75,
}));

export default function ShortClimateWindows() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Short Climate Windows Detection"
        subtitle="ML anomaly detection of micro-environmental stress patterns"
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Active Triggers', value: '3', icon: <AlertTriangle className="w-4 h-4" />, color: 'critical' },
          { label: 'Total Today', value: '6', icon: <Activity className="w-4 h-4" />, color: 'strained' },
          { label: 'Avg Duration', value: '63 min', icon: <Clock className="w-4 h-4" />, color: 'strained' },
          { label: 'Anomaly Score', value: '74%', icon: <TrendingUp className="w-4 h-4" />, color: 'safe' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={cn('card-eco rounded-xl p-4',
              s.color === 'critical' ? 'border-critical/30' :
              s.color === 'strained' ? 'border-strained/30' : 'border-safe/30'
            )}
          >
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-3',
              s.color === 'critical' ? 'bg-critical/10 text-critical' :
              s.color === 'strained' ? 'bg-strained/10 text-strained' : 'bg-safe/10 text-safe'
            )}>
              {s.icon}
            </div>
            <p className="text-xl font-bold text-foreground font-mono">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Trigger Log */}
      <SectionCard title="Trigger Detection Log">
        <div className="space-y-3">
          {stressTriggers.map((trigger, i) => (
            <motion.div
              key={trigger.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className={cn('flex items-start gap-4 p-4 rounded-xl border',
                trigger.severity === 'critical' ? 'status-critical-bg' :
                trigger.severity === 'strained' ? 'status-strained-bg' : 'status-safe-bg'
              )}
            >
              <div className={cn('p-2 rounded-lg flex-shrink-0',
                trigger.severity === 'critical' ? 'bg-critical/20 text-critical' :
                trigger.severity === 'strained' ? 'bg-strained/20 text-strained' : 'bg-safe/20 text-safe'
              )}>
                {typeIcons[trigger.type] || <AlertTriangle className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground">{trigger.type}</p>
                  <StatusBadge status={trigger.severity} size="sm" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{trigger.impact}</p>
                <div className="flex gap-4 mt-2">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    📍 Detected: {trigger.detectedAt}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    ⏱ Duration: {trigger.duration} min
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    📊 {trigger.value} / {trigger.threshold}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-mono text-foreground">
                  {Math.round((trigger.value / trigger.threshold - 1) * 100)}% above
                </div>
                <div className="text-[10px] text-muted-foreground">threshold</div>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionCard>

      {/* CO2 Anomaly Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Indoor CO₂ — 24h Anomaly Detection">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={anomalyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" />
              <XAxis dataKey="hour" tick={{ fill: 'hsl(215 12% 50%)', fontSize: 9 }} interval={4} />
              <YAxis tick={{ fill: 'hsl(215 12% 50%)', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: 'hsl(220 18% 9%)', border: '1px solid hsl(220 14% 16%)', borderRadius: '8px', fontSize: '11px' }} />
              <Line type="monotone" dataKey="co2" name="CO₂ ppm" stroke="hsl(38 92% 52%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="threshold_co2" name="Threshold" stroke="hsl(0 80% 55%)" strokeWidth={1} strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Humidity Burst Detection">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={anomalyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" />
              <XAxis dataKey="hour" tick={{ fill: 'hsl(215 12% 50%)', fontSize: 9 }} interval={4} />
              <YAxis tick={{ fill: 'hsl(215 12% 50%)', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: 'hsl(220 18% 9%)', border: '1px solid hsl(220 14% 16%)', borderRadius: '8px', fontSize: '11px' }} />
              <Line type="monotone" dataKey="humidity" name="Humidity %" stroke="hsl(200 80% 55%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="threshold_humidity" name="Threshold" stroke="hsl(0 80% 55%)" strokeWidth={1} strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* ML Model Output */}
      <SectionCard title="ML Anomaly Detection Model Output">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { model: 'Isolation Forest', accuracy: '91%', anomalies: 6, status: 'Active' },
            { model: 'LSTM Autoencoder', accuracy: '88%', anomalies: 5, status: 'Active' },
            { model: 'Statistical Z-Score', accuracy: '85%', anomalies: 8, status: 'Active' },
            { model: 'Prophet Outlier', accuracy: '83%', anomalies: 4, status: 'Training' },
          ].map((m, i) => (
            <div key={i} className="bg-surface-2 rounded-lg p-3">
              <p className="text-xs font-semibold text-foreground mb-2">{m.model}</p>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Accuracy</span>
                <span className="font-mono text-primary">{m.accuracy}</span>
              </div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted-foreground">Anomalies</span>
                <span className="font-mono text-strained">{m.anomalies}</span>
              </div>
              <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium',
                m.status === 'Active' ? 'bg-safe/15 text-safe' : 'bg-strained/15 text-strained'
              )}>{m.status}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
