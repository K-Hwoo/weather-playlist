/**
 * OpenWeatherMap One Call API 3.0 타입 정의
 * 참고: https://openweathermap.org/api/one-call-3
 */

export interface OpenWeatherCurrent {
  dt: number; // Current time, Unix, UTC
  sunrise?: number; // Sunrise time, Unix, UTC
  sunset?: number; // Sunset time, Unix, UTC
  temp: number; // Temperature
  feels_like: number; // Temperature. This accounts for the human perception of weather
  pressure: number; // Atmospheric pressure on the sea level, hPa
  humidity: number; // Humidity, %
  dew_point: number; // Atmospheric temperature below which water droplets begin to condense
  uvi: number; // UV index
  clouds: number; // Cloudiness, %
  visibility: number; // Average visibility, metres
  wind_speed: number; // Wind speed
  wind_deg: number; // Wind direction, degrees
  wind_gust?: number; // Wind gust
  weather: Array<{
    id: number;
    main: string; // Group of weather parameters (Rain, Snow, Extreme, etc.)
    description: string; // Weather condition within the group
    icon: string; // Weather icon id
  }>;
  rain?: {
    "1h": number; // Rain volume for the last 1 hour, mm
  };
  snow?: {
    "1h": number; // Snow volume for the last 1 hour, mm
  };
}

export interface OpenWeatherHourly {
  dt: number; // Time of the forecasted data, Unix, UTC
  temp: number; // Temperature
  feels_like: number; // Temperature. This accounts for the human perception of weather
  pressure: number; // Atmospheric pressure on the sea level, hPa
  humidity: number; // Humidity, %
  dew_point: number; // Atmospheric temperature below which water droplets begin to condense
  uvi: number; // UV index
  clouds: number; // Cloudiness, %
  visibility: number; // Average visibility, metres
  wind_speed: number; // Wind speed
  wind_deg: number; // Wind direction, degrees
  wind_gust?: number; // Wind gust
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  pop: number; // Probability of precipitation
  rain?: {
    "1h": number;
  };
  snow?: {
    "1h": number;
  };
}

export interface OpenWeatherDailyTemp {
  day: number; // Day temperature
  min: number; // Min daily temperature
  max: number; // Max daily temperature
  night: number; // Night temperature
  eve: number; // Evening temperature
  morn: number; // Morning temperature
}

export interface OpenWeatherDaily {
  dt: number; // Time of the forecasted data, Unix, UTC
  sunrise?: number; // Sunrise time, Unix, UTC
  sunset?: number; // Sunset time, Unix, UTC
  moonrise?: number; // Moonrise time, Unix, UTC
  moonset?: number; // Moonset time, Unix, UTC
  moon_phase?: number; // Moon phase
  summary?: string; // Human-readable summary
  temp: OpenWeatherDailyTemp;
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number; // Atmospheric pressure on the sea level, hPa
  humidity: number; // Humidity, %
  dew_point: number; // Atmospheric temperature below which water droplets begin to condense
  wind_speed: number; // Wind speed
  wind_deg: number; // Wind direction, degrees
  wind_gust?: number; // Wind gust
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  clouds: number; // Cloudiness, %
  pop: number; // Probability of precipitation
  rain?: number; // Precipitation volume, mm
  snow?: number; // Snow volume, mm
  uvi: number; // UV index
}

export interface OpenWeatherAlert {
  sender_name: string; // Name of the alert source
  event: string; // Alert event name
  start: number; // Start time of the alert, Unix, UTC
  end: number; // End time of the alert, Unix, UTC
  description: string; // Description of the alert
  tags?: string[]; // Tags of the alert
}

export interface OpenWeatherOneCallResponse {
  lat: number; // Latitude of the location
  lon: number; // Longitude of the location
  timezone: string; // Timezone name for the requested location
  timezone_offset: number; // Shift in seconds from UTC
  current: OpenWeatherCurrent;
  minutely?: Array<{
    dt: number; // Time of the forecasted data, Unix, UTC
    precipitation: number; // Precipitation volume, mm
  }>;
  hourly?: OpenWeatherHourly[];
  daily?: OpenWeatherDaily[];
  alerts?: OpenWeatherAlert[];
}

export interface OpenWeatherOneCallRequest {
  lat: number; // Latitude, decimal (-90; 90)
  lon: number; // Longitude, decimal (-180; 180)
  exclude?: string; // Comma-delimited list (without spaces): current, minutely, hourly, daily, alerts
  units?: "standard" | "metric" | "imperial"; // Units of measurement
  lang?: string; // Language code (e.g., "en", "ko")
}
