import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
  outputFileTracingIncludes: {
    '/api/certificates/[id]/download': [
      './node_modules/@sparticuz/chromium/**/*',
    ],
    '/api/certificates/batch-download': [
      './node_modules/@sparticuz/chromium/**/*',
    ],
  },
};

export default nextConfig;
