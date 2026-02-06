export interface CurrentWeather {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  weather: string;
  description: string;
  icon: string;
  city: string;
  pm25: number;
  pm10: number;
  temp_min: number;
  temp_max: number;
  timestamp: number;
}

export interface HourlyForecast {
  time: number;
  temp: number;
  weather: string;
  icon: string;
  description: string;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
}

export interface YoutubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

export function getWeatherCategory(weather: string): "clear" | "clouds" | "rain" | "snow" | "storm" {
  const w = weather.toLowerCase();
  if (w.includes("thunder")) return "storm";
  if (w.includes("rain") || w.includes("drizzle")) return "rain";
  if (w.includes("snow")) return "snow";
  if (w.includes("cloud") || w.includes("mist") || w.includes("fog") || w.includes("haze")) return "clouds";
  return "clear";
}

export function getPmLevel(pm: number): { label: string; color: string } {
  if (pm <= 15) return { label: "Good", color: "text-emerald-400" };
  if (pm <= 35) return { label: "Moderate", color: "text-yellow-400" };
  if (pm <= 75) return { label: "Unhealthy", color: "text-orange-400" };
  return { label: "Very Unhealthy", color: "text-red-400" };
}
