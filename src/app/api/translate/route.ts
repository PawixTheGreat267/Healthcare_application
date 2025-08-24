import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Translate the following text into ${targetLang}:\n\n${text}`,
        },
      ],
    });

    const translation = completion.choices[0].message?.content ?? "";
    return NextResponse.json({ translation });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ translation: "" }, { status: 500 });
  }
}