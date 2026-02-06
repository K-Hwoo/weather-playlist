import { NextResponse } from "next/server";

function getSearchQuery(weather: string, temp: number): string {
  if (weather === "Rain" || weather === "Drizzle") {
    return "rainy day playlist lofi chill";
  }
  if (weather === "Snow") {
    return "snowy day cozy winter playlist";
  }
  if (weather === "Thunderstorm") {
    return "thunderstorm ambient music playlist";
  }
  if (weather === "Clear" && temp > 25) {
    return "sunny summer vibes playlist";
  }
  if (weather === "Clear") {
    return "sunny day happy playlist music";
  }
  if (weather === "Clouds" || weather === "Mist" || weather === "Fog" || weather === "Haze") {
    return "cloudy day chill playlist music";
  }
  return "chill relax playlist music";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const weather = searchParams.get("weather") || "Clear";
  const temp = Number(searchParams.get("temp") || "20");

  const apiKey = process.env.YOUTUBE_API_KEY;
  const query = getSearchQuery(weather, temp);

  if (!apiKey) {
    return NextResponse.json({
      items: getMockYoutubeData(),
      query,
    });
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=8&key=${apiKey}&videoCategoryId=10`
    );
    const data = await res.json();

    const items = (data.items || []).map((item: Record<string, unknown>) => {
      const snippet = item.snippet as Record<string, unknown>;
      const thumbnails = snippet.thumbnails as Record<string, unknown>;
      const medium = thumbnails.medium as Record<string, unknown>;
      const id = item.id as Record<string, unknown>;
      return {
        videoId: id.videoId,
        title: snippet.title,
        thumbnail: medium.url,
        channelTitle: snippet.channelTitle,
      };
    });

    return NextResponse.json({ items, query });
  } catch {
    return NextResponse.json({
      items: getMockYoutubeData(),
      query,
    });
  }
}

function getMockYoutubeData() {
  return Array.from({ length: 8 }, (_, i) => ({
    videoId: `mock-video-${i}`,
    title: `Weather Playlist ${i + 1} - Chill Vibes`,
    thumbnail: `https://picsum.photos/seed/yt${i}/320/180`,
    channelTitle: `Music Channel ${i + 1}`,
  }));
}
