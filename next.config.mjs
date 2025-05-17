import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: false,
  experimental: {
    scrollRestoration: true,
  }
};

export default withNextIntl(nextConfig);
