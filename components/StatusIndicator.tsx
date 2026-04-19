"use client";

import { AppState, AppMode } from "@/lib/types";

interface StatusIndicatorProps {
  state: AppState;
  mode: AppMode;
  isListening: boolean;
  responseText: string | null;
  onSwitchMode?: () => void;
}

export default function StatusIndicator({
  state,
  mode,
  isListening,
  responseText,
  onSwitchMode,
}: StatusIndicatorProps) {
  const modeAccent = mode === "scene" ? "#4FC3F7" : "#81C784";

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none flex flex-col"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* ── Top bar — status + mode pill ───────────────── */}
      <div className="flex justify-end items-center px-5 pt-14 gap-2">
        {isListening && (
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full px-3 py-2">
            <span
              className="w-2 h-2 rounded-full bg-[#EF5350]"
              style={{ animation: "breathe 2s ease-in-out infinite" }}
            />
            <span className="text-[#E0E0E0] text-[12px] font-medium">Listening</span>
          </div>
        )}
        {state === "thinking" && (
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full px-3 py-2">
            <span
              className="w-2 h-2 rounded-full bg-[#FFB74D]"
              style={{ animation: "breathe 1.5s ease-in-out infinite" }}
            />
            <span className="text-[#E0E0E0] text-[12px] font-medium">Analyzing</span>
          </div>
        )}

        {/* Mode pill */}
        <button
          className="pointer-events-auto flex items-center justify-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full min-w-[44px] min-h-[44px] px-3.5 active:bg-white/10 transition-colors border border-[#333333]"
          onClick={(e) => {
            e.stopPropagation();
            onSwitchMode?.();
          }}
          aria-label={`Switch to ${mode === "scene" ? "Read" : "Scene"} mode`}
        >
          {mode === "scene" ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4FC3F7]">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#81C784]">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          )}
          <span style={{ color: modeAccent }} className="text-[12px] font-semibold">
            {mode === "scene" ? "Scene" : "Read"}
          </span>
        </button>
      </div>

      <div className="flex-1" />

      {/* ── Response panel ──────────────────────────────── */}
      {state === "speaking" && responseText && (
        <div className="px-5 pb-8">
          <div className="rounded-2xl bg-black/70 backdrop-blur-md border border-[#333333] p-5 max-w-lg mx-auto">
            <p className="text-[#E0E0E0] text-[15px] leading-relaxed">
              {responseText}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
