import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const urlSchema = z.object({
  url: z.string().url(),
});

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Validate URL
    const validatedData = urlSchema.parse({ url });

    // Fetch HTML content
    const response = await fetch(validatedData.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();

    // Remove script, style, and other non-content tags
    const cleanHtml = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#x27;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();

    // Filter out common unwanted patterns
    const filteredText = cleanHtml
      .split('\n')
      .map(line => line.trim())
      .filter(line => {
        // Filter out JSON objects
        if (line.startsWith('{') && line.endsWith('}')) return false;
        // Filter out obvious code or script content
        if (line.includes('window.') || line.includes('function(')) return false;
        // Filter out empty lines
        if (!line) return false;
        return true;
      })
      .join(' ');

    return NextResponse.json({
      success: true,
      data: {
        url: validatedData.url,
        text: filteredText,
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