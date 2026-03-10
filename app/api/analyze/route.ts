export const runtime = "nodejs";

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content
      .filter((block: any) => block.type === "text")
      .map((block: any) => block.text)
      .join("");

    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Route error:", err);
    return new Response(JSON.stringify({ text: "Analysis failed. Please try again." }), { status: 500 });
  }
}