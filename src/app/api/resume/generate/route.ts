import { NextResponse } from 'next/server';
import { generateResume } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const profile = body.profile;
    if (!profile) {
      return NextResponse.json({ error: 'Missing profile in request body' }, { status: 400 });
    }
    const result = await generateResume(profile);
    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
