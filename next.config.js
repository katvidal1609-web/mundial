/** @type {import('next').NextConfig} */
const nextConfig = {
  // ISR revalidation handled per-page
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
