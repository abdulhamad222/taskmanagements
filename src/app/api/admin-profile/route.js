import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  const cookie = req.headers.get('cookie') || '';
  const token = cookie.split('; ').find(row => row.startsWith('admin-token='))?.split('=')[1];

  if (!token) {
    return NextResponse.json({ success: false, error: 'No token' }, { status: 401 });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    if (user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ success: true, user });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
  }
}
