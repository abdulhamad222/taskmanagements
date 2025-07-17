import { connectDB } from '@/config/mongodb';
import Notification from '@/models/Notification';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: 'No user ID' }, { status: 400 });

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { userId, type, message } = await req.json();

    if (!userId || !type || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newNotification = await Notification.create({
      userId,
      type,
      message,
    });

    return NextResponse.json({ success: true, notification: newNotification }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
