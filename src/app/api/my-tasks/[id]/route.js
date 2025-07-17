import { NextResponse } from 'next/server';
import Task from '@/models/Task';
import { connectDB } from '@/config/mongodb';

export async function DELETE(req, { params }) {
  await connectDB();
  await Task.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
