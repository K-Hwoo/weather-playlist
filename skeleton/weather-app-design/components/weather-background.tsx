"use client";

import { useMemo } from "react";
import { getWeatherCategory } from "@/lib/weather-types";

interface WeatherBackgroundProps {
  weather: string;
}

function RainEffect() {
  const drops = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.6 + Math.random() * 0.4,
        opacity: 0.2 + Math.random() * 0.4,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute w-px rain-drop"
          style={{
            left: `${drop.left}%`,
            top: "-10%",
            height: "15px",
            background: `linear-gradient(to bottom, transparent, rgba(150, 170, 200, ${drop.opacity}))`,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200/25 via-slate-300/15 to-blue-300/30" />
    </div>
  );
}

function SnowEffect() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 6,
        size: 2 + Math.random() * 4,
        opacity: 0.3 + Math.random() * 0.5,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full snow-flake"
          style={{
            left: `${flake.left}%`,
            top: "-5%",
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            background: `rgba(255, 255, 255, ${flake.opacity})`,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100/15 via-slate-200/10 to-blue-200/20" />
    </div>
  );
}

function SunnyEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Sun glow */}
      <div
        className="absolute sun-ray rounded-full"
        style={{
          top: "-20%",
          right: "-10%",
          width: "60%",
          height: "60%",
          background: "radial-gradient(circle, rgba(255, 200, 50, 0.15) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute sun-ray rounded-full"
        style={{
          top: "-10%",
          right: "0%",
          width: "40%",
          height: "40%",
          background: "radial-gradient(circle, rgba(255, 220, 100, 0.1) 0%, transparent 60%)",
          animationDelay: "2s",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-200/15 via-orange-100/8 to-blue-100/5" />
    </div>
  );
}

function CloudyEffect() {
  const clouds = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        top: 5 + Math.random() * 30,
        delay: i * 8,
        duration: 30 + Math.random() * 20,
        opacity: 0.04 + Math.random() * 0.06,
        scale: 0.8 + Math.random() * 0.6,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute cloud-element"
          style={{
            top: `${cloud.top}%`,
            left: "-20%",
            width: "300px",
            height: "80px",
            background: `rgba(200, 220, 240, ${cloud.opacity})`,
            borderRadius: "100px",
            filter: "blur(30px)",
            transform: `scale(${cloud.scale})`,
            animationDelay: `${cloud.delay}s`,
            animationDuration: `${cloud.duration}s`,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-400/8 via-slate-300/5 to-blue-100/8" />
    </div>
  );
}

function StormEffect() {
  const drops = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: 0.4 + Math.random() * 0.3,
        opacity: 0.3 + Math.random() * 0.5,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute w-px rain-drop"
          style={{
            left: `${drop.left}%`,
            top: "-10%",
            height: "20px",
            background: `linear-gradient(to bottom, transparent, rgba(140, 170, 210, ${drop.opacity}))`,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-500/30 via-slate-400/18 to-slate-500/35" />
    </div>
  );
}

export default function WeatherBackground({ weather }: WeatherBackgroundProps) {
  const category = getWeatherCategory(weather);

  return (
    <div className="fixed inset-0 -z-10">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,25%,8%)] via-[hsl(220,25%,10%)] to-[hsl(220,20%,14%)]" />

      {/* Weather-specific effects */}
      {category === "rain" && <RainEffect />}
      {category === "snow" && <SnowEffect />}
      {category === "clear" && <SunnyEffect />}
      {category === "clouds" && <CloudyEffect />}
      {category === "storm" && <StormEffect />}
    </div>
  );
}
