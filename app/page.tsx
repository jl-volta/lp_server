import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Globe2, FileText, Link2 } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Web Scraper API
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Extract text and internal links from any webpage
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Extract Text API */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Extract Text</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Get all visible text content from a webpage
            </p>
            <div className="space-y-2">
              <Label htmlFor="text-url">Example Request:</Label>
              <code className="block bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm">
                GET /api/extract-text?url=https://example.com
              </code>
            </div>
          </div>

          {/* Internal URLs API */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Link2 className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-semibold">Internal URLs</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Extract all internal links from a webpage
            </p>
            <div className="space-y-2">
              <Label htmlFor="urls-url">Example Request:</Label>
              <code className="block bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm">
                GET /api/internal-urls?url=https://example.com
              </code>
            </div>
          </div>
        </div>

        {/* API Documentation */}
        <div className="mt-12 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Globe2 className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-semibold">API Documentation</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Response Format</h3>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
{`{
  "success": boolean,
  "data": {
    "url": string,
    "text": string | string[]
  }
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Error Response</h3>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
{`{
  "success": false,
  "error": string
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}