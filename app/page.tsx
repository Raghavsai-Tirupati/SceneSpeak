"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import CameraFeed, { CameraFeedHandle } from "@/components/CameraFeed";
import VoiceInput from "@/components/VoiceInput";
import StatusIndicator from "@/components/StatusIndicator";
import { AppState, Message } from "@/lib/types";

// Tiny silent WAV to unlock Safari audio playback on user gesture
const SILENT_WAV =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";

function playChime(freq: number) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    gain.gain.value = 0.15;
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // Non-critical
  }
}

export default function Home() {
  const cameraRef = useRef<CameraFeedHandle>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const frameRef = useRef<string | null>(null);
  const frameTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [appState, setAppState] = useState<AppState>("idle");
  const [history, setHistory] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [responseText, setResponseText] = useState<string | null>(null);

  // Welcome message on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      const u = new SpeechSynthesisUtterance(
        "Welcome to SceneSpeak. Tap anywhere to ask a question."
      );
      window.speechSynthesis.speak(u);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Unfreeze camera whenever we return to idle
  useEffect(() => {
    if (appState === "idle") {
      cameraRef.current?.unfreeze();
      setResponseText(null);
    }
  }, [appState]);

  // Play audio blob or fall back to browser speech synthesis
  const playAudio = useCallback((blob: Blob | null, text: string | null) => {
    const audio = audioRef.current;

    const fallbackToSpeech = (t: string | null) => {
      if (t) {
        const u = new SpeechSynthesisUtterance(t);
        u.onend = () => setAppState("idle");
        u.onerror = () => setAppState("idle");
        window.speechSynthesis.speak(u);
      } else {
        setAppState("idle");
      }
    };

    if (blob && audio) {
      const url = URL.createObjectURL(blob);
      audio.src = url;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setAppState("idle");
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        fallbackToSpeech(text);
      };
      audio.play().catch(() => fallbackToSpeech(text));
    } else {
      fallbackToSpeech(text);
    }
  }, []);

  // Called by VoiceInput when user stops recording
  const handleTranscript = useCallback(
    async (transcript: string) => {
      if (!transcript) {
        setAppState("idle");
        return;
      }

      setAppState("thinking");

      const imageBase64 = frameRef.current;
      if (!imageBase64) {
        setAppState("speaking");
        setResponseText("I couldn't capture an image. Please try again.");
        playAudio(null, "I couldn't capture an image. Please try again.");
        return;
      }

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
          const blob = await response.blob();
          const text = decodeURIComponent(
            response.headers.get("X-Response-Text") || ""
          );
          setHistory([...newHistory, { role: "assistant", content: text }]);
          setResponseText(text || null);
          setAppState("speaking");
          playAudio(blob, text || null);
        } else {
          const data = await response.json();
          if (data.error) throw new Error(data.error);
          setHistory([
            ...newHistory,
            { role: "assistant", content: data.text },
          ]);
          setResponseText(data.text);
          setAppState("speaking");
          playAudio(null, data.text);
        }
      } catch (error) {
        console.error("Request failed:", error);
        const errMsg = "Sorry, something went wrong. Please try again.";
        setResponseText(errMsg);
        setAppState("speaking");
        playAudio(null, errMsg);
      }
    },
    [history, playAudio]
  );

  // Full-screen tap handler
  const handleScreenTap = useCallback(() => {
    // Unlock <audio> element on every tap (Safari requires user gesture)
    const audio = audioRef.current;
    if (audio) {
      audio.src = SILENT_WAV;
      audio.play().then(() => audio.pause()).catch(() => {});
    }
    // Unlock SpeechSynthesis too
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));

    const isBusy = appState === "thinking" || appState === "speaking";
    if (isBusy) return;

    if (isListening) {
      // === STOP LISTENING ===
      playChime(440);
      setIsListening(false);
      if (frameTimeoutRef.current) clearTimeout(frameTimeoutRef.current);
    } else {
      // === START LISTENING ===
      playChime(1200);
      setIsListening(true);
      setAppState("listening");
      // Capture photo 500ms after tap — freezes the camera with flash
      frameTimeoutRef.current = setTimeout(() => {
        frameRef.current = cameraRef.current?.captureAndFreeze() || null;
      }, 500);
    }
  }, [appState, isListening]);

  return (
    <main className="fixed inset-0 bg-[#111]">
      {/* Camera feed (live or frozen) */}
      <CameraFeed ref={cameraRef} />

      {/* Status indicator + response text */}
      <StatusIndicator
        state={appState}
        isListening={isListening}
        responseText={responseText}
      />

      {/* Pre-unlocked audio element for playback */}
      <audio ref={audioRef} className="hidden" playsInline />

      {/* Speech recognition controller */}
      <VoiceInput onTranscript={handleTranscript} isListening={isListening} />

      {/* Full-screen tap target */}
      <div
        className="fixed inset-0 z-40"
        onClick={handleScreenTap}
        onTouchStart={(e) => {
          e.preventDefault();
          handleScreenTap();
        }}
        role="button"
        tabIndex={0}
        aria-label={
          isListening
            ? "Tap to stop recording and send your question"
            : appState === "thinking"
              ? "Analyzing your question"
              : appState === "speaking"
                ? "Playing response"
                : "Tap anywhere to start speaking your question"
        }
      />
    </main>
  );
}
