import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { locations, LocationData } from '@/data/mockData';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

// Fix for leaflet marker icons in React
import L from 'leaflet';
// This fix is often needed, but CircleMarkers avoid icon issues entirely

interface ClimateMapProps {
    onLocationSelect: (id: string) => void;
    selectedId: string;
}

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 10, { duration: 1.5 });
    }, [center, map]);
    return null;
}

export function ClimateMap({ onLocationSelect, selectedId, customLocation }: ClimateMapProps & { customLocation?: LocationData | null }) {
    const selectedLocation = (customLocation && customLocation.id === selectedId)
        ? customLocation
        : locations.find(l => l.id === selectedId) || locations[0];

    return (
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-border bg-card">
            <MapContainer
                center={[22.5937, 78.9629]}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <MapUpdater center={[selectedLocation.lat, selectedLocation.lng]} />

                {/* Render static locations */}
                {locations.map((loc) => (
                    <CircleMarker
                        key={loc.id}
                        center={[loc.lat, loc.lng]}
                        radius={loc.id === selectedId ? 12 : 6}
                        pathOptions={{
                            color: loc.status === 'critical' ? '#ef4444' : loc.status === 'strained' ? '#f59e0b' : '#10b981',
                            fillColor: loc.status === 'critical' ? '#ef4444' : loc.status === 'strained' ? '#f59e0b' : '#10b981',
                            fillOpacity: loc.id === selectedId ? 0.8 : 0.5,
                            weight: loc.id === selectedId ? 3 : 1
                        }}
                        eventHandlers={{
                            click: () => onLocationSelect(loc.id),
                        }}
                    >
                        <Popup className="bg-card text-foreground border border-border">
                            <div className="p-1">
                                <h3 className="font-bold text-sm">{loc.name}</h3>
                                <p className="text-xs text-muted-foreground">Status: <span className={`uppercase font-mono ${loc.status === 'critical' ? 'text-critical' : loc.status === 'strained' ? 'text-strained' : 'text-safe'
                                    }`}>{loc.status}</span></p>
                                <p className="text-xs">Temp: {loc.temperature}°C | AQI: {loc.aqi}</p>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}

                {/* Render custom location if active */}
                {customLocation && selectedId === customLocation.id && (
                    <CircleMarker
                        key={customLocation.id}
                        center={[customLocation.lat, customLocation.lng]}
                        radius={12}
                        pathOptions={{
                            color: '#3b82f6', // Blue for custom
                            fillColor: '#3b82f6',
                            fillOpacity: 0.8,
                            weight: 3
                        }}
                    >
                        <Popup className="bg-card text-foreground border border-border">
                            <div className="p-1">
                                <h3 className="font-bold text-sm">{customLocation.name}</h3>
                                <p className="text-xs text-muted-foreground">Status: <span className={`uppercase font-mono ${customLocation.status === 'critical' ? 'text-critical' : customLocation.status === 'strained' ? 'text-strained' : 'text-safe'
                                    }`}>{customLocation.status}</span></p>
                                <p className="text-xs">Temp: {customLocation.temperature}°C | AQI: {customLocation.aqi}</p>
                            </div>
                        </Popup>
                    </CircleMarker>
                )}
            </MapContainer>

            {/* Legend / Overlay */}
            <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-md p-3 rounded-lg border border-border z-[400] max-w-xs">
                <h4 className="text-xs font-bold mb-2">Global Climate Grid</h4>
                <div className="flex gap-3 text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-safe" /> Safe</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-strained" /> Strained</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-critical" /> Critical</div>
                </div>
            </div>
        </div>
    );
}
