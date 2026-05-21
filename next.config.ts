import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
  outputFileTracingIncludes: {
    '/api/certificates/[id]/download': [
      'node_modules/@sparticuz/chromium/bin/**',
    ],
    '/api/certificates/batch-download': [
      'node_modules/@sparticuz/chromium/bin/**',
    ],
  },
};

export default nextConfig;
