import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get all cookies
    const allCookies = request.cookies.getAll();
    const authToken = request.cookies.get('auth-token')?.value;

    return NextResponse.json({
      success: true,
      allCookies: allCookies.map(cookie => ({ name: cookie.name, value: cookie.value })),
      authToken: authToken,
      hasAuthToken: !!authToken
    });

  } catch (error) {
    console.error('Test cookie error:', error);
    return NextResponse.json(
      { success: false, error: 'Test failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testValue } = body;

    const response = NextResponse.json({
      success: true,
      message: 'Test cookie set',
      testValue
    });

    // Set a test cookie
    response.cookies.set('test-cookie', testValue || 'test-value', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 // 1 hour
    });

    return response;

  } catch (error) {
    console.error('Test cookie POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Test failed' },
      { status: 500 }
    );
  }
} 