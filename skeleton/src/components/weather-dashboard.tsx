"use client";

import { useEffect, useState, useCallback } from "react";
import { MapPin, RefreshCw, Loader2 } from "lucide-react";
import useSWR from "swr";
import WeatherBackground from "@/components/weather-background";
import WeatherInfo from "@/components/weather-info";
import YoutubePlaylist from "@/components/youtube-playlist";
import type { WeatherData, YoutubeVideo } from "@/lib/weather-types";
import { weatherFetcher } from "@/lib/api/weather";

interface YoutubeResponse {
  items: YoutubeVideo[];
  query: string;
}

// YouTube API fetcher (기존 유지)
const youtubeFetcher = (url: string) => fetch(url).then((res) => res.json() as Promise<YoutubeResponse>);

export default function WeatherDashboard() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState(false);

  const requestLocation = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLocationError(false);
        },
        () => {
          // Default to Seoul if geolocation fails
          setCoords({ lat: 37.5665, lon: 126.978 });
          setLocationError(true);
        }
      );
    } else {
      setCoords({ lat: 37.5665, lon: 126.978 });
      setLocationError(true);
    }
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const weatherUrl = coords
    ? `/api/weather?lat=${coords.lat}&lon=${coords.lon}`
    : null;

  const { data: weatherData, isLoading: weatherLoading, mutate: refreshWeather } = useSWR<WeatherData>(
    weatherUrl,
    weatherFetcher,
    { revalidateOnFocus: false, dedupingInterval: 300000 }
  );

  const youtubeUrl = weatherData
    ? `/api/youtube?weather=${weatherData.current.weather}&temp=${weatherData.current.temp}`
    : null;

  const { data: youtubeData, isLoading: youtubeLoading } = useSWR<YoutubeResponse>(
    youtubeUrl,
    youtubeFetcher,
    { revalidateOnFocus: false, dedupingInterval: 600000 }
  );

  const handleRefresh = () => {
    refreshWeather();
  };

  if (!coords || weatherLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <WeatherBackground weather="Clouds" />
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <WeatherBackground weather="Clouds" />
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-muted-foreground">Failed to load weather data</p>
          <button
            onClick={handleRefresh}
            className="text-sm text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <WeatherBackground weather={weatherData.current.weather} />

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-6 md:py-10">
        {/* Header bar */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground font-medium">
              {weatherData.current.city}
            </span>
            {locationError && (
              <span className="text-[10px] text-muted-foreground">(default location)</span>
            )}
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-secondary/50"
            aria-label="Refresh weather data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </header>

        {/* Top section: Weather Info - Full Width */}
        <section className="mb-8 liquid-glass rounded-2xl p-5">
          <WeatherInfo current={weatherData.current} hourly={weatherData.hourly} />
        </section>

        {/* YouTube Playlist section */}
        <section className="liquid-glass rounded-2xl p-5">
          {youtubeLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground ml-2">
                Loading playlists...
              </span>
            </div>
          ) : youtubeData ? (
            <YoutubePlaylist videos={youtubeData.items} query={youtubeData.query} />
          ) : (
            <div className="flex items-center justify-center py-10">
              <p className="text-sm text-muted-foreground">No playlists found</p>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-[10px] text-muted-foreground/50">
            Weather data by OpenWeatherMap / Music by YouTube
          </p>
        </footer>
      </main>
    </div>
  );
}
