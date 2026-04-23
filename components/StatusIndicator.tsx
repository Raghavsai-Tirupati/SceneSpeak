"use client";

import { AppState } from "@/lib/types";

interface StatusIndicatorProps {
  state: AppState;
  isListening: boolean;
  responseText: string | null;
  liveTranscript: string;
}

export default function StatusIndicator({
  state,
  isListening,
  responseText,
  liveTranscript,
}: StatusIndicatorProps) {
  const accent = "#4FC3F7";

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none flex flex-col"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* ── Top black bar ──────────────────────────────── */}
      <div className="bg-black px-5 pt-12 pb-3 flex items-center justify-between">
        {/* Left — branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img src="/iris-logo.png" alt="" width={22} height={22} style={{ opacity: 0.85 }} />
            <span className="text-white text-[20px] tracking-tight" style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}>
              Iris
            </span>
          </div>
        </div>

        {/* Right — status pill */}
        <div className="flex items-center gap-2">
          {isListening && (
            <div className="flex items-center gap-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-3 py-1.5">
              <span
                className="w-2 h-2 rounded-full bg-[#EF5350]"
                style={{ animation: "breathe 2s ease-in-out infinite" }}
              />
              <span className="text-[#E0E0E0] text-[11px] font-medium">Listening</span>
            </div>
          )}
          {state === "thinking" && (
            <div className="flex items-center gap-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-3 py-1.5">
              <span
                className="w-2 h-2 rounded-full bg-[#FFB74D]"
                style={{ animation: "breathe 1.5s ease-in-out infinite" }}
              />
              <span className="text-[#E0E0E0] text-[11px] font-medium">Analyzing</span>
            </div>
          )}
          {state === "speaking" && (
            <div className="flex items-center gap-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-3 py-1.5">
              <span
                className="w-2 h-2 rounded-full bg-[#66BB6A]"
                style={{ animation: "breathe 2s ease-in-out infinite" }}
              />
              <span className="text-[#E0E0E0] text-[11px] font-medium">Speaking</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Left/right black borders ───────────────────── */}
      <div className="flex-1 relative flex">
        <div className="w-3 bg-black" />
        <div className="flex-1" />
        <div className="w-3 bg-black" />
      </div>

      {/* ── Bottom black bar ───────────────────────────── */}
      <div className="bg-black px-5 pt-3 pb-6 flex flex-col gap-2.5">
        {/* Live transcription / the question you asked */}
        {liveTranscript && (
          <div
            className="rounded-2xl border border-[rgba(79,195,247,0.3)] bg-[rgba(79,195,247,0.08)] px-4 py-3 max-w-lg mx-auto w-full"
          >
            <p className="text-[#4FC3F7] text-[10px] font-bold tracking-[0.15em] mb-1">
              {isListening ? "LISTENING…" : "YOU ASKED"}
            </p>
            <p className="text-[#E0E0E0] text-[14px] leading-snug italic">
              {liveTranscript}
            </p>
          </div>
        )}

        {/* Iris's spoken response */}
        {responseText && (
          <div className="rounded-2xl bg-[#111] border border-[#222] px-4 py-3 max-w-lg mx-auto w-full">
            <p className="text-[#666] text-[10px] font-bold tracking-[0.15em] mb-1.5">
              IRIS SAID
            </p>
            <p className="text-[#E0E0E0] text-[14px] leading-relaxed">
              {responseText}
            </p>
          </div>
        )}

        {/* Bottom info row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: state === "idle" ? "#555" : accent,
                boxShadow: state !== "idle" ? `0 0 8px ${accent}40` : "none",
              }}
            />
            <span className="text-[#666] text-[11px]">
              {state === "idle"
                ? "Tap to describe"
                : state === "listening"
                  ? "Listening..."
                  : state === "thinking"
                    ? "Processing..."
                    : "Playing response"}
            </span>
          </div>
          <span className="text-[#333] text-[10px] uppercase tracking-widest">
            Live
          </span>
        </div>
      </div>
    </div>
  );
}
