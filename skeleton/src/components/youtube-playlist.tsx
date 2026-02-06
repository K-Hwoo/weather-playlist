"use client";

import { useState } from "react";
import { Music, X, ExternalLink } from "lucide-react";
import Image from "next/image";
import type { YoutubeVideo } from "@/lib/weather-types";

interface YoutubePlaylistProps {
  videos: YoutubeVideo[];
  query: string;
}

export default function YoutubePlaylist({ videos, query }: YoutubePlaylistProps) {
  const [selectedVideo, setSelectedVideo] = useState<YoutubeVideo | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-medium text-foreground">Weather Playlist</h2>
        </div>
        <span className="text-xs text-muted-foreground italic">
          {'"'}{query}{'"'}
        </span>
      </div>

      {/* Video thumbnails - horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {videos.map((video) => (
          <button
            key={video.videoId}
            onClick={() =>
              setSelectedVideo(
                selectedVideo?.videoId === video.videoId ? null : video
              )
            }
            className={`group flex flex-col gap-2 shrink-0 w-44 text-left transition-all duration-200 rounded-lg p-1.5 ${
              selectedVideo?.videoId === video.videoId
                ? "bg-primary/10 ring-1 ring-primary/30"
                : "hover:bg-secondary/40"
            }`}
          >
            <div className="relative w-full aspect-video rounded-md overflow-hidden">
              <Image
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="176px"
              />
              {selectedVideo?.videoId === video.videoId && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center">
                    <Music className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>
              )}
            </div>
            <div className="px-0.5">
              <p className="text-xs font-medium text-foreground line-clamp-2 leading-tight">
                {video.title}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {video.channelTitle}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Embedded player */}
      {selectedVideo && (
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-foreground font-medium line-clamp-1 flex-1 mr-2">
              {selectedVideo.title}
            </p>
            <div className="flex items-center gap-1">
              <a
                href={`https://www.youtube.com/watch?v=${selectedVideo.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded hover:bg-secondary/50 transition-colors"
                aria-label="Open in YouTube"
              >
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </a>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1 rounded hover:bg-secondary/50 transition-colors"
                aria-label="Close player"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border/50">
            {selectedVideo.videoId.startsWith("mock-") ? (
              <div className="absolute inset-0 bg-secondary/50 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Add YouTube API key to play videos
                </p>
              </div>
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
