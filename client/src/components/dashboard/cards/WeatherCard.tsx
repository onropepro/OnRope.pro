import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Cloud, Wind, AlertTriangle } from "lucide-react";
import type { CardProps } from "../cardRegistry";
import { useTranslation } from "react-i18next";

interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windGusts: number;
    windDirection: number;
    weatherCode: number;
    time: string;
  };
  hourly: Array<{
    time: string;
    windSpeed: number;
    windGusts: number;
  }>;
}

function getWindSafetyLevel(windSpeed: number) {
  if (windSpeed >= 50) return { levelKey: "unsafe", color: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", badge: "bg-red-100 text-red-700" };
  if (windSpeed >= 35) return { levelKey: "highRisk", color: "text-orange-700 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30", badge: "bg-orange-100 text-orange-700" };
  if (windSpeed >= 20) return { levelKey: "caution", color: "text-yellow-700 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-950/30", badge: "bg-yellow-100 text-yellow-700" };
  return { levelKey: "safe", color: "text-green-700 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/30", badge: "bg-green-100 text-green-700" };
}

const SAFETY_LEVEL_LABELS: Record<string, string> = {
  safe: 'Safe',
  caution: 'Caution',
  highRisk: 'High Risk',
  unsafe: 'Unsafe',
};

export function WeatherCard({ branding, onRouteNavigate }: CardProps) {
  const { t } = useTranslation();
  
  const savedCoords = typeof window !== 'undefined' 
    ? localStorage.getItem('weather_coordinates') 
    : null;
  const coords = savedCoords ? JSON.parse(savedCoords) : { lat: 49.2827, lon: -123.1207 };
  const lat = coords.lat;
  const lon = coords.lon ?? coords.lng;
  
  const { data: weatherData, isLoading, error } = useQuery<WeatherData>({
    queryKey: ['/api/weather', lat, lon],
    refetchInterval: 300000,
    queryFn: async () => {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      if (!response.ok) throw new Error("Failed to fetch weather");
      return response.json();
    },
  });

  const accentColor = branding?.primaryColor || "#0B64A3";

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Cloud className="w-5 h-5" style={{ color: accentColor }} />
            {t('weather.title', 'Weather')}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex-1 min-h-0">
          <div className="animate-pulse h-16 bg-muted rounded" />
        </CardContent>
      </div>
    );
  }

  if (error || !weatherData?.current) {
    return (
      <div className="flex flex-col h-full">
        <CardHeader className="px-4 py-3 flex-shrink-0">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Cloud className="w-5 h-5" style={{ color: accentColor }} />
            {t('weather.title', 'Weather')}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex-1 min-h-0 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">{t('weather.unavailable', 'Weather unavailable')}</p>
        </CardContent>
      </div>
    );
  }

  const windSpeed = weatherData.current.windSpeed;
  const windGusts = weatherData.current.windGusts;
  const safety = getWindSafetyLevel(windSpeed);

  const now = new Date();
  const upcomingHours = weatherData.hourly
    ?.filter((h) => new Date(h.time) >= now)
    .slice(0, 6) || [];

  return (
    <div 
      className="flex flex-col h-full cursor-pointer hover-elevate" 
      onClick={() => onRouteNavigate("/weather")}
      data-testid="card-weather"
    >
      <CardHeader className="px-4 py-3 flex-shrink-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Cloud className="w-5 h-5" style={{ color: accentColor }} />
          {t('weather.title', 'Weather')}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 min-h-0 space-y-3">
        <div className={`rounded-lg p-3 w-full ${safety.bg}`}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Wind className={`w-5 h-5 ${safety.color}`} />
                <p className={`text-xl font-bold ${safety.color}`} data-testid="text-weather-wind">
                  {Math.round(windSpeed)} km/h
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('weather.gusts', 'Gusts')}: {Math.round(windGusts)} km/h
              </p>
            </div>
            <Badge className={safety.badge}>
              {safety.levelKey === "unsafe" || safety.levelKey === "highRisk" ? (
                <AlertTriangle className="w-3 h-3 mr-1" />
              ) : null}
              {t(`weather.safety.${safety.levelKey}`, SAFETY_LEVEL_LABELS[safety.levelKey])}
            </Badge>
          </div>
        </div>
        
        {upcomingHours.length > 0 && (
          <div className="flex gap-1 justify-between">
            {upcomingHours.map((hour, index) => {
              const hourSafety = getWindSafetyLevel(hour.windSpeed);
              const time = new Date(hour.time);
              return (
                <div 
                  key={hour.time}
                  className={`flex-1 text-center p-1.5 rounded ${hourSafety.bg}`}
                  data-testid={`forecast-${index}`}
                >
                  <div className="text-[10px] text-muted-foreground">
                    {index === 0 ? t('weather.now', 'Now') : time.toLocaleTimeString([], { hour: 'numeric' })}
                  </div>
                  <div className={`text-xs font-semibold ${hourSafety.color}`}>
                    {Math.round(hour.windSpeed)} <span className="text-[9px] font-normal">km/h</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </div>
  );
}
