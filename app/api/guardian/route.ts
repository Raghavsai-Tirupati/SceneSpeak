import { NextRequest, NextResponse } from "next/server";
import { guardianScan } from "@/lib/gemini";
import { synthesizeSpeech } from "@/lib/tts";

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();
    if (!image) {
      return NextResponse.json({ error: "Missing image" }, { status: 400 });
    }

    const responseText = await guardianScan(image);

    if (responseText.trim() === "NOTHING_NEW") {
      return NextResponse.json({ status: "clear" });
    }

    try {
      const audioBuffer = await synthesizeSpeech(responseText);
      return new NextResponse(audioBuffer, {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "X-Response-Text": encodeURIComponent(responseText),
        },
      });
    } catch {
      return NextResponse.json({ text: responseText, fallback: true });
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Guardian API error:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
