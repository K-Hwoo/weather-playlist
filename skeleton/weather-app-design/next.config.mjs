/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
}

export default nextConfig
