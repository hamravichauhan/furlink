import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const role = url.searchParams.get('role') || 'admin';
  const target = url.searchParams.get('redirect') || '/admin';

  const cookieStore = await cookies();
  cookieStore.set('furlink_demo_user', role.toLowerCase(), {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  });

  redirect(target);
}
