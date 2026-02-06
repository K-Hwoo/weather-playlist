/**
 * Weather API 호출 함수
 * Supabase Edge Function을 통해 OpenWeatherMap API를 호출합니다.
 */

import type { OpenWeatherOneCallRequest, OpenWeatherOneCallResponse } from "./openweather-types";
import type { WeatherData, CurrentWeather, HourlyForecast } from "../weather-types";

/**
 * Supabase Edge Function URL
 * 프로덕션에서는 환경 변수로 관리하세요.
 */
const getSupabaseFunctionUrl = () => {
  // 환경 변수가 설정되어 있으면 사용, 없으면 기본 Supabase URL 사용
  if (process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL) {
    return process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL;
  }
  
  // 기본 Supabase Edge Function URL
  const defaultUrl = "https://mzcwepumnxylahkgcltt.supabase.co/functions/v1/forecast";
  
  if (typeof window === "undefined") {
    // 서버 사이드: 개발 환경에서는 Next.js API Route 사용
    return process.env.NODE_ENV === "production" ? defaultUrl : "/api/weather";
  }
  
  // 클라이언트 사이드: 프로덕션에서는 Supabase URL, 개발에서는 Next.js API Route
  return process.env.NODE_ENV === "production" ? defaultUrl : "/api/weather";
};

/**
 * OpenWeatherMap One Call API 3.0 호출
 * @param params API 요청 파라미터
 * @returns 날씨 데이터
 */
export async function fetchWeatherData(
  params: OpenWeatherOneCallRequest
): Promise<WeatherData> {
  const functionUrl = getSupabaseFunctionUrl();
  
  // URL 파라미터 구성
  const searchParams = new URLSearchParams({
    lat: params.lat.toString(),
    lon: params.lon.toString(),
  });
  
  if (params.exclude) {
    searchParams.append("exclude", params.exclude);
  }
  
  if (params.units) {
    searchParams.append("units", params.units);
  }
  
  if (params.lang) {
    searchParams.append("lang", params.lang);
  }

  const url = `${functionUrl}?${searchParams.toString()}`;
  
  // Supabase Edge Function 호출 시 필요한 헤더 구성
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  // Supabase Edge Function은 인증이 필요할 수 있습니다
  // 환경 변수에서 Supabase anon key를 가져옵니다 (필요한 경우)
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseAnonKey && url.includes("supabase.co")) {
    headers["apikey"] = supabaseAnonKey;
    headers["Authorization"] = `Bearer ${supabaseAnonKey}`;
  }
  
  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(`Weather API error: ${error.message || response.statusText}`);
  }

  const data: OpenWeatherOneCallResponse = await response.json();
  
  // OpenWeatherMap 응답을 앱 내부 타입으로 변환
  return transformWeatherData(data);
}

/**
 * OpenWeatherMap 응답을 앱 내부 타입으로 변환
 */
function transformWeatherData(data: OpenWeatherOneCallResponse): WeatherData {
  const current = data.current;
  const mainWeather = current.weather[0] || { main: "Clear", description: "clear sky", icon: "01d" };

  // 현재 날씨 데이터 변환
  const currentWeather: CurrentWeather = {
    temp: Math.round(current.temp),
    feels_like: Math.round(current.feels_like),
    humidity: current.humidity,
    wind_speed: current.wind_speed,
    weather: mainWeather.main,
    description: mainWeather.description,
    icon: mainWeather.icon,
    city: data.timezone.split("/").pop() || "Unknown", // timezone에서 도시명 추출
    pm25: 0, // PM2.5는 별도 API 필요 (Air Pollution API)
    pm10: 0, // PM10은 별도 API 필요 (Air Pollution API)
    temp_min: Math.round(data.daily?.[0]?.temp.min || current.temp),
    temp_max: Math.round(data.daily?.[0]?.temp.max || current.temp),
    timestamp: current.dt,
  };

  // 시간별 예보 변환 (최대 24시간)
  const hourlyForecast: HourlyForecast[] = (data.hourly || [])
    .slice(0, 24)
    .map((hour) => {
      const hourWeather = hour.weather[0] || { main: "Clear", description: "clear sky", icon: "01d" };
      return {
        time: hour.dt,
        temp: hour.temp,
        weather: hourWeather.main,
        icon: hourWeather.icon,
        description: hourWeather.description,
      };
    });

  return {
    current: currentWeather,
    hourly: hourlyForecast,
  };
}

/**
 * 날씨 데이터를 가져오는 fetcher 함수 (SWR용)
 */
export const weatherFetcher = (url: string): Promise<WeatherData> => {
  // URL에서 lat, lon 파라미터 추출
  const urlObj = new URL(url, typeof window !== "undefined" ? window.location.origin : "http://localhost");
  const lat = parseFloat(urlObj.searchParams.get("lat") || "0");
  const lon = parseFloat(urlObj.searchParams.get("lon") || "0");

  if (!lat || !lon) {
    throw new Error("Latitude and longitude are required");
  }

  return fetchWeatherData({
    lat,
    lon,
    units: "metric",
    lang: "en",
    exclude: "minutely,daily,alerts", // 현재 날씨와 시간별 예보만 필요
  });
};
