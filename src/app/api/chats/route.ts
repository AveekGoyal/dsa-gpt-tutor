import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { ObjectId } from 'mongodb';

// Get all chats for a user
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const chats = client.db().collection('chats');
    
    const userChats = await chats
      .find({ userEmail: session.user.email })
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json(userChats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
}

// Create a new chat
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title } = await req.json();
    const client = await clientPromise;
    const chats = client.db().collection('chats');

    const newChat = {
      userEmail: session.user.email,
      title: title || 'New Discussion',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await chats.insertOne(newChat);
    return NextResponse.json({ ...newChat, _id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create chat' }, { status: 500 });
  }
}