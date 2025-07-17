import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/config/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  await connectDB();

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
  }

  const user = await User.findOne({ email });

  if (!user || user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Admin not found' }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, name: user.name, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const res = NextResponse.json({
    success: true,
    user: {
      email: user.email,
      name: user.name,
      role: 'admin',
    },
  });

  // ✅ Set admin cookie
  res.headers.set(
    'Set-Cookie',
    `admin-token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Strict`
  );

  return res;
}
