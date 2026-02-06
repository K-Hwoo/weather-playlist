"use client";

import { useMemo } from "react";

interface CharacterOutfitProps {
  temp: number;
  weather: string;
}

type OutfitSet = {
  top: string;
  topColor: string;
  bottom: string;
  bottomColor: string;
  accessory?: string;
  label: string;
};

function getOutfit(temp: number, weather: string): OutfitSet {
  const w = weather.toLowerCase();

  if (w.includes("rain") || w.includes("drizzle")) {
    if (temp < 10) {
      return { top: "raincoat", topColor: "#4A7C8F", bottom: "pants", bottomColor: "#3D4F5F", accessory: "umbrella", label: "Raincoat + Umbrella" };
    }
    return { top: "windbreaker", topColor: "#5B8FA8", bottom: "pants", bottomColor: "#4A6670", accessory: "umbrella", label: "Windbreaker + Umbrella" };
  }

  if (w.includes("snow")) {
    return { top: "padding", topColor: "#2C3E6B", bottom: "pants", bottomColor: "#1E2A4A", accessory: "scarf", label: "Padding + Scarf" };
  }

  if (temp >= 28) {
    return { top: "tshirt", topColor: "#E8A87C", bottom: "shorts", bottomColor: "#85C1E9", label: "T-Shirt + Shorts" };
  }
  if (temp >= 23) {
    return { top: "tshirt", topColor: "#82C4B5", bottom: "pants", bottomColor: "#5B7B8A", label: "T-Shirt + Pants" };
  }
  if (temp >= 17) {
    return { top: "longsleeve", topColor: "#7BA0B5", bottom: "pants", bottomColor: "#5A6B7A", label: "Long Sleeve + Pants" };
  }
  if (temp >= 12) {
    return { top: "hoodie", topColor: "#6A8CAF", bottom: "pants", bottomColor: "#4A5E72", label: "Hoodie + Pants" };
  }
  if (temp >= 5) {
    return { top: "coat", topColor: "#4A5D6B", bottom: "pants", bottomColor: "#3A4A55", accessory: "scarf", label: "Coat + Scarf" };
  }
  return { top: "padding", topColor: "#2C3E6B", bottom: "pants", bottomColor: "#1E2A4A", accessory: "scarf", label: "Padding + Scarf" };
}

function CharacterSVG({ outfit }: { outfit: OutfitSet }) {
  return (
    <svg viewBox="0 0 120 280" className="w-full h-full" aria-label={`Character wearing ${outfit.label}`}>
      {/* Hair - long straight with two strands */}
      <path d="M25 35 Q25 15 60 12 Q95 15 95 35 L95 75 Q60 78 25 75Z" fill="#6B5B4F" />
      {/* Left hair strand */}
      <path d="M22 45 Q18 85 20 130 Q22 160 25 180" stroke="#6B5B4F" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* Right hair strand */}
      <path d="M98 45 Q102 85 100 130 Q98 160 95 180" stroke="#6B5B4F" strokeWidth="6" fill="none" strokeLinecap="round" />
      
      {/* Head */}
      <ellipse cx="60" cy="45" rx="32" ry="35" fill="#F5DEB3" />
      
      {/* Eyes - large anime style */}
      <ellipse cx="48" cy="38" rx="6" ry="9" fill="#4A90E2" opacity="0.8" />
      <ellipse cx="72" cy="38" rx="6" ry="9" fill="#4A90E2" opacity="0.8" />
      {/* Eye shine */}
      <circle cx="49" cy="35" r="2.5" fill="#FFFFFF" />
      <circle cx="73" cy="35" r="2.5" fill="#FFFFFF" />
      <circle cx="48" cy="39" r="1" fill="#FFFFFF" opacity="0.6" />
      <circle cx="72" cy="39" r="1" fill="#FFFFFF" opacity="0.6" />
      
      {/* Eyebrows - soft curves */}
      <path d="M42 28 Q48 26 54 28" fill="none" stroke="#5D4E3C" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M66 28 Q72 26 78 28" fill="none" stroke="#5D4E3C" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Nose - small */}
      <line x1="60" y1="38" x2="60" y2="45" stroke="#E8C5A0" strokeWidth="1" />
      
      {/* Mouth - cute smile */}
      <path d="M52 52 Q60 56 68 52" fill="none" stroke="#D69A9A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M52 52 Q60 54 68 52" fill="#F0B0B0" opacity="0.4" />
      
      {/* Blush */}
      <ellipse cx="38" cy="48" rx="5" ry="4" fill="#F5B6C1" opacity="0.5" />
      <ellipse cx="82" cy="48" rx="5" ry="4" fill="#F5B6C1" opacity="0.5" />
      
      {/* Neck */}
      <rect x="54" y="78" width="12" height="10" fill="#F5DEB3" rx="2" />
      
      {/* Torso/Chest for female shape */}
      <ellipse cx="60" cy="110" rx="28" ry="32" fill="#F5DEB3" />

      {/* Top - T-Shirt */}
      {outfit.top === "tshirt" && (
        <g>
          <path d="M35 88 L25 110 L40 115 L40 160 L80 160 L80 115 L95 110 L85 88 Q60 95 60 95 Q60 95 35 88Z" fill={outfit.topColor} />
          <ellipse cx="35" cy="105" rx="8" ry="12" fill="#F5DEB3" />
          <ellipse cx="85" cy="105" rx="8" ry="12" fill="#F5DEB3" />
        </g>
      )}

      {/* Top - Long Sleeve */}
      {outfit.top === "longsleeve" && (
        <g>
          <path d="M30 88 L18 115 L35 120 L40 105 L40 160 L80 160 L80 105 L85 120 L102 115 L90 88 Q60 95 60 95 Q60 95 30 88Z" fill={outfit.topColor} />
          <rect x="18" y="112" width="10" height="32" rx="4" fill={outfit.topColor} />
          <rect x="92" y="112" width="10" height="32" rx="4" fill={outfit.topColor} />
          <ellipse cx="20" cy="140" rx="5" ry="8" fill="#F5DEB3" />
          <ellipse cx="100" cy="140" rx="5" ry="8" fill="#F5DEB3" />
        </g>
      )}

      {/* Top - Hoodie */}
      {outfit.top === "hoodie" && (
        <g>
          {/* Hood */}
          <path d="M45 75 Q45 60 60 58 Q75 60 75 75" fill={outfit.topColor} opacity="0.8" />
          <path d="M48 75 Q48 65 60 63 Q72 65 72 75" fill={outfit.topColor} />
          <path d="M32 88 L22 115 L38 120 L40 105 L40 165 L80 165 L80 105 L82 120 L98 115 L88 88 Q60 95 60 95 Q60 95 32 88Z" fill={outfit.topColor} />
          <rect x="22" y="112" width="10" height="38" rx="4" fill={outfit.topColor} opacity="0.9" />
          <rect x="88" y="112" width="10" height="38" rx="4" fill={outfit.topColor} opacity="0.9" />
          <ellipse cx="24" cy="140" rx="5" ry="8" fill="#F5DEB3" />
          <ellipse cx="96" cy="140" rx="5" ry="8" fill="#F5DEB3" />
        </g>
      )}

      {/* Top - Windbreaker */}
      {outfit.top === "windbreaker" && (
        <g>
          <path d="M28 88 L16 118 L33 124 L38 105 L38 165 L82 165 L82 105 L87 124 L104 118 L92 88 Q60 95 60 95 Q60 95 28 88Z" fill={outfit.topColor} />
          <line x1="60" y1="92" x2="60" y2="165" stroke="#FFFFFF30" strokeWidth="1" />
          <rect x="16" y="115" width="10" height="36" rx="4" fill={outfit.topColor} opacity="0.85" />
          <rect x="94" y="115" width="10" height="36" rx="4" fill={outfit.topColor} opacity="0.85" />
          <ellipse cx="18" cy="143" rx="5" ry="8" fill="#F5DEB3" />
          <ellipse cx="102" cy="143" rx="5" ry="8" fill="#F5DEB3" />
        </g>
      )}

      {/* Top - Coat */}
      {outfit.top === "coat" && (
        <g>
          <path d="M25 88 L12 120 L30 126 L36 105 L36 175 L84 175 L84 105 L90 126 L108 120 L95 88 Q60 95 60 95 Q60 95 25 88Z" fill={outfit.topColor} />
          {/* Buttons */}
          <circle cx="58" cy="115" r="2" fill="#C0A080" opacity="0.8" />
          <circle cx="58" cy="135" r="2" fill="#C0A080" opacity="0.8" />
          <circle cx="58" cy="155" r="2" fill="#C0A080" opacity="0.8" />
          <rect x="12" y="118" width="10" height="42" rx="4" fill={outfit.topColor} opacity="0.9" />
          <rect x="98" y="118" width="10" height="42" rx="4" fill={outfit.topColor} opacity="0.9" />
          <ellipse cx="14" cy="148" rx="5" ry="8" fill="#F5DEB3" />
          <ellipse cx="106" cy="148" rx="5" ry="8" fill="#F5DEB3" />
        </g>
      )}

      {/* Top - Padding */}
      {outfit.top === "padding" && (
        <g>
          <path d="M24 86 L10 122 L28 128 L36 105 L36 178 L84 178 L84 105 L92 128 L110 122 L96 86 Q60 93 60 93 Q60 93 24 86Z" fill={outfit.topColor} />
          {/* Puffer segments */}
          <line x1="40" y1="105" x2="80" y2="105" stroke="#FFFFFF12" strokeWidth="1" />
          <line x1="40" y1="120" x2="80" y2="120" stroke="#FFFFFF12" strokeWidth="1" />
          <line x1="40" y1="135" x2="80" y2="135" stroke="#FFFFFF12" strokeWidth="1" />
          <line x1="40" y1="150" x2="80" y2="150" stroke="#FFFFFF12" strokeWidth="1" />
          <line x1="40" y1="165" x2="80" y2="165" stroke="#FFFFFF12" strokeWidth="1" />
          {/* Zipper */}
          <line x1="60" y1="90" x2="60" y2="178" stroke="#FFD700" strokeWidth="1.5" opacity="0.6" />
          <rect x="10" y="120" width="10" height="42" rx="4" fill={outfit.topColor} opacity="0.9" />
          <rect x="100" y="120" width="10" height="42" rx="4" fill={outfit.topColor} opacity="0.9" />
          <ellipse cx="12" cy="150" rx="5" ry="8" fill="#F5DEB3" />
          <ellipse cx="108" cy="150" rx="5" ry="8" fill="#F5DEB3" />
        </g>
      )}

      {/* Top - Raincoat */}
      {outfit.top === "raincoat" && (
        <g>
          {/* Hood */}
          <path d="M48 80 Q48 65 60 62 Q72 65 72 80" fill={outfit.topColor} opacity="0.7" />
          <path d="M24 88 L10 122 L28 128 L36 105 L36 178 L84 178 L84 105 L92 128 L110 122 L96 88 Q60 95 60 95 Q60 95 24 88Z" fill={outfit.topColor} />
          {/* Glossy effect */}
          <path d="M45 110 Q48 140 45 175" stroke="#FFFFFF20" strokeWidth="2" fill="none" />
          <rect x="10" y="120" width="10" height="42" rx="4" fill={outfit.topColor} opacity="0.9" />
          <rect x="100" y="120" width="10" height="42" rx="4" fill={outfit.topColor} opacity="0.9" />
          <ellipse cx="12" cy="150" rx="5" ry="8" fill="#F5DEB3" />
          <ellipse cx="108" cy="150" rx="5" ry="8" fill="#F5DEB3" />
        </g>
      )}

      {/* Arms */}
      <rect x="12" y="100" width="9" height="50" rx="4.5" fill="#F5DEB3" />
      <rect x="99" y="100" width="9" height="50" rx="4.5" fill="#F5DEB3" />

      {/* Bottom - Shorts */}
      {outfit.top === "tshirt" && outfit.bottom === "shorts" && (
        <g>
          <rect x="42" y="160" width="14" height="35" rx="2" fill={outfit.bottomColor} />
          <rect x="64" y="160" width="14" height="35" rx="2" fill={outfit.bottomColor} />
        </g>
      )}

      {/* Bottom - Pants */}
      {outfit.bottom === "pants" && (
        <g>
          <rect x="40" y="160" width="16" height="70" rx="2" fill={outfit.bottomColor} />
          <rect x="64" y="160" width="16" height="70" rx="2" fill={outfit.bottomColor} />
        </g>
      )}

      {/* Shoes */}
      <ellipse cx="48" cy="232" rx="8" ry="6" fill="#3D3D3D" />
      <ellipse cx="72" cy="232" rx="8" ry="6" fill="#3D3D3D" />

      {/* Scarf Accessory */}
      {outfit.accessory === "scarf" && (
        <g>
          <path d="M50 78 L45 90 Q42 100 44 115 L48 95 Q50 88 52 80" fill={outfit.accessory === "scarf" ? "#C0392B" : "none"} opacity="0.8" />
          <path d="M70 78 L75 90 Q78 100 76 115 L72 95 Q70 88 68 80" fill={outfit.accessory === "scarf" ? "#C0392B" : "none"} opacity="0.8" />
          <ellipse cx="60" cy="85" rx="18" ry="6" fill="#C0392B" opacity="0.6" />
        </g>
      )}

      {/* Umbrella Accessory */}
      {outfit.accessory === "umbrella" && (
        <g>
          {/* Handle */}
          <line x1="110" y1="30" x2="110" y2="120" stroke="#8B6914" strokeWidth="2" />
          {/* Umbrella top */}
          <path d="M75 35 Q92.5 10 110 35 Q127.5 10 145 35Z" fill="#E74C3C" opacity="0.85" />
          <path d="M75 35 Q92.5 20 110 35" fill="#C0392B" opacity="0.4" />
          <circle cx="110" cy="33" r="2" fill="#8B6914" />
          {/* Hook */}
          <path d="M110 120 Q110 128 105 128" fill="none" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

export default function CharacterOutfit({ temp, weather }: CharacterOutfitProps) {
  const outfit = useMemo(() => getOutfit(temp, weather), [temp, weather]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-64 md:w-44 md:h-72">
        <CharacterSVG outfit={outfit} />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{outfit.label}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {temp >= 28 && "Stay cool and comfortable"}
          {temp >= 23 && temp < 28 && "Perfect weather for light clothes"}
          {temp >= 17 && temp < 23 && "A light layer will keep you cozy"}
          {temp >= 12 && temp < 17 && "Layer up for the cool breeze"}
          {temp >= 5 && temp < 12 && "Bundle up against the chill"}
          {temp < 5 && "Stay warm, it's freezing out!"}
        </p>
      </div>
    </div>
  );
}
