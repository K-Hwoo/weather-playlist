import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat") || "37.5665";
  const lon = searchParams.get("lon") || "126.978";

  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!apiKey) {
    // Return mock data if no API key
    return NextResponse.json(getMockWeatherData());
  }

  try {
    // Current weather
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`
    );
    const currentData = await currentRes.json();

    // Forecast (5-day / 3-hour)
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`
    );
    const forecastData = await forecastRes.json();

    // Air quality
    const airRes = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    const airData = await airRes.json();

    const pm25 = airData?.list?.[0]?.components?.pm2_5 ?? 0;
    const pm10 = airData?.list?.[0]?.components?.pm10 ?? 0;

    // Get 24-hour forecast (8 entries x 3h = 24h)
    const hourlyForecast = forecastData.list.slice(0, 8).map((item: Record<string, unknown>) => ({
      time: item.dt,
      temp: (item.main as Record<string, unknown>).temp,
      weather: ((item.weather as Record<string, unknown>[])[0] as Record<string, unknown>).main,
      icon: ((item.weather as Record<string, unknown>[])[0] as Record<string, unknown>).icon,
      description: ((item.weather as Record<string, unknown>[])[0] as Record<string, unknown>).description,
    }));

    return NextResponse.json({
      current: {
        temp: Math.round(currentData.main.temp),
        feels_like: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        wind_speed: currentData.wind.speed,
        weather: currentData.weather[0].main,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        city: currentData.name,
        pm25,
        pm10,
        temp_min: Math.round(currentData.main.temp_min),
        temp_max: Math.round(currentData.main.temp_max),
        timestamp: Math.floor(Date.now() / 1000),
      },
      hourly: hourlyForecast,
    });
  } catch {
    return NextResponse.json(getMockWeatherData());
  }
}

function getMockWeatherData() {
  const now = Math.floor(Date.now() / 1000);
  return {
    current: {
      temp: 8,
      feels_like: 5,
      humidity: 55,
      wind_speed: 3.2,
      weather: "Clouds",
      description: "scattered clouds",
      icon: "03d",
      city: "Seoul",
      pm25: 25,
      pm10: 45,
      temp_min: 3,
      temp_max: 12,
      timestamp: now,
    },
    hourly: Array.from({ length: 8 }, (_, i) => ({
      time: now + i * 3600 * 3,
      temp: 5 + Math.round(Math.random() * 10),
      weather: ["Clear", "Clouds", "Rain", "Snow"][Math.floor(Math.random() * 4)],
      icon: ["01d", "03d", "10d", "13d"][Math.floor(Math.random() * 4)],
      description: "mock forecast",
    })),
  };
}
