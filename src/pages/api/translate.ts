import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { text, targetLang } = req.body;

  try {
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
    res.status(200).json({ translation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ translation: "" });
  }
}
