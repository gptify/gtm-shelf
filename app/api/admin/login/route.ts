import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken, ADMIN_COOKIE_NAME, DEFAULT_ADMIN_PASSCODE } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode } = body;

    if (!passcode || passcode !== DEFAULT_ADMIN_PASSCODE) {
      return NextResponse.json(
        { error: 'Invalid admin passcode.' },
        { status: 401 }
      );
    }

    const token = createAdminToken('admin');
    const response = NextResponse.json({ success: true, role: 'admin' });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 86400 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Server error during authentication.' }, { status: 500 });
  }
}
