import { prisma } from '@/db/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const allUsers = await prisma.user.findMany({});
    return NextResponse.json({ allUsers }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'something went wrong' },
      { status: 500 }
    );
  }
}
