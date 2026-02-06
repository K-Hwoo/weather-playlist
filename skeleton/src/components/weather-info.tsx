"use client";

import {
  Droplets,
  Wind,
  Thermometer,
  Eye,
  CloudRain,
  Sun,
  Cloud,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
} from "lucide-react";
import type { CurrentWeather, HourlyForecast } from "@/lib/weather-types";
import { getPmLevel } from "@/lib/weather-types";

function WeatherIcon({ weather, className = "w-5 h-5" }: { weather: string; className?: string }) {
  const w = weather.toLowerCase();
  if (w.includes("thunder")) return <CloudLightning className={className} />;
  if (w.includes("drizzle")) return <CloudDrizzle className={className} />;
  if (w.includes("rain")) return <CloudRain className={className} />;
  if (w.includes("snow")) return <CloudSnow className={className} />;
  if (w.includes("clear")) return <Sun className={className} />;
  return <Cloud className={className} />;
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}${ampm}`;
}

function formatUpdateTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}/${day} ${hours}:${minutes}`;
}

interface WeatherInfoProps {
  current: CurrentWeather;
  hourly: HourlyForecast[];
}

export default function WeatherInfo({ current, hourly }: WeatherInfoProps) {
  const pm25Level = getPmLevel(current.pm25);
  const pm10Level = getPmLevel(current.pm10);

  return (
    <div className="flex flex-col gap-3">
      {/* Header with update time */}
      <div className="flex items-center justify-between pb-2 border-b border-border/20">
        <h2 className="text-lg font-bold text-primary tracking-wide uppercase">
          {current.city}
        </h2>
        <p className="text-xs font-semibold text-muted-foreground">
          {formatUpdateTime(current.timestamp)}
        </p>
      </div>

      {/* Main temperature */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-start gap-0 relative">
            <span className="text-5xl font-bold text-foreground tracking-tight">{current.temp}</span>
            <div className="flex flex-col ml-0.5">
              <span className="text-base text-foreground font-bold leading-none">{"°"}</span>
              <span className="text-lg text-foreground font-bold leading-none -mt-1">{"C"}</span>
            </div>
          </div>
          <p className="text-sm font-semibold text-foreground mt-1 capitalize">{current.description}</p>
          <p className="text-xs font-medium text-foreground">
            {"Feels like "}
            <span className="font-bold text-foreground">{current.feels_like}{"°C"}</span>
            {" / "}
            <span className="font-bold text-foreground">{current.temp_min}{"°~"}
            {current.temp_max}{"°"}</span>
          </p>
        </div>
        <div className="text-primary">
          <WeatherIcon weather={current.weather} className="w-12 h-12 opacity-85" />
        </div>
      </div>

      {/* Detail cards */}
      <div className="grid grid-cols-4 gap-2">
        <div className="flex flex-col items-center gap-1 bg-secondary/60 rounded-lg px-2 py-2">
          <Droplets className="w-4 h-4 text-primary" />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Humidity</p>
          <p className="text-sm font-bold text-foreground">{current.humidity}%</p>
        </div>
        <div className="flex flex-col items-center gap-1 bg-secondary/60 rounded-lg px-2 py-2">
          <Wind className="w-4 h-4 text-primary" />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">Wind</p>
          <p className="text-sm font-bold text-foreground">{current.wind_speed} m/s</p>
        </div>
        <div className="flex flex-col items-center gap-1 bg-secondary/60 rounded-lg px-2 py-2">
          <Thermometer className="w-4 h-4" style={{ color: pm25Level.color }} />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">PM2.5</p>
          <p className="text-sm font-bold text-foreground">{current.pm25}</p>
        </div>
        <div className="flex flex-col items-center gap-1 bg-secondary/60 rounded-lg px-2 py-2">
          <Eye className="w-4 h-4" style={{ color: pm10Level.color }} />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">PM10</p>
          <p className="text-sm font-bold text-foreground">{current.pm10}</p>
        </div>
      </div>

      {/* Hourly forecast - full width */}
      <div className="mt-1 -mx-5 -mb-5 px-5 py-3 border-t border-border/20">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
          24-Hour Forecast
        </h3>
        <div className="grid grid-cols-8 gap-2">
          {hourly.map((hour, i) => (
            <div
              key={hour.time}
              className={`flex flex-col items-center gap-1 px-1.5 py-2 rounded-lg ${
                i === 0 ? "bg-primary/15 border-2 border-primary" : "bg-secondary/60 border border-border/30"
              }`}
            >
              <span className="text-xs font-bold text-foreground">
                {i === 0 ? "Now" : formatTime(hour.time)}
              </span>
              <WeatherIcon weather={hour.weather} className="w-5 h-5 text-primary" />
              <span className="text-xs font-bold text-foreground">{Math.round(hour.temp)}{"°"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
