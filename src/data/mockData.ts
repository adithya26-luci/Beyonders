// Mock climate data for EcoVate platform

export type ClimateStatus = 'safe' | 'strained' | 'critical';

export interface EnvironmentalMetrics {
  temperature: number;
  humidity: number;
  aqi: number;
  co2Indoor: number;
  energyDemand: number;
  heatIndex: number;
  recoveryIndex: number;
  timestamp: Date;
}

export interface ClimateSegment {
  hour: number;
  label: string;
  status: ClimateStatus;
  stressScore: number;
  confidence: number;
  explanation: string;
  temperature: number;
  humidity: number;
  aqi: number;
}

export interface StressTrigger {
  id: string;
  type: string;
  severity: ClimateStatus;
  detectedAt: string;
  duration: number;
  impact: string;
  value: number;
  threshold: number;
}

export interface Prediction {
  hour: string;
  temperature: number;
  humidity: number;
  aqi: number;
  stressScore: number;
  status: ClimateStatus;
  confidence: number;
}

export const currentMetrics: EnvironmentalMetrics = {
  temperature: 34.2,
  humidity: 78,
  aqi: 87,
  co2Indoor: 1240,
  energyDemand: 6.8,
  heatIndex: 41,
  recoveryIndex: 38,
  timestamp: new Date(),
};

export const currentStatus: ClimateStatus = 'strained';
export const currentStressScore = 58;

export const todayTimeline: ClimateSegment[] = [
  { hour: 0, label: '12 AM', status: 'safe', stressScore: 18, confidence: 94, explanation: 'Night cooling active, low energy demand', temperature: 22, humidity: 65, aqi: 32 },
  { hour: 1, label: '1 AM', status: 'safe', stressScore: 15, confidence: 96, explanation: 'Optimal recovery window, minimal activity', temperature: 21, humidity: 67, aqi: 28 },
  { hour: 2, label: '2 AM', status: 'safe', stressScore: 12, confidence: 97, explanation: 'Peak recovery – lowest stress point', temperature: 20, humidity: 68, aqi: 25 },
  { hour: 3, label: '3 AM', status: 'safe', stressScore: 14, confidence: 95, explanation: 'Continued recovery, clean air window', temperature: 20, humidity: 69, aqi: 27 },
  { hour: 4, label: '4 AM', status: 'safe', stressScore: 19, confidence: 93, explanation: 'Pre-dawn, stable conditions', temperature: 21, humidity: 70, aqi: 30 },
  { hour: 5, label: '5 AM', status: 'safe', stressScore: 22, confidence: 91, explanation: 'Early morning – still safe, slight humidity rise', temperature: 23, humidity: 72, aqi: 35 },
  { hour: 6, label: '6 AM', status: 'safe', stressScore: 28, confidence: 89, explanation: 'Morning activity start, acceptable conditions', temperature: 25, humidity: 74, aqi: 42 },
  { hour: 7, label: '7 AM', status: 'safe', stressScore: 35, confidence: 87, explanation: 'Rising temperature, still safe for outdoor activity', temperature: 27, humidity: 73, aqi: 48 },
  { hour: 8, label: '8 AM', status: 'strained', stressScore: 44, confidence: 85, explanation: 'Heat buildup begins, AQI approaching moderate', temperature: 30, humidity: 75, aqi: 58 },
  { hour: 9, label: '9 AM', status: 'strained', stressScore: 52, confidence: 83, explanation: 'Significant humidity and temperature spike', temperature: 32, humidity: 77, aqi: 72 },
  { hour: 10, label: '10 AM', status: 'strained', stressScore: 61, confidence: 81, explanation: 'High energy demand + heat index elevated', temperature: 34, humidity: 78, aqi: 82 },
  { hour: 11, label: '11 AM', status: 'critical', stressScore: 74, confidence: 79, explanation: 'Critical – outdoor exposure not recommended', temperature: 36, humidity: 80, aqi: 95 },
  { hour: 12, label: '12 PM', status: 'critical', stressScore: 82, confidence: 77, explanation: 'Peak stress – maximum heat index, poor air', temperature: 38, humidity: 81, aqi: 108 },
  { hour: 13, label: '1 PM', status: 'critical', stressScore: 86, confidence: 78, explanation: 'Highest stress point of day – stay indoors', temperature: 39, humidity: 82, aqi: 112 },
  { hour: 14, label: '2 PM', status: 'critical', stressScore: 84, confidence: 80, explanation: 'Still critical – energy grid under stress', temperature: 38, humidity: 81, aqi: 105 },
  { hour: 15, label: '3 PM', status: 'critical', stressScore: 78, confidence: 82, explanation: 'Slowly declining, still dangerous for vulnerable groups', temperature: 37, humidity: 80, aqi: 98 },
  { hour: 16, label: '4 PM', status: 'strained', stressScore: 68, confidence: 84, explanation: 'Slight improvement, moderate outdoor risk', temperature: 36, humidity: 78, aqi: 89 },
  { hour: 17, label: '5 PM', status: 'strained', stressScore: 62, confidence: 85, explanation: 'Evening cooldown starting, AQI improving', temperature: 34, humidity: 76, aqi: 82 },
  { hour: 18, label: '6 PM', status: 'strained', stressScore: 55, confidence: 87, explanation: 'Good time for light outdoor activity', temperature: 32, humidity: 74, aqi: 74 },
  { hour: 19, label: '7 PM', status: 'strained', stressScore: 48, confidence: 88, explanation: 'Temperature falling, humidity stabilizing', temperature: 30, humidity: 72, aqi: 65 },
  { hour: 20, label: '8 PM', status: 'safe', stressScore: 38, confidence: 90, explanation: 'Evening safe window opens', temperature: 28, humidity: 70, aqi: 55 },
  { hour: 21, label: '9 PM', status: 'safe', stressScore: 30, confidence: 92, explanation: 'Good for outdoor relaxation, air clearing', temperature: 26, humidity: 68, aqi: 48 },
  { hour: 22, label: '10 PM', status: 'safe', stressScore: 24, confidence: 93, explanation: 'Night recovery beginning, low stress', temperature: 25, humidity: 66, aqi: 40 },
  { hour: 23, label: '11 PM', status: 'safe', stressScore: 20, confidence: 95, explanation: 'Optimal sleep window, clean air', temperature: 23, humidity: 65, aqi: 35 },
];

export const yesterdayTimeline: ClimateSegment[] = todayTimeline.map(s => ({
  ...s,
  stressScore: Math.max(5, s.stressScore - Math.floor(Math.random() * 15) + 5),
  temperature: s.temperature - 2,
  humidity: s.humidity - 3,
}));

export const stressTriggers: StressTrigger[] = [
  { id: '1', type: 'Humidity Burst', severity: 'critical', detectedAt: '11:42 AM', duration: 38, impact: 'Elevated heat index, respiratory stress', value: 82, threshold: 75 },
  { id: '2', type: 'Indoor CO₂ Buildup', severity: 'strained', detectedAt: '10:15 AM', duration: 120, impact: 'Cognitive performance reduction possible', value: 1240, threshold: 1000 },
  { id: '3', type: 'Digital Heat Spike', severity: 'strained', detectedAt: '9:30 AM', duration: 45, impact: 'Server room thermal stress', value: 3.2, threshold: 2.5 },
  { id: '4', type: 'Weak Night Cooling', severity: 'safe', detectedAt: '2:00 AM', duration: 90, impact: 'Mild – recovery incomplete but adequate', value: 22, threshold: 20 },
  { id: '5', type: 'Micro Pollution Peak', severity: 'critical', detectedAt: '12:30 PM', duration: 25, impact: 'PM2.5 spike near traffic zone', value: 112, threshold: 80 },
  { id: '6', type: 'Energy Demand Surge', severity: 'strained', detectedAt: '1:15 PM', duration: 60, impact: 'Grid load at 89% capacity', value: 6.8, threshold: 5.5 },
];

export const predictions: Prediction[] = [
  { hour: 'Now', temperature: 34.2, humidity: 78, aqi: 87, stressScore: 58, status: 'strained', confidence: 91 },
  { hour: '+1h', temperature: 35.1, humidity: 79, aqi: 92, stressScore: 64, status: 'strained', confidence: 88 },
  { hour: '+2h', temperature: 36.8, humidity: 80, aqi: 98, stressScore: 72, status: 'critical', confidence: 84 },
  { hour: '+3h', temperature: 38.2, humidity: 81, aqi: 105, stressScore: 81, status: 'critical', confidence: 80 },
  { hour: '+4h', temperature: 38.9, humidity: 82, aqi: 110, stressScore: 85, status: 'critical', confidence: 76 },
  { hour: '+5h', temperature: 38.4, humidity: 81, aqi: 107, stressScore: 82, status: 'critical', confidence: 73 },
  { hour: '+6h', temperature: 37.1, humidity: 79, aqi: 99, stressScore: 74, status: 'critical', confidence: 70 },
  { hour: '+12h', temperature: 31.2, humidity: 72, aqi: 68, stressScore: 48, status: 'strained', confidence: 65 },
  { hour: '+24h', temperature: 26.4, humidity: 65, aqi: 45, stressScore: 28, status: 'safe', confidence: 58 },
];

export const historicalData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  avgStress: 35 + Math.sin(i * 0.5) * 20 + Math.random() * 10,
  maxTemp: 32 + Math.sin(i * 0.3) * 6 + Math.random() * 3,
  avgAqi: 55 + Math.cos(i * 0.4) * 20 + Math.random() * 15,
  safeHours: 8 + Math.sin(i * 0.6) * 4,
  criticalHours: 3 + Math.sin(i * 0.8) * 2,
}));

export const activityGuidance = [
  { activity: 'Outdoor Exercise', bestTime: '5:30 – 7:30 AM', nextWindow: '8:00 PM', risk: 'safe', icon: '🏃', reason: 'Low heat index, clean air' },
  { activity: "Children's Play", bestTime: '6:00 – 8:00 AM', nextWindow: '7:30 PM', risk: 'safe', icon: '👧', reason: 'Safe temperature range for kids' },
  { activity: 'Heavy Appliances', bestTime: '10:00 PM – 6:00 AM', nextWindow: '10:00 PM', risk: 'safe', icon: '🔌', reason: 'Off-peak energy demand window' },
  { activity: 'School Assembly', bestTime: 'Before 9:00 AM', nextWindow: 'Tomorrow 6 AM', risk: 'critical', icon: '🏫', reason: 'Afternoon is critical for students outdoors' },
  { activity: 'Delivery Operations', bestTime: '6:00 – 9:00 AM', nextWindow: '6:00 PM', risk: 'strained', icon: '🚚', reason: 'Beat afternoon heat for driver safety' },
  { activity: 'Gardening / Farming', bestTime: '5:00 – 7:00 AM', nextWindow: 'Tomorrow 5 AM', risk: 'safe', icon: '🌱', reason: 'Soil moisture optimal, safe temps' },
  { activity: 'Office Work (AC Off)', bestTime: '7:00 AM – 10:00 AM', nextWindow: '7:00 PM', risk: 'strained', icon: '💼', reason: 'Afternoon indoor CO₂ builds up' },
  { activity: 'Community Events', bestTime: '7:00 – 9:00 PM', nextWindow: '7:00 PM', risk: 'safe', icon: '🎉', reason: 'Evening safe window opens' },
];

export const recoveryWindows = [
  { type: 'Night Cooling', start: '10 PM', end: '6 AM', quality: 82, status: 'safe' as ClimateStatus, description: 'Temperature drops to recovery range' },
  { type: 'Clean Air Window', start: '11 PM', end: '7 AM', quality: 91, status: 'safe' as ClimateStatus, description: 'AQI below 40, optimal breathing' },
  { type: 'Low Energy Load', start: '10 PM', end: '6 AM', quality: 78, status: 'safe' as ClimateStatus, description: 'Grid demand at 30% capacity' },
  { type: 'Evening Cooldown', start: '7 PM', end: '9 PM', quality: 65, status: 'strained' as ClimateStatus, description: 'Partial recovery, suitable for mild activity' },
];

export const weeklyResilience = {
  family: 72,
  school: 58,
  business: 81,
  office: 68,
};
