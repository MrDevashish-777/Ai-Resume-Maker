import { NextResponse } from 'next/server';
import { analyzeATS } from '@/lib/ai';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const { resumeText, jobDescription, resumeId } = await request.json();
    if (!resumeText) {
      return NextResponse.json({ error: 'Missing resumeText' }, { status: 400 });
    }

    const result = await analyzeATS(resumeText, jobDescription);

    // Save analysis if resumeId provided
    if (resumeId) {
      const { error } = await supabase
        .from('analyses')
        .insert({
          resume_id: resumeId,
          ats_score: result.atsScore,
          missing_keywords: result.missingKeywords,
          suggestions: result.suggestions,
          job_description: jobDescription,
        });

      if (error) {
        console.error('Database error:', error);
      }
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
