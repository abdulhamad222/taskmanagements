import { NextResponse } from 'next/server';
import { connectDB } from '@/config/mongodb';
import Task from '@/models/Task';
import Notification from '@/models/Notification';

export async function GET() {
  try {
    await connectDB();
    const tasks = await Task.find().sort({ createdAt: -1 });
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { title, status, userId } = await req.json(); // userId = user's email

    if (!title || !userId) {
      return NextResponse.json({ error: 'Title and userId are required' }, { status: 400 });
    }

    await connectDB();

    const task = await Task.create({ title, status });

    // ✅ Create notification for the user who added the task
    await Notification.create({
      userId,
      type: 'task',
      message: `New task "${title}" uploaded.`,
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
