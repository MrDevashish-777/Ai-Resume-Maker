import { NextResponse } from 'next/server';
import { simulateHiring } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { resumeText, jobDescription } = await request.json();
    if (!resumeText) {
      return NextResponse.json({ error: 'Missing resumeText' }, { status: 400 });
    }
    const result = await simulateHiring(resumeText, jobDescription);
    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
