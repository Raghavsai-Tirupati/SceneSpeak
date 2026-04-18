"use client";

import { AppState } from "@/lib/types";

interface StatusIndicatorProps {
  state: AppState;
  isListening: boolean;
  responseText: string | null;
}

const stateLabels: Record<AppState, string> = {
  idle: "Tap anywhere to ask",
  listening: "Listening — tap to send",
  thinking: "Analyzing...",
  speaking: "Speaking...",
};

export default function StatusIndicator({
  state,
  isListening,
  responseText,
}: StatusIndicatorProps) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-12 px-4 gap-4"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="bg-black/70 backdrop-blur-sm rounded-full px-6 py-3">
        <p className="text-white text-xl font-medium text-center">
          {stateLabels[state]}
        </p>
      </div>

      {/* Pulsing red dot while recording */}
      {isListening && (
        <div className="relative flex items-center justify-center">
          <span className="absolute w-6 h-6 rounded-full bg-red-500/50 animate-ping" />
          <span className="relative w-4 h-4 rounded-full bg-red-500" />
        </div>
      )}

      {/* AI response text shown while speaking */}
      {state === "speaking" && responseText && (
        <div className="bg-black/70 backdrop-blur-sm rounded-2xl px-5 py-4 mx-4 max-w-md">
          <p className="text-white text-base leading-relaxed text-center">
            {responseText}
          </p>
        </div>
      )}
    </div>
  );
}
