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

  const { prompt, imageUrl } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  if (!imageUrl) {
    return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
  }

  try {
    const output = await replicate.run(
      'black-forest-labs/flux-kontext-pro:6a5253a2b14421a9957279184d0b166034169625377f1e31d4d803387b99e743',
      {
        input: {
          prompt,
          input_image: imageUrl,
        },
      }
    );

    return NextResponse.json(output);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error generating image' }, { status: 500 });
  }
}
