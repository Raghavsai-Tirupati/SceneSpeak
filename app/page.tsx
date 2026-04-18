"use client";

import { useRef, useState, useCallback } from "react";
import CameraFeed, { CameraFeedHandle } from "@/components/CameraFeed";
import VoiceInput from "@/components/VoiceInput";
import AudioPlayer from "@/components/AudioPlayer";
import StatusIndicator from "@/components/StatusIndicator";
import { AppState, Message } from "@/lib/types";

export default function Home() {
  const cameraRef = useRef<CameraFeedHandle>(null);
  const [appState, setAppState] = useState<AppState>("idle");
  const [history, setHistory] = useState<Message[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [fallbackText, setFallbackText] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const playChime = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.1;
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Chime is non-critical
    }
  }, []);

  const handleTranscript = useCallback(
    async (transcript: string) => {
      playChime();
      setAppState("thinking");

      // Capture current frame
      const imageBase64 = cameraRef.current?.captureFrame();
      if (!imageBase64) {
        setAppState("idle");
        return;
      }

      // Add user message to history
      const newHistory: Message[] = [
        ...history,
        { role: "user", content: transcript },
      ];

      try {
        const response = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: imageBase64,
            transcript,
            history: newHistory.slice(-10),
          }),
        });

        const contentType = response.headers.get("content-type");

        if (contentType?.includes("audio/mpeg")) {
          // Got audio back from ElevenLabs
          const blob = await response.blob();
          const responseText = decodeURIComponent(
            response.headers.get("X-Response-Text") || ""
          );
          setHistory([
            ...newHistory,
            { role: "assistant", content: responseText },
          ]);
          setAudioBlob(blob);
          setFallbackText(responseText || null);
          setAppState("speaking");
          playChime();
        } else {
          // Fallback to browser TTS
          const data = await response.json();
          if (data.error) {
            throw new Error(data.error);
          }
          setHistory([
            ...newHistory,
            { role: "assistant", content: data.text },
          ]);
          setAudioBlob(null);
          setFallbackText(data.text);
          setAppState("speaking");
          playChime();
        }
      } catch (error) {
        console.error("Request failed:", error);
        setAudioBlob(null);
        setFallbackText("Sorry, something went wrong. Please try again.");
        setAppState("speaking");
      }
    },
    [history, playChime]
  );

  const handleAudioFinished = useCallback(() => {
    setAudioBlob(null);
    setFallbackText(null);
    setAppState("idle");
  }, []);

  const handleListeningChange = useCallback(
    (listening: boolean) => {
      setIsListening(listening);
      if (listening) {
        setAppState("listening");
        playChime();
      }
    },
    [playChime]
  );

  return (
    <main className="fixed inset-0 bg-[#111]">
      {/* Camera background */}
      <CameraFeed ref={cameraRef} />

      {/* Status indicator */}
      <StatusIndicator state={appState} />

      {/* Audio player */}
      <AudioPlayer
        audioBlob={audioBlob}
        fallbackText={appState === "speaking" ? fallbackText : null}
        onFinished={handleAudioFinished}
      />

      {/* Bottom controls */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pb-12 gap-4">
        <p className="text-white/60 text-sm" aria-hidden="true">
          {isListening ? "Release to send" : "Hold to speak"}
        </p>
        <VoiceInput
          onTranscript={handleTranscript}
          isDisabled={appState === "thinking" || appState === "speaking"}
          isListening={isListening}
          onListeningChange={handleListeningChange}
        />
      </div>
    </main>
  );
}
