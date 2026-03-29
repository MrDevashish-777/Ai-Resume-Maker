import { NextResponse } from 'next/server';
import { generateResume } from '@/lib/ai';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profile, userId } = body;
    if (!profile) {
      return NextResponse.json({ error: 'Missing profile in request body' }, { status: 400 });
    }

    const result = await generateResume(profile);

    // Save to database if userId provided
    if (userId) {
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: userId,
          content: result,
        })
        .select()
        .single();

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
