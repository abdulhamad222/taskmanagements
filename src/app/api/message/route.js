import { connectDB } from '@/config/mongodb';
import Message from '@/models/Message';
import Notification from '@/models/Notification';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const withUser = url.searchParams.get('with');
    const currentUser = req.headers.get('userid');

    if (!currentUser || !withUser) {
      return NextResponse.json({ error: 'Missing user IDs' }, { status: 400 });
    }

    await connectDB();

    const messages = await Message.find({
      $or: [
        { senderId: currentUser, receiverId: withUser },
        { senderId: withUser, receiverId: currentUser },
      ],
    }).sort({ createdAt: 1 });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { to, message } = await req.json();
    const from = req.headers.get('userid');

    if (!from || !to || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing sender, receiver, or message' },
        { status: 400 }
      );
    }

    await connectDB();

    const newMsg = await Message.create({
      senderId: from,
      receiverId: to,
      content: message,
    });

    // ✅ Create notification for the receiver
    await Notification.create({
      userId: to,
      type: 'inbox',
      message: `New message received.`,
    });

    return NextResponse.json({ success: true, message: newMsg });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
