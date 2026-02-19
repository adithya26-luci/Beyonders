import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar, Legend
} from 'recharts';
import { Thermometer, Droplets, Wind, Cpu, Zap, TrendingUp, AlertTriangle, CheckCircle, Clock, MapPin, Search, Crosshair, Loader2 } from 'lucide-react';
import { StatusBadge, MetricCard, PageHeader, SectionCard } from '@/components/climate/ClimateComponents';
import { DashboardAIAssistant } from '@/components/layout/DashboardAIAssistant';
import { ClimateMap } from '@/components/climate/ClimateMap';
import {
  currentMetrics, currentStatus, currentStressScore,
  todayTimeline, predictions, locations, getLocationData, searchLocation
} from '@/data/mockData';
import { fetchWeather, searchCity } from '@/lib/weatherApi';

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
  const [selectedLocationId, setSelectedLocationId] = useState('local');
  const [searchQuery, setSearchQuery] = useState('');
  const [customLocationData, setCustomLocationData] = useState<any>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const [isSearching, setIsSearching] = useState(false);

  const locationData = useMemo(() => {
    if (customLocationData) return customLocationData;
    return getLocationData(selectedLocationId);
  }, [selectedLocationId, customLocationData]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const data = await searchCity(searchQuery);
      setCustomLocationData(data);
      setSelectedLocationId(data.id);
      setSearchQuery('');
    } catch (error) {
      console.error('Search error:', error);
      alert('City not found. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await fetchWeather(latitude, longitude);
          setCustomLocationData(data);
          setSelectedLocationId(data.id);
        } catch (error) {
          console.error('Error fetching weather:', error);
          alert('Failed to fetch weather data');
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsLoadingLocation(false);
        alert('Unable to retrieve your location');
      }
    );
  };

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
      />

      {/* Location Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface-1 p-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleLocateMe}
            disabled={isLoadingLocation}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg border border-primary/20 transition-all disabled:opacity-50 text-sm font-medium whitespace-nowrap"
            title="Use my location"
          >
            {isLoadingLocation ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Crosshair className="w-4 h-4" />
            )}
            Locate Me
          </button>

          <div className="h-6 w-px bg-border mx-2 hidden md:block" />

          <form onSubmit={handleSearch} className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-surface-2 border border-border rounded-lg focus:outline-none focus:border-primary/50 transition-all"
            />
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-2 rounded-lg border border-border">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">{locationData.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Updated now</span>
          </div>
        </div>
      </div>

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
            <StatusBadge status={locationData.status} score={locationData.stressScore} size="xl" />
            <p className="text-xs text-muted-foreground mt-3 max-w-sm">
              {locationData.status === 'critical'
                ? 'Elevated stress detected. Limit outdoor exposure immediately.'
                : locationData.status === 'strained'
                  ? 'Conditions are straining. Monitor metrics closely.'
                  : 'Conditions are optimal. Safe for outdoor activity.'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Next Safe Window', value: '8:00 PM', icon: <CheckCircle className="w-3.5 h-3.5" /> },
              { label: 'Critical Until', value: '4:00 PM', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
              { label: 'Recovery Score', value: `${locationData.recoveryIndex} / 100`, icon: <TrendingUp className="w-3.5 h-3.5" /> },
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

      {/* Global Map Section */}
      <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
        <SectionCard title="Global Climate Awareness">
          <ClimateMap
            onLocationSelect={(id) => {
              setSelectedLocationId(id);
              setCustomLocationData(null); // Reset custom search when map is clicked
            }}
            selectedId={selectedLocationId}
            customLocation={customLocationData}
          />
        </SectionCard>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'Temperature', value: locationData.temperature, unit: '°C', icon: <Thermometer className="w-4 h-4" />, status: locationData.status, subtitle: `Real-time` },
          { label: 'Humidity', value: `${locationData.humidity}%`, unit: '', icon: <Droplets className="w-4 h-4" />, status: locationData.status, subtitle: 'Moisture level' },
          { label: 'AQI', value: locationData.aqi, unit: '', icon: <Wind className="w-4 h-4" />, status: (locationData.aqi > 100 ? 'critical' : locationData.aqi > 50 ? 'strained' : 'safe') as 'safe' | 'strained' | 'critical', subtitle: 'Air Quality' },
          { label: 'Indoor CO₂', value: locationData.co2Indoor, unit: 'ppm', icon: <Cpu className="w-4 h-4" />, status: locationData.status, subtitle: 'Ventilation' },
          { label: 'Energy Load', value: locationData.energyDemand, unit: 'kW', icon: <Zap className="w-4 h-4" />, status: (locationData.status === 'critical' ? 'critical' : 'strained') as 'safe' | 'strained' | 'critical', subtitle: 'Grid demand' },
          { label: 'Heat Index', value: locationData.heatIndex, unit: '°C', icon: <Thermometer className="w-4 h-4" />, status: locationData.status, subtitle: 'Feels like' },
          { label: 'Recovery', value: `${locationData.recoveryIndex}%`, unit: '', icon: <TrendingUp className="w-4 h-4" />, status: 'safe' as const, subtitle: 'Resilience' },
        ].map((m, i) => (
          <motion.div key={i} variants={fadeUp}>
            <MetricCard
              {...m}
              status={m.status as 'safe' | 'strained' | 'critical'}
            />
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
              <div key={i} className={`rounded-xl p-4 ${predictions[i + 1]?.status === 'critical' ? 'status-critical-bg' :
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

      {/* AI Assistant Floating Widget */}
      <DashboardAIAssistant />
    </div>
  );
}
