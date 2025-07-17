import { connectDB } from '@/config/mongodb';
import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export async function DELETE(req, { params }) {
  await connectDB();
  await Project.findByIdAndDelete(params.id);
  return Response.json({ success: true });
}
