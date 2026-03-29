import { NextResponse } from 'next/server';
import { detectWeaknesses } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { resumeText } = await request.json();
    if (!resumeText) {
      return NextResponse.json({ error: 'Missing resumeText' }, { status: 400 });
    }
    const result = await detectWeaknesses(resumeText);
    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
