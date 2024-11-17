import { NextResponse } from 'next/server';
import { z } from 'zod';

const urlSchema = z.object({
  url: z.string().url(),
});

export async function GET(request: Request) {
  try {
    // Get URL from query parameters
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    // Validate URL
    const validatedData = urlSchema.parse({ url });

    // Fetch HTML content
    const response = await fetch(validatedData.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();

    // Extract visible text using regex
    const regex = />([^<]+)</g;
    let match;
    let text = '';
    while ((match = regex.exec(html)) !== null) {
      const extracted = match[1].trim();
      if (extracted) {
        text += extracted + ' ';
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        url: validatedData.url,
        text: text.trim(),
      },
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 400 }
    );
  }
}