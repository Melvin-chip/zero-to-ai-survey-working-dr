import { NextResponse } from 'next/server';
import { getUserByUuid } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  try {
    const user = await getUserByUuid(params.uuid);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}