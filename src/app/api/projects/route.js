import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Notification from '@/models/Notification';

const MONGODB_URI = process.env.MONGODB_URI;

if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
  },
  { timestamps: true }
);

const Project =
  mongoose.models.Project || mongoose.model('Project', ProjectSchema);

// GET: Fetch all projects
export async function GET() {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST: Add new project and create notification
// POST: Add new project and create notification
export async function POST(req) {
  try {
    const { title, description, userId } = await req.json();

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    // ✅ Create a new project
    const newProject = await Project.create({
      title,
      description: description || '',
    });

    // ✅ Create notification (fallback for admin)
    await Notification.create({
      userId: userId || 'admin',
      type: 'project',
      message: `New project "${title}" created.`,
    });

    return NextResponse.json({ success: true, project: newProject });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
