import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ uuid: user.uuid });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}