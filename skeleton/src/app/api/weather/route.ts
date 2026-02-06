/**
 * Next.js API Route: Weather API
 * 개발 환경에서 사용하는 프록시 API
 * 프로덕션에서는 Supabase Edge Function을 사용하세요.
 */

import { NextRequest, NextResponse } from "next/server";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_API_URL = "https://api.openweathermap.org/data/3.0/onecall";

export async function GET(request: NextRequest) {
  try {
    // API 키 확인
    if (!OPENWEATHER_API_KEY) {
      return NextResponse.json(
        { error: "OpenWeatherMap API key is not configured" },
        { status: 500 }
      );
    }

    // 요청 파라미터 추출
    const searchParams = request.nextUrl.searchParams;
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lon = parseFloat(searchParams.get("lon") || "0");

    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
      return NextResponse.json(
        { error: "Invalid latitude or longitude" },
        { status: 400 }
      );
    }

    // OpenWeatherMap API 요청 URL 구성
    const openWeatherUrl = new URL(OPENWEATHER_API_URL);
    openWeatherUrl.searchParams.append("lat", lat.toString());
    openWeatherUrl.searchParams.append("lon", lon.toString());
    openWeatherUrl.searchParams.append("appid", OPENWEATHER_API_KEY);

    // 선택적 파라미터 추가
    const exclude = searchParams.get("exclude");
    const units = searchParams.get("units") || "metric";
    const lang = searchParams.get("lang") || "en";

    if (exclude) {
      openWeatherUrl.searchParams.append("exclude", exclude);
    }
    openWeatherUrl.searchParams.append("units", units);
    openWeatherUrl.searchParams.append("lang", lang);

    // OpenWeatherMap API 호출
    const response = await fetch(openWeatherUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: 600, // 10분 캐시 (OpenWeatherMap 업데이트 주기와 동일)
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
      return NextResponse.json(
        {
          error: "OpenWeatherMap API error",
          message: errorData.message || response.statusText,
          code: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // CORS 헤더 추가 (필요한 경우)
    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// OPTIONS 요청 처리 (CORS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
