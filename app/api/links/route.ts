import { addLinkBody } from '@/components/types';
import { prisma } from '@/db/db';
import { NextRequest, NextResponse } from 'next/server';
import { Status } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { success, data } = addLinkBody.safeParse(body);

    if (!success)
      return NextResponse.json({ message: 'invalid input' }, { status: 400 });

    const { title, link, userId } = data;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user)
      return NextResponse.json({ message: 'user not found' }, { status: 404 });

    const linkAdded = await prisma.links.create({
      data: {
        title,
        link,
        status: Status.active,
        userId,
      },
      include: {
        user: true,
      },
    });

    const allLinks = await prisma.links.findMany({ where: { userId } });

    return NextResponse.json(
      {
        message: 'Link added successfully',
        user: { username: linkAdded.user.username, id: linkAdded.user.id },
        links: allLinks,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { message: 'something went wrong' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get('userId'));

    if (!userId) {
      return NextResponse.json({ message: 'invalid input' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ message: 'user not found' }, { status: 404 });
    }

    const links = await prisma.links.findMany({
      where: { userId },
    });

    return NextResponse.json(
      { message: 'links found', links, username: existingUser.username },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: 'something went wrong' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const linkId = Number(searchParams.get('linkId'));
    const userId = Number(searchParams.get('userId'));

    if (!linkId || !userId) {
      return NextResponse.json({ message: 'invalid input' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ message: 'user not found' }, { status: 404 });
    }

    await prisma.links.delete({ where: { id: linkId } });

    const links = await prisma.links.findMany({
      where: { userId },
    });

    return NextResponse.json(
      { message: 'link deleted successfully', links },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'something went wrong' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const linkId = Number(searchParams.get('linkId'));
    const userId = Number(searchParams.get('userId'));

    if (!linkId || !userId) {
      return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const link = await prisma.links.findUnique({
      where: { id: linkId },
    });

    if (!link) {
      return NextResponse.json({ message: 'Link not found' }, { status: 404 });
    }

    const newStatus =
      link.status === Status.active ? Status.inactive : Status.active;

    await prisma.links.update({
      where: { id: linkId },
      data: {
        status: newStatus,
      },
    });

    const links = await prisma.links.findMany({
      where: { userId },
    });

    return NextResponse.json(
      { message: 'Link updated successfully', links },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
