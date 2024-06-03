import { inputBody } from '@/components/types';
import { prisma } from '@/db/db';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET ?? 'top_secret';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { success, data } = inputBody.safeParse(body);

    if (!success) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 401 });
    }

    const { username, password } = data;

    const existingUser = await prisma.user.findUnique({ where: { username } });

    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 });
    }

    const checkPassword = await bcrypt.compare(password, existingUser.password);

    if (!checkPassword) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign({ id: existingUser.id, username }, secretKey);

    const response = NextResponse.json(
      {
        message: 'Signin Successful',
        user: { userId: existingUser.id, username },
        token,
      },
      { status: 200 }
    );

    response.cookies.set('authToken', token, {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error('Error during user signup:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
