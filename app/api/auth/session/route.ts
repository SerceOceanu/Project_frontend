import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('📝 POST /api/auth/session - Creating session');
    const { idToken } = await request.json();
    
    if (!idToken) {
      console.error('❌ No token provided');
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 400 }
      );
    }
    
    console.log('✅ Token received, setting cookie');
    const cookieStore = await cookies();
    
    cookieStore.set('session', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    
    console.log('✅ Session cookie set successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Session creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    
    if (!session) {
      return NextResponse.json({ authenticated: false });
    }
    
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}