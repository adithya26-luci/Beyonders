import { LocationData, ClimateStatus } from '../data/mockData';

interface OpenMeteoWeatherResponse {
    current: {
        temperature_2m: number;
        relative_humidity_2m: number;
        apparent_temperature: number;
        precipitation: number;
        weather_code: number;
        wind_speed_10m: number;
    };
}

interface OpenMeteoAirQualityResponse {
    current: {
        us_aqi: number;
    };
}

export async function fetchWeather(lat: number, lng: number): Promise<LocationData> {
    try {
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m`;
        const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi`;
        const geocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

        const [weatherRes, aqiRes, geoRes] = await Promise.all([
            fetch(weatherUrl),
            fetch(aqiUrl),
            fetch(geocodingUrl)
        ]);

        if (!weatherRes.ok || !aqiRes.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const weatherData: OpenMeteoWeatherResponse = await weatherRes.json();
        const aqiData: OpenMeteoAirQualityResponse = await aqiRes.json();
        let locationName = 'Current Location';

        if (geoRes.ok) {
            const geoData: any = await geoRes.json();
            locationName = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.county || 'Current Location';
        }

        const current = weatherData.current;
        const aqi = aqiData.current.us_aqi;

        // Determine status based on AQI and Heat Index (apparent temp)
        let status: ClimateStatus = 'safe';
        if (aqi > 150 || current.apparent_temperature > 40) {
            status = 'critical';
        } else if (aqi > 100 || current.apparent_temperature > 35) {
            status = 'strained';
        }

        // Calculate a mock stress score derived from real data
        const stressScore = Math.min(100, Math.max(0,
            (aqi / 3) + (current.apparent_temperature * 1.5) - 20
        ));

        return {
            id: 'gps-location',
            name: locationName,
            lat,
            lng,
            temperature: current.temperature_2m,
            humidity: current.relative_humidity_2m,
            aqi: aqi,
            co2Indoor: 450, // Mocked as we can't measure this
            energyDemand: 3.5, // Mocked
            heatIndex: current.apparent_temperature,
            recoveryIndex: Math.round(100 - stressScore),
            status,
            stressScore: Math.round(stressScore),
            timestamp: new Date()
        };

    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}

export async function searchCity(query: string): Promise<LocationData> {
    try {
        const searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
        const res = await fetch(searchUrl);

        if (!res.ok) throw new Error('Failed to search city');

        const data: any = await res.json();
        if (!data || data.length === 0) {
            throw new Error('City not found');
        }

        const { lat, lon, display_name } = data[0];
        const locationData = await fetchWeather(parseFloat(lat), parseFloat(lon));

        return {
            ...locationData,
            id: `search-${query.toLowerCase().replace(/\s+/g, '-')}`,
            name: display_name.split(',')[0]
        };

    } catch (error) {
        console.error('Error searching city:', error);
        throw error;
    }
}
