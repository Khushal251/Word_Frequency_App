import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {

    const response = await axios.get(url);
    const pageContent = response.data;

    const words = pageContent
      .replace(/<\/?[^>]+(>|$)/g, '') 
      .replace(/[^a-zA-Z\s]/g, '') 
      .toLowerCase()
      .split(/\s+/); 

    const wordCount: Record<string, number> = {};
    words.forEach((word) => {
      if (word) wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Sort and take the top 10 most frequent words
    const sortedWords = Object.entries(wordCount)
      .map(([word, frequency]) => ({ word, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    return NextResponse.json({ wordFrequencies: sortedWords });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch page content' }, { status: 500 });
  }
}
