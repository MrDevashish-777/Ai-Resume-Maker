import { NextResponse } from 'next/server';
import { tailorResume } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { resumeText, jobDescription } = await request.json();
    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: 'Missing resumeText or jobDescription' }, { status: 400 });
    }
    const result = await tailorResume(resumeText, jobDescription);
    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
