import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
 
export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
 
  if (!filename) {
    return NextResponse.json({ error: 'Filename is required.' }, { status: 400 });
  }

  if (!request.body) {
    return NextResponse.json({ error: 'No file to upload.' }, { status: 400 });
  }
 
  try {
    const blob = await put(filename, request.body, {
      access: 'public',
    });
    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Error uploading file.', message: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred during upload.' }, { status: 500 });
  }
}
