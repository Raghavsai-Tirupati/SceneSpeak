"use client";

import { AppState, SessionEntry } from "@/lib/types";

interface StatusIndicatorProps {
  state: AppState;
  isListening: boolean;
  responseText: string | null;
  sessionHistory: SessionEntry[];
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function StatusPill({
  label,
  color,
  animate,
}: {
  label: string;
  color: string;
  animate?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-full px-3.5 py-1.5">
      <span
        className={`w-2 h-2 rounded-full ${color}`}
        style={animate ? { animation: "breathe 2s ease-in-out infinite" } : undefined}
      />
      <span className="text-white/70 text-xs font-medium">{label}</span>
    </div>
  );
}

export default function StatusIndicator({
  state,
  isListening,
  responseText,
  sessionHistory,
}: StatusIndicatorProps) {
  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none flex flex-col"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* ── Top bar ─────────────────────────────────────── */}
      <div className="flex justify-between items-center px-5 pt-14">
        <span className="text-white/50 text-xs font-medium">SceneSpeak</span>

        {isListening && (
          <StatusPill label="Listening" color="bg-red-400" animate />
        )}
        {state === "thinking" && (
          <StatusPill label="Analyzing" color="bg-amber-400" animate />
        )}
        {state === "speaking" && (
          <StatusPill label="Speaking" color="bg-emerald-400" />
        )}
        {state === "idle" && (
          <StatusPill label="Ready" color="bg-white/40" />
        )}
      </div>

      {/* ── Center prompt ───────────────────────────────── */}
      {state === "idle" && (
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/[0.07] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
            <p className="text-white/30 text-sm text-center leading-relaxed">
              Tap anywhere to ask a question
            </p>
          </div>
        </div>
      )}

      {isListening && (
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center"
              style={{ animation: "breathe 2s ease-in-out infinite" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
            <p className="text-white/50 text-sm">Listening...</p>
            <p className="text-white/25 text-xs">Tap again when done</p>
          </div>
        </div>
      )}

      {state === "thinking" && (
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-14 h-14 rounded-full bg-amber-500/15 flex items-center justify-center"
              style={{ animation: "breathe 1.5s ease-in-out infinite" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                <circle cx="12" cy="12" r="3" />
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              </svg>
            </div>
            <p className="text-white/50 text-sm">Analyzing scene...</p>
          </div>
        </div>
      )}

      {state === "speaking" && <div className="flex-1" />}

      {/* ── Response panel ──────────────────────────────── */}
      {state === "speaking" && responseText && (
        <div className="px-5 pb-4">
          <div className="rounded-2xl bg-black/60 backdrop-blur-md border border-white/[0.08] p-5 max-w-lg mx-auto">
            <p className="text-white/80 text-[15px] leading-relaxed">
              {responseText}
            </p>
          </div>
        </div>
      )}

      {/* ── Session history ─────────────────────────────── */}
      {sessionHistory.length > 0 && state !== "speaking" && (
        <div className="px-5 pb-8">
          <div className="rounded-2xl bg-black/40 backdrop-blur-md border border-white/[0.06] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/40 text-xs font-medium">
                Session history
              </span>
              <span className="text-white/25 text-xs">
                {sessionHistory.length}{" "}
                {sessionHistory.length === 1 ? "scene" : "scenes"}
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pointer-events-auto">
              {sessionHistory.map((entry) => (
                <div key={entry.id} className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10">
                    <img
                      src={`data:image/jpeg;base64,${entry.thumbnail}`}
                      alt={entry.question}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-white/25 text-[10px] mt-1.5 w-16 truncate text-center">
                    {formatTime(entry.timestamp)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {sessionHistory.length === 0 && state !== "speaking" && (
        <div className="pb-10" />
      )}
    </div>
  );
}
