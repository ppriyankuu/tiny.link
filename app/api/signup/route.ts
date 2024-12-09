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
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    const { username, password } = data;

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Username already taken' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: newUser.id, username }, secretKey);

    const response = NextResponse.json(
      {
        message: 'User Signup successful',
        user: { userId: newUser.id, username },
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
