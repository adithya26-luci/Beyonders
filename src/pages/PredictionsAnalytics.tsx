import { motion } from 'framer-motion';
import { PageHeader, SectionCard, StatusBadge } from '@/components/climate/ClimateComponents';
import { predictions, historicalData } from '@/data/mockData';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ScatterChart, Scatter, ZAxis, BarChart, Bar
} from 'recharts';
import { Brain, Target, TrendingUp, Database, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

const models = [
  { name: 'LSTM Forecaster', type: '3h / 24h', accuracy: 88.4, status: 'Active', trainSize: '45k samples', lastTrain: '2h ago', color: 'primary' },
  { name: 'Prophet Stress Model', type: 'Trend + Seasonality', accuracy: 85.2, status: 'Active', trainSize: '120k samples', lastTrain: '6h ago', color: 'chart-2' },
  { name: 'CO₂ Predictor (XGBoost)', type: 'Indoor air', accuracy: 91.3, status: 'Active', trainSize: '28k samples', lastTrain: '1h ago', color: 'chart-3' },
  { name: 'Energy Demand CNN', type: '24h ahead', accuracy: 83.7, status: 'Training', trainSize: '92k samples', lastTrain: 'In progress', color: 'chart-4' },
  { name: 'Anomaly Isolation Forest', type: 'Real-time', accuracy: 90.8, status: 'Active', trainSize: '67k samples', lastTrain: '30m ago', color: 'chart-5' },
];

export default function PredictionsAnalytics() {
  const pred24Data = predictions.map(p => ({
    time: p.hour,
    stress: p.stressScore,
    temp: p.temperature,
    confidence: p.confidence,
    fill: p.status === 'critical' ? '#ef4444' : p.status === 'strained' ? '#f59e0b' : '#10b981',
  }));

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Predictions & ML Analytics"
        subtitle="Time-series forecasting models with confidence scoring and performance analytics"
      />

      {/* Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {models.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card-eco rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{m.name}</p>
                  <p className="text-[9px] text-muted-foreground">{m.type}</p>
                </div>
              </div>
              <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium',
                m.status === 'Active' ? 'bg-safe/15 text-safe' : 'bg-strained/15 text-strained'
              )}>{m.status}</span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-muted-foreground">Accuracy</span>
                  <span className="text-primary font-mono font-semibold">{m.accuracy}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-3 rounded-full">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${m.accuracy}%` }} />
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span><Database className="w-2.5 h-2.5 inline mr-0.5" />{m.trainSize}</span>
                <span>Updated: {m.lastTrain}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Forecast Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="9-Point Stress Forecast (LSTM)">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={pred24Data}>
              <defs>
                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(162 72% 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(162 72% 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" />
              <XAxis dataKey="time" tick={{ fill: 'hsl(215 12% 50%)', fontSize: 9 }} />
              <YAxis tick={{ fill: 'hsl(215 12% 50%)', fontSize: 10 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: 'hsl(220 18% 9%)', border: '1px solid hsl(220 14% 16%)', borderRadius: '8px', fontSize: '11px' }} />
              <Area type="monotone" dataKey="stress" name="Stress Score" stroke="hsl(162 72% 45%)" fill="url(#predGrad)" strokeWidth={2} />
              <Line type="monotone" dataKey="confidence" name="Confidence %" stroke="hsl(200 80% 55%)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Temperature Forecast">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={pred24Data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" />
              <XAxis dataKey="time" tick={{ fill: 'hsl(215 12% 50%)', fontSize: 9 }} />
              <YAxis tick={{ fill: 'hsl(215 12% 50%)', fontSize: 10 }} domain={[24, 42]} />
              <Tooltip contentStyle={{ background: 'hsl(220 18% 9%)', border: '1px solid hsl(220 14% 16%)', borderRadius: '8px', fontSize: '11px' }} />
              <Line type="monotone" dataKey="temp" name="Predicted Temp °C" stroke="hsl(38 92% 52%)" strokeWidth={2} dot={{ r: 3, fill: 'hsl(38 92% 52%)' }} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Forecast Table */}
      <SectionCard title="Full Prediction Table">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {['Time', 'Temp (°C)', 'Humidity (%)', 'AQI', 'Stress Score', 'Status', 'Confidence'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-muted-foreground font-medium uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {predictions.map((p, i) => (
                <tr key={i} className="border-b border-border/40 hover:bg-surface-2 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-semibold text-primary">{p.hour}</td>
                  <td className="py-2.5 px-3 text-foreground">{p.temperature}</td>
                  <td className="py-2.5 px-3 text-foreground">{p.humidity}</td>
                  <td className="py-2.5 px-3 text-foreground">{p.aqi}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-foreground">{p.stressScore}</td>
                  <td className="py-2.5 px-3"><StatusBadge status={p.status} size="sm" showPulse={false} /></td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1 bg-surface-3 rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${p.confidence}%` }} />
                      </div>
                      <span className="font-mono text-muted-foreground">{p.confidence}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* 30-Day Historical */}
      <SectionCard title="30-Day Stress History — Model Training Reference">
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={historicalData.slice(0, 14)}>
            <defs>
              <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(280 65% 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(280 65% 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" />
            <XAxis dataKey="day" tick={{ fill: 'hsl(215 12% 50%)', fontSize: 9 }} />
            <YAxis tick={{ fill: 'hsl(215 12% 50%)', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: 'hsl(220 18% 9%)', border: '1px solid hsl(220 14% 16%)', borderRadius: '8px', fontSize: '11px' }} />
            <Area type="monotone" dataKey="avgStress" name="Avg Stress" stroke="hsl(280 65% 60%)" fill="url(#histGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>
  );
}
