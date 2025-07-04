import Replicate from 'replicate';
import { NextResponse } from 'next/server';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: 'Replicate API token not set' },
      { status: 500 }
    );
  }

  const { prompt, image } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  if (!image) {
    return NextResponse.json({ error: 'Image is required' }, { status: 400 });
  }

  try {
    const output = await replicate.run(
      'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
      {
        input: {
          prompt,
          image,
        },
      }
    );

    return NextResponse.json(output);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error generating image' }, { status: 500 });
  }
}
