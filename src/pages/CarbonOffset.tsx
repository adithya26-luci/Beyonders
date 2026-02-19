import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader, SectionCard, StatusBadge } from '@/components/climate/ClimateComponents';
import { Leaf, Factory, Wind, Zap, TreeDeciduous, TrendingUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { co2Sensors, offsetProjects, CO2Sensor, OffsetProject } from '@/data/mockData';

export default function CarbonOffset() {
    const [credits, setCredits] = useState(150); // Start with some credits
    const [totalOffset, setTotalOffset] = useState(125); // Total tons offset
    const [selectedProject, setSelectedProject] = useState<OffsetProject | null>(null);

    // Calculate total emissions from sensors (just a simple sum for demo)
    const totalEmissions = useMemo(() => {
        return co2Sensors.reduce((acc, sensor) => acc + sensor.value, 0);
    }, []);

    const handleInvest = (project: OffsetProject) => {
        if (credits >= project.costPerTon) {
            setCredits(prev => prev - project.costPerTon);
            setTotalOffset(prev => prev + 1);
            // In a real app, we'd call an API here
            alert(`Invested in 1 ton of carbon offset from ${project.name}!`);
        } else {
            alert("Insufficient Carbon Credits. Earn more by reducing emissions below thresholds.");
        }
    };

    return (
        <div className="p-6 space-y-6 min-h-screen">
            <PageHeader
                title="Carbon Emission & Offsetting"
                subtitle="Monitor industrial emissions and invest in a greener future"
            >
                <div className="flex items-center gap-4">
                    <div className="bg-surface-1 px-4 py-2 rounded-lg border border-border flex items-center gap-3">
                        <div className="p-1.5 bg-primary/10 rounded-full">
                            <Leaf className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Carbon Credits</p>
                            <p className="text-lg font-bold font-mono">{credits}</p>
                        </div>
                    </div>
                    <div className="bg-surface-1 px-4 py-2 rounded-lg border border-border flex items-center gap-3">
                        <div className="p-1.5 bg-safe/10 rounded-full">
                            <TrendingUp className="w-4 h-4 text-safe" />
                        </div>
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Offset</p>
                            <p className="text-lg font-bold font-mono">{totalOffset} <span className="text-xs font-normal text-muted-foreground">tons</span></p>
                        </div>
                    </div>
                </div>
            </PageHeader>

            {/* Sensor Monitor Section */}
            <SectionCard title="Real-Time Emission Sensors">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {co2Sensors.map((sensor) => (
                        <div key={sensor.id} className="bg-surface-1 p-4 rounded-xl border border-border hover:border-primary/30 transition-all group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <Factory className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <div>
                                        <h4 className="font-semibold text-sm">{sensor.name}</h4>
                                        <p className="text-xs text-muted-foreground">{sensor.location}</p>
                                    </div>
                                </div>
                                <StatusBadge status={sensor.status} />
                            </div>

                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-2xl font-bold font-mono">{sensor.value}</span>
                                <span className="text-sm text-muted-foreground mb-1">{sensor.unit}</span>
                            </div>

                            <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${sensor.status === 'critical' ? 'bg-critical' : sensor.status === 'strained' ? 'bg-strained' : 'bg-safe'}`}
                                    style={{ width: `${Math.min(100, (sensor.value / 1500) * 100)}%` }} // Mock scale
                                />
                            </div>
                            <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                                <span>Trend: {sensor.trend === 'up' ? '↗ Rising' : sensor.trend === 'down' ? '↘ Falling' : '→ Stable'}</span>
                                <span>Updated: Just now</span>
                            </div>
                        </div>
                    ))}
                </div>
            </SectionCard>

            {/* Offset Marketplace Section */}
            <h2 className="text-xl font-bold mt-8 mb-4 flex items-center gap-2">
                <TreeDeciduous className="w-5 h-5 text-primary" />
                Green Project Catalogue
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offsetProjects.map((project) => (
                    <div key={project.id} className="bg-card border border-border rounded-xl overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-all">
                        <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                            <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white font-medium uppercase tracking-wider">
                                {project.type}
                            </div>
                        </div>
                        <div className="flex-1 p-5 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg mb-1">{project.name}</h3>
                                    {project.verified && (
                                        <div className="text-primary" title="Verified Project">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                                    <MapPinIcon className="w-3 h-3" /> {project.location}
                                </p>
                                <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                                    {project.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-4 border-t border-border pt-4">
                                <div>
                                    <p className="text-[10px] text-muted-foreground uppercase">Cost per Ton</p>
                                    <p className="text-xl font-bold font-mono text-primary">{project.costPerTon} <span className="text-xs font-normal text-muted-foreground">Credits</span></p>
                                </div>
                                <button
                                    onClick={() => handleInvest(project)}
                                    disabled={credits < project.costPerTon}
                                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Offset Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MapPinIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M20 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}
