import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Wind, Cpu, Zap, Heart, TrendingUp, RefreshCw } from 'lucide-react';
import { PageHeader, SectionCard } from '@/components/climate/ClimateComponents';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { currentMetrics } from '@/data/mockData';
import { cn } from '@/lib/utils';

function useAnimatedValue(target: number, variance = 0.5) {
  const [value, setValue] = useState(target);
  useEffect(() => {
    const interval = setInterval(() => {
      setValue(target + (Math.random() - 0.5) * variance * 2);
    }, 3000);
    return () => clearInterval(interval);
  }, [target, variance]);
  return value;
}

const generateHistory = (base: number, variance: number, points = 30) =>
  Array.from({ length: points }, (_, i) => ({
    t: `${i}m ago`,
    v: Math.round((base + (Math.random() - 0.5) * variance * 2) * 10) / 10,
  })).reverse();

export default function RealTimeMonitor() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const temp = useAnimatedValue(currentMetrics.temperature, 0.8);
  const humidity = useAnimatedValue(currentMetrics.humidity, 2);
  const aqi = useAnimatedValue(currentMetrics.aqi, 5);
  const co2 = useAnimatedValue(currentMetrics.co2Indoor, 30);
  const energy = useAnimatedValue(currentMetrics.energyDemand, 0.3);
  const heatIdx = useAnimatedValue(currentMetrics.heatIndex, 1);

  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setLastUpdated(new Date());
    setRefreshKey(k => k + 1);
  };

  const tempHistory = generateHistory(34, 2);
  const humidityHistory = generateHistory(78, 5);
  const aqiHistory = generateHistory(87, 15);
  const co2History = generateHistory(1240, 80);

  const metrics = [
    { label: 'Temperature', value: temp.toFixed(1), unit: '°C', icon: <Thermometer className="w-5 h-5" />, color: 'strained', range: '30–40', status: 'High', min: 15, max: 50 },
    { label: 'Humidity', value: humidity.toFixed(0), unit: '%', icon: <Droplets className="w-5 h-5" />, color: 'strained', range: '40–90', status: 'Elevated', min: 0, max: 100 },
    { label: 'AQI', value: aqi.toFixed(0), unit: '', icon: <Wind className="w-5 h-5" />, color: 'strained', range: '50–150', status: 'Moderate', min: 0, max: 300 },
    { label: 'Indoor CO₂', value: co2.toFixed(0), unit: 'ppm', icon: <Cpu className="w-5 h-5" />, color: 'strained', range: '1000–2000', status: 'Above limit', min: 400, max: 3000 },
    { label: 'Energy Load', value: energy.toFixed(1), unit: 'kW', icon: <Zap className="w-5 h-5" />, color: 'critical', range: '5–10', status: 'Strained', min: 0, max: 15 },
    { label: 'Heat Index', value: heatIdx.toFixed(0), unit: '°C', icon: <Heart className="w-5 h-5" />, color: 'critical', range: '38–45', status: 'Danger', min: 20, max: 55 },
  ];

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Real-Time Data Monitor"
        subtitle="Live environmental telemetry with auto-refresh every 30 seconds"
      >
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs hover:bg-primary/20 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      </PageHeader>

      {/* Live Gauges */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m, i) => {
          const pct = Math.min(100, Math.max(0, (parseFloat(m.value) - parseFloat(m.range.split('–')[0])) / (parseFloat(m.range.split('–')[1]) - parseFloat(m.range.split('–')[0])) * 100));
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              className={cn('card-eco rounded-xl p-4 text-center',
                m.color === 'critical' ? 'border-critical/30' : 'border-strained/30'
              )}
            >
              <div className={cn('w-9 h-9 rounded-lg mx-auto mb-2 flex items-center justify-center',
                m.color === 'critical' ? 'bg-critical/10 text-critical' : 'bg-strained/10 text-strained'
              )}>
                {m.icon}
              </div>
              {/* Mini gauge */}
              <div className="w-full h-1.5 bg-surface-3 rounded-full mb-2">
                <motion.div
                  className={cn('h-full rounded-full', m.color === 'critical' ? 'bg-critical' : 'bg-strained')}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <motion.p
                key={m.value}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className={cn('text-xl font-bold font-mono',
                  m.color === 'critical' ? 'text-critical' : 'text-strained'
                )}
              >
                {m.value}{m.unit}
              </motion.p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{m.label}</p>
              <p className={cn('text-[9px] font-medium mt-1',
                m.color === 'critical' ? 'text-critical' : 'text-strained'
              )}>{m.status}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Historical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Temperature — 30 Minute History">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={tempHistory}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(38 92% 52%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(38 92% 52%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" />
              <XAxis dataKey="t" tick={{ fill: 'hsl(215 12% 50%)', fontSize: 9 }} interval={4} />
              <YAxis tick={{ fill: 'hsl(215 12% 50%)', fontSize: 10 }} domain={[28, 42]} />
              <Tooltip contentStyle={{ background: 'hsl(220 18% 9%)', border: '1px solid hsl(220 14% 16%)', borderRadius: '8px', fontSize: '11px' }} />
              <Area type="monotone" dataKey="v" name="Temp °C" stroke="hsl(38 92% 52%)" fill="url(#tempGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Indoor CO₂ — 30 Minute History">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={co2History}>
              <defs>
                <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(200 80% 55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(200 80% 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" />
              <XAxis dataKey="t" tick={{ fill: 'hsl(215 12% 50%)', fontSize: 9 }} interval={4} />
              <YAxis tick={{ fill: 'hsl(215 12% 50%)', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: 'hsl(220 18% 9%)', border: '1px solid hsl(220 14% 16%)', borderRadius: '8px', fontSize: '11px' }} />
              <Area type="monotone" dataKey="v" name="CO₂ ppm" stroke="hsl(200 80% 55%)" fill="url(#co2Grad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="AQI Trend">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={aqiHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" />
              <XAxis dataKey="t" tick={{ fill: 'hsl(215 12% 50%)', fontSize: 9 }} interval={4} />
              <YAxis tick={{ fill: 'hsl(215 12% 50%)', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: 'hsl(220 18% 9%)', border: '1px solid hsl(220 14% 16%)', borderRadius: '8px', fontSize: '11px' }} />
              <Line type="monotone" dataKey="v" name="AQI" stroke="hsl(280 65% 60%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Humidity Levels">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={humidityHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" />
              <XAxis dataKey="t" tick={{ fill: 'hsl(215 12% 50%)', fontSize: 9 }} interval={4} />
              <YAxis tick={{ fill: 'hsl(215 12% 50%)', fontSize: 10 }} domain={[60, 90]} />
              <Tooltip contentStyle={{ background: 'hsl(220 18% 9%)', border: '1px solid hsl(220 14% 16%)', borderRadius: '8px', fontSize: '11px' }} />
              <Line type="monotone" dataKey="v" name="Humidity %" stroke="hsl(162 72% 45%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="text-xs text-muted-foreground text-right font-mono">
        Last updated: {lastUpdated.toLocaleTimeString()} · Auto-refresh: 30s
      </div>
    </div>
  );
}
