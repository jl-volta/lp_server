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
    const rootUrl = new URL(validatedData.url);
    const rootDomain = rootUrl.origin;

    // Fetch HTML content
    const response = await fetch(validatedData.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();

    // Extract links using regex
    const linkRegex = /<a[^>]+href="([^"]+)"/g;
    const links = new Set<string>();
    let match;

    while ((match = linkRegex.exec(html)) !== null) {
      try {
        const href = match[1];
        const absoluteUrl = new URL(href, rootDomain).href;

        // Include only internal links
        if (absoluteUrl.startsWith(rootDomain)) {
          links.add(absoluteUrl);
        }
      } catch (e) {
        // Skip invalid URLs
        continue;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        url: validatedData.url,
        internalLinks: Array.from(links),
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