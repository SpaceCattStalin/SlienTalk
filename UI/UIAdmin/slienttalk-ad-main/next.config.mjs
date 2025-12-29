/** @type {import('next').NextConfig} */
const config = {
  // Cái này bạn đã dùng và vẫn còn hợp lệ
  devIndicators: false,

  // Hai cái này KHÔNG deprecated — hợp lệ 100%
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  }
};

export default config;
