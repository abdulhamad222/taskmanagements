export const dynamic = 'force-dynamic';

import { connectDB } from "@/config/mongodb";
import User from "@/models/User";

export async function GET() {
  await connectDB();
  const users = await User.find({}, 'name email');
  return Response.json({ users });
}
