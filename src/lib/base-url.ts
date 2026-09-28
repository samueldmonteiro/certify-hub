import 'server-only';
import { headers } from 'next/headers';

export async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') ?? (host?.startsWith('localhost') ? 'http' : 'https');

  return `${protocol}://${host}`;
}
