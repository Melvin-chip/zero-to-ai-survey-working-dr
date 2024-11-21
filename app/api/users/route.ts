import { NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/db';
import * as yup from 'yup';

const userSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  company: yup.string().required('Company is required'),
  role: yup.string().required('Role is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    try {
      await userSchema.validate(body);
    } catch (error) {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(body.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const uuid = await createUser(body);
    return NextResponse.json({ uuid }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}