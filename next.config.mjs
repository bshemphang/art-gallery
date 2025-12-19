/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pfeaolvtowihwbekdekf.supabase.co', // This should be your Supabase ID
        port: '',
        pathname: '/**',
      },
      // You can add 'placehold.co' back if you use it for testing
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;