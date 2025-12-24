import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

type WeatherData = {
  current: {
    temperature: number;
    temperatureUnit: string;
    humidity: number;
    weatherCode: number;
    windSpeed: number;
    windSpeedUnit: string;
    windDirection: number;
    windGusts: number;
    time: string;
  };
  hourly: Array<{
    time: string;
    temperature: number;
    weatherCode: number;
    windSpeed: number;
    windDirection: number;
    windGusts: number;
  }>;
  timezone: string;
  location: { lat: number; lon: number };
};

const WEATHER_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: "Clear sky", icon: "wb_sunny" },
  1: { description: "Mainly clear", icon: "wb_sunny" },
  2: { description: "Partly cloudy", icon: "partly_cloudy_day" },
  3: { description: "Overcast", icon: "cloud" },
  45: { description: "Fog", icon: "foggy" },
  48: { description: "Rime fog", icon: "foggy" },
  51: { description: "Light drizzle", icon: "grain" },
  53: { description: "Moderate drizzle", icon: "grain" },
  55: { description: "Dense drizzle", icon: "grain" },
  61: { description: "Slight rain", icon: "rainy" },
  63: { description: "Moderate rain", icon: "rainy" },
  65: { description: "Heavy rain", icon: "rainy" },
  71: { description: "Slight snow", icon: "ac_unit" },
  73: { description: "Moderate snow", icon: "ac_unit" },
  75: { description: "Heavy snow", icon: "ac_unit" },
  77: { description: "Snow grains", icon: "ac_unit" },
  80: { description: "Slight showers", icon: "rainy" },
  81: { description: "Moderate showers", icon: "rainy" },
  82: { description: "Violent showers", icon: "rainy" },
  85: { description: "Slight snow showers", icon: "cloudy_snowing" },
  86: { description: "Heavy snow showers", icon: "cloudy_snowing" },
  95: { description: "Thunderstorm", icon: "thunderstorm" },
  96: { description: "Thunderstorm with hail", icon: "thunderstorm" },
  99: { description: "Thunderstorm with heavy hail", icon: "thunderstorm" },
};

function getWindDirection(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

function getWindSafetyLevel(windSpeed: number): { level: string; color: string; bgColor: string } {
  if (windSpeed < 20) {
    return { level: "Safe", color: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-900/30" };
  } else if (windSpeed < 35) {
    return { level: "Caution", color: "text-yellow-600 dark:text-yellow-400", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" };
  } else if (windSpeed < 50) {
    return { level: "High Risk", color: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-100 dark:bg-orange-900/30" };
  } else {
    return { level: "Unsafe", color: "text-red-600 dark:text-red-400", bgColor: "bg-red-100 dark:bg-red-900/30" };
  }
}

export default function Weather() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [locationName, setLocationName] = useState<string>("Loading location...");
  const [manualLocation, setManualLocation] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const savedCoords = localStorage.getItem("weather_coordinates");
    const savedName = localStorage.getItem("weather_location_name");
    
    if (savedCoords && savedName) {
      setCoordinates(JSON.parse(savedCoords));
      setLocationName(savedName);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = { lat: position.coords.latitude, lon: position.coords.longitude };
            setCoordinates(coords);
            setLocationName("Current Location");
            localStorage.setItem("weather_coordinates", JSON.stringify(coords));
            localStorage.setItem("weather_location_name", "Current Location");
          },
          () => {
            const defaultCoords = { lat: 49.2827, lon: -123.1207 };
            setCoordinates(defaultCoords);
            setLocationName("Vancouver, BC (Default)");
          }
        );
      } else {
        const defaultCoords = { lat: 49.2827, lon: -123.1207 };
        setCoordinates(defaultCoords);
        setLocationName("Vancouver, BC (Default)");
      }
    }
  }, []);

  const { data: weatherData, isLoading, error, refetch } = useQuery<WeatherData>({
    queryKey: ['/api/weather', coordinates?.lat, coordinates?.lon],
    enabled: !!coordinates,
    refetchInterval: 10 * 60 * 1000,
    queryFn: async () => {
      const response = await fetch(`/api/weather?lat=${coordinates!.lat}&lon=${coordinates!.lon}`);
      if (!response.ok) throw new Error("Failed to fetch weather");
      return response.json();
    },
  });

  const handleSearchLocation = async () => {
    if (!manualLocation.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(manualLocation)}&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY || process.env.GEOAPIFY_API_KEY}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const coords = { lat: feature.geometry.coordinates[1], lon: feature.geometry.coordinates[0] };
        const name = feature.properties.formatted || manualLocation;
        
        setCoordinates(coords);
        setLocationName(name);
        localStorage.setItem("weather_coordinates", JSON.stringify(coords));
        localStorage.setItem("weather_location_name", name);
        setManualLocation("");
        
        toast({
          title: t('weather.locationUpdated', 'Location Updated'),
          description: name,
        });
      } else {
        toast({
          title: t('weather.locationNotFound', 'Location Not Found'),
          description: t('weather.tryAgain', 'Please try a different search term'),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      toast({
        title: t('weather.searchError', 'Search Error'),
        description: t('weather.searchErrorDesc', 'Could not search for location'),
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const weatherInfo = weatherData?.current?.weatherCode !== undefined 
    ? WEATHER_CODES[weatherData.current.weatherCode] || { description: "Unknown", icon: "help" }
    : { description: "Loading...", icon: "sync" };

  const windSafety = weatherData?.current?.windSpeed !== undefined 
    ? getWindSafetyLevel(weatherData.current.windSpeed)
    : { level: "Unknown", color: "text-muted-foreground", bgColor: "bg-muted" };

  const now = new Date();
  const relevantHours = weatherData?.hourly?.filter((h) => {
    const hourDate = new Date(h.time);
    return hourDate >= now;
  }).slice(0, 12) || [];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="text-weather-title">
            <span className="material-icons text-primary">cloud</span>
            {t('weather.title', 'Weather Conditions')}
          </h1>
          <p className="text-muted-foreground text-sm" data-testid="text-weather-description">
            {t('weather.description', 'Current weather and wind conditions for safe rope access work')}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="material-icons text-sm">location_on</span>
            {t('weather.location', 'Location')}
          </CardTitle>
          <CardDescription>{locationName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder={t('weather.searchPlaceholder', 'Search city or address...')}
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchLocation()}
              className="flex-1"
              data-testid="input-location-search"
            />
            <Button 
              onClick={handleSearchLocation} 
              disabled={isSearching || !manualLocation.trim()}
              data-testid="button-search-location"
            >
              {isSearching ? (
                <span className="material-icons animate-spin text-sm">sync</span>
              ) : (
                <span className="material-icons text-sm">search</span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <span className="material-icons animate-spin text-4xl text-muted-foreground">sync</span>
        </div>
      )}

      {error && (
        <Card className="border-destructive">
          <CardContent className="py-6 text-center">
            <span className="material-icons text-destructive text-3xl mb-2">error</span>
            <p className="text-destructive">{t('weather.error', 'Failed to load weather data')}</p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              {t('weather.retry', 'Try Again')}
            </Button>
          </CardContent>
        </Card>
      )}

      {weatherData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card data-testid="card-current-weather">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="material-icons text-sm">{weatherInfo.icon}</span>
                  {t('weather.currentConditions', 'Current Conditions')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold" data-testid="text-temperature">
                    {Math.round(weatherData.current.temperature)}{weatherData.current.temperatureUnit}
                  </div>
                  <div>
                    <p className="font-medium" data-testid="text-weather-condition">{weatherInfo.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('weather.humidity', 'Humidity')}: {weatherData.current.humidity}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={windSafety.bgColor} data-testid="card-wind-conditions">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="material-icons text-sm">air</span>
                    {t('weather.windConditions', 'Wind Conditions')}
                  </CardTitle>
                  <Badge variant="outline" className={windSafety.color} data-testid="badge-wind-safety">
                    {windSafety.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('weather.windSpeed', 'Wind Speed')}</span>
                    <span className="font-bold text-lg" data-testid="text-wind-speed">
                      {Math.round(weatherData.current.windSpeed)} {weatherData.current.windSpeedUnit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('weather.windGusts', 'Wind Gusts')}</span>
                    <span className="font-semibold" data-testid="text-wind-gusts">
                      {Math.round(weatherData.current.windGusts)} {weatherData.current.windSpeedUnit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('weather.windDirection', 'Direction')}</span>
                    <span className="flex items-center gap-1" data-testid="text-wind-direction">
                      <span 
                        className="material-icons text-sm" 
                        style={{ transform: `rotate(${weatherData.current.windDirection}deg)` }}
                      >
                        navigation
                      </span>
                      {getWindDirection(weatherData.current.windDirection)} ({weatherData.current.windDirection}°)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card data-testid="card-wind-safety-guide">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="material-icons text-sm">warning</span>
                {t('weather.safetyGuide', 'Wind Safety Guide')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="p-2 rounded-md bg-green-100 dark:bg-green-900/30">
                  <div className="font-medium text-green-700 dark:text-green-300">{t('weather.safe', 'Safe')}</div>
                  <div className="text-green-600 dark:text-green-400">{"< 20 km/h"}</div>
                </div>
                <div className="p-2 rounded-md bg-yellow-100 dark:bg-yellow-900/30">
                  <div className="font-medium text-yellow-700 dark:text-yellow-300">{t('weather.caution', 'Caution')}</div>
                  <div className="text-yellow-600 dark:text-yellow-400">20-35 km/h</div>
                </div>
                <div className="p-2 rounded-md bg-orange-100 dark:bg-orange-900/30">
                  <div className="font-medium text-orange-700 dark:text-orange-300">{t('weather.highRisk', 'High Risk')}</div>
                  <div className="text-orange-600 dark:text-orange-400">35-50 km/h</div>
                </div>
                <div className="p-2 rounded-md bg-red-100 dark:bg-red-900/30">
                  <div className="font-medium text-red-700 dark:text-red-300">{t('weather.unsafe', 'Unsafe')}</div>
                  <div className="text-red-600 dark:text-red-400">{"> 50 km/h"}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-hourly-forecast">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="material-icons text-sm">schedule</span>
                {t('weather.hourlyForecast', 'Hourly Wind Forecast')}
              </CardTitle>
              <CardDescription>
                {t('weather.next12Hours', 'Next 12 hours')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-6 px-6">
                <div className="flex gap-3 pb-2" style={{ minWidth: "max-content" }}>
                  {relevantHours.map((hour, index) => {
                    const hourSafety = getWindSafetyLevel(hour.windSpeed);
                    const time = new Date(hour.time);
                    const isNow = index === 0;
                    
                    return (
                      <div 
                        key={hour.time}
                        className={`flex-shrink-0 w-20 p-3 rounded-md text-center ${hourSafety.bgColor} ${isNow ? 'ring-2 ring-primary' : ''}`}
                        data-testid={`hourly-${index}`}
                      >
                        <div className="text-xs font-medium mb-1">
                          {isNow ? t('weather.now', 'Now') : time.toLocaleTimeString([], { hour: 'numeric' })}
                        </div>
                        <div className="text-lg font-bold">{Math.round(hour.windSpeed)}</div>
                        <div className="text-xs text-muted-foreground">km/h</div>
                        {hour.windGusts > hour.windSpeed + 10 && (
                          <div className="text-xs mt-1 text-orange-600 dark:text-orange-400">
                            {t('weather.gusts', 'Gusts')}: {Math.round(hour.windGusts)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
