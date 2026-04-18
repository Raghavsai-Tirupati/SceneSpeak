"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import CameraFeed, { CameraFeedHandle } from "@/components/CameraFeed";
import StatusIndicator from "@/components/StatusIndicator";
import { AppState, AppMode, Message, SessionEntry } from "@/lib/types";

const SILENT_WAV =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";

function speak(text: string, rate = 1.8): Promise<void> {
  return new Promise((resolve) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

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

// ─── Intro Screen ───────────────────────────────────────────────────────────

function IntroScreen({
  onSelectMode,
  dismissing,
}: {
  onSelectMode: (mode: AppMode) => void;
  dismissing: boolean;
}) {
  useEffect(() => {
    let cancelled = false;

    const doSpeak = () => {
      if (cancelled) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(
        "Welcome to SceneSpeak. Choose a mode to begin."
      );
      u.rate = 1.8;
      window.speechSynthesis.speak(u);
    };

    const timer = setTimeout(() => {
      if (window.speechSynthesis.getVoices().length > 0) {
        doSpeak();
      } else {
        window.speechSynthesis.addEventListener("voiceschanged", doSpeak, {
          once: true,
        });
      }
    }, 600);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.speechSynthesis.removeEventListener("voiceschanged", doSpeak);
      window.speechSynthesis.cancel();
    };
  }, []);

  const unlockAudio = () => {
    const a = document.createElement("audio");
    a.src = SILENT_WAV;
    a.play().then(() => a.pause()).catch(() => {});
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        background: "#111",
        animation: dismissing ? "fadeOut 0.4s ease-out forwards" : undefined,
      }}
    >
      {/* Top spacer */}
      <div className="flex-1 min-h-0" />

      {/* Logo area */}
      <div
        className="flex flex-col items-center px-8"
        style={{ animation: "fadeInUp 0.5s ease-out" }}
      >
        <h1 className="text-white text-[32px] font-semibold tracking-tight">
          SceneSpeak
        </h1>
        <p className="text-white/40 text-[15px] mt-2">
          Your AI-powered visual guide
        </p>
      </div>

      {/* Mode buttons */}
      <div
        className="flex flex-col gap-3 px-8 mt-12"
        style={{ animation: "fadeInUp 0.5s ease-out 0.1s both" }}
      >
        <button
          className="w-full rounded-2xl bg-white/[0.06] border border-white/[0.08] p-5 text-left active:bg-white/[0.1] transition-colors"
          onClick={() => {
            unlockAudio();
            onSelectMode("ask");
          }}
          aria-label="Ask Mode: Tap to ask questions about what the camera sees"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
            <div>
              <p className="text-white text-base font-medium">Ask Mode</p>
              <p className="text-white/35 text-sm mt-0.5">
                Tap to ask about what you see
              </p>
            </div>
          </div>
        </button>

        <button
          className="w-full rounded-2xl bg-white/[0.06] border border-white/[0.08] p-5 text-left active:bg-white/[0.1] transition-colors"
          onClick={() => {
            unlockAudio();
            onSelectMode("guardian");
          }}
          aria-label="Guardian Mode: Continuous obstacle and hazard detection"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400/80">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <p className="text-white text-base font-medium">Guardian Mode</p>
              <p className="text-white/35 text-sm mt-0.5">
                Continuous hazard detection
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1 min-h-0" />

      {/* Bottom info */}
      <div
        className="flex flex-col items-center pb-8"
        style={{ animation: "fadeInUp 0.5s ease-out 0.2s both" }}
      >
        <p className="text-white/20 text-[11px]">
          Hook &apos;Em Hacks 2026 &bull; UT Austin
        </p>
      </div>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────

export default function Home() {
  const cameraRef = useRef<CameraFeedHandle>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const frameRef = useRef<string | null>(null);
  const frameTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef("");
  const isListeningRef = useRef(false);
  const historyRef = useRef<Message[]>([]);
  const sessionIdRef = useRef(0);
  const lastTapRef = useRef(0);
  const guardianTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const guardianActiveRef = useRef(false);
  const guardianBusyRef = useRef(false);
  const modeRef = useRef<AppMode>("ask");

  const [screen, setScreen] = useState<"intro" | "dismissing" | "camera">("intro");
  const [mode, setMode] = useState<AppMode>("ask");
  const [appState, setAppState] = useState<AppState>("idle");
  const [isListening, setIsListening] = useState(false);
  const [responseText, setResponseText] = useState<string | null>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionEntry[]>([]);
  const [guardianActive, setGuardianActive] = useState(false);

  // Keep refs in sync
  useEffect(() => { isListeningRef.current = isListening; }, [isListening]);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { guardianActiveRef.current = guardianActive; }, [guardianActive]);

  // ── Speech recognition setup ──────────────────────────
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript + " ";
      }
      transcriptRef.current = text.trim();
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        try { recognition.start(); } catch { /* already running */ }
      }
    };

    recognition.onerror = () => {};
    recognitionRef.current = recognition;
  }, []);

  // ── Reset on idle ─────────────────────────────────────
  useEffect(() => {
    if (appState === "idle") {
      cameraRef.current?.unfreeze();
      setResponseText(null);
    }
  }, [appState]);

  // ── Guardian mode scan loop ───────────────────────────
  const guardianScan = useCallback(async () => {
    if (!guardianActiveRef.current || guardianBusyRef.current) return;

    const busy = isListeningRef.current;
    if (busy) {
      guardianTimerRef.current = setTimeout(guardianScan, 2000);
      return;
    }

    const frame = cameraRef.current?.capture();
    if (!frame) {
      guardianTimerRef.current = setTimeout(guardianScan, 4000);
      return;
    }

    guardianBusyRef.current = true;

    try {
      const response = await fetch("/api/guardian", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: frame }),
      });

      if (!guardianActiveRef.current) {
        guardianBusyRef.current = false;
        return;
      }

      const contentType = response.headers.get("content-type");

      if (contentType?.includes("audio/mpeg")) {
        const blob = await response.blob();
        const text = decodeURIComponent(
          response.headers.get("X-Response-Text") || ""
        );
        setResponseText(text || null);
        setAppState("speaking");

        const audio = audioRef.current;
        if (audio) {
          const url = URL.createObjectURL(blob);
          audio.src = url;
          audio.playbackRate = 1.4;
          audio.onended = () => {
            URL.revokeObjectURL(url);
            setAppState("idle");
            guardianBusyRef.current = false;
            if (guardianActiveRef.current) {
              guardianTimerRef.current = setTimeout(guardianScan, 4000);
            }
          };
          audio.onerror = () => {
            URL.revokeObjectURL(url);
            guardianBusyRef.current = false;
            // Fallback to browser TTS
            const u = new SpeechSynthesisUtterance(text);
            u.rate = 1.8;
            u.onend = () => {
              setAppState("idle");
              if (guardianActiveRef.current) {
                guardianTimerRef.current = setTimeout(guardianScan, 4000);
              }
            };
            setAppState("speaking");
            window.speechSynthesis.speak(u);
          };
          audio.play().catch(() => {
            guardianBusyRef.current = false;
            setAppState("idle");
            if (guardianActiveRef.current) {
              guardianTimerRef.current = setTimeout(guardianScan, 4000);
            }
          });
        }
      } else {
        const data = await response.json();
        guardianBusyRef.current = false;

        if (data.text) {
          setResponseText(data.text);
          setAppState("speaking");
          const u = new SpeechSynthesisUtterance(data.text);
          u.rate = 1.8;
          u.onend = () => {
            setAppState("idle");
            if (guardianActiveRef.current) {
              guardianTimerRef.current = setTimeout(guardianScan, 4000);
            }
          };
          u.onerror = () => {
            setAppState("idle");
            if (guardianActiveRef.current) {
              guardianTimerRef.current = setTimeout(guardianScan, 4000);
            }
          };
          window.speechSynthesis.speak(u);
        } else {
          if (guardianActiveRef.current) {
            guardianTimerRef.current = setTimeout(guardianScan, 4000);
          }
        }
      }
    } catch {
      guardianBusyRef.current = false;
      if (guardianActiveRef.current) {
        guardianTimerRef.current = setTimeout(guardianScan, 4000);
      }
    }
  }, []);

  const startGuardian = useCallback(() => {
    setGuardianActive(true);
    guardianActiveRef.current = true;
    guardianBusyRef.current = false;
    guardianTimerRef.current = setTimeout(guardianScan, 1000);
  }, [guardianScan]);

  const stopGuardian = useCallback(() => {
    setGuardianActive(false);
    guardianActiveRef.current = false;
    guardianBusyRef.current = false;
    if (guardianTimerRef.current) {
      clearTimeout(guardianTimerRef.current);
      guardianTimerRef.current = null;
    }
  }, []);

  // ── Mode selection from intro ─────────────────────────
  const handleSelectMode = useCallback(
    (selectedMode: AppMode) => {
      if (screen !== "intro") return;
      setMode(selectedMode);
      modeRef.current = selectedMode;
      window.speechSynthesis.cancel();

      if (selectedMode === "ask") {
        speak("Ask mode. Tap anywhere to ask a question about what you see.");
      } else {
        speak(
          "Guardian mode. I'll continuously watch for obstacles and important changes around you."
        );
      }

      setScreen("dismissing");
      setTimeout(() => {
        setScreen("camera");
        if (selectedMode === "guardian") {
          startGuardian();
        }
      }, 400);
    },
    [screen, startGuardian]
  );

  // ── Switch mode while in camera ───────────────────────
  const switchMode = useCallback(() => {
    window.speechSynthesis.cancel();
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.src = ""; }

    if (isListeningRef.current) {
      setIsListening(false);
      try { recognitionRef.current?.stop(); } catch { /* */ }
      transcriptRef.current = "";
    }
    setAppState("idle");

    if (modeRef.current === "ask") {
      setMode("guardian");
      modeRef.current = "guardian";
      speak("Guardian mode activated.");
      startGuardian();
    } else {
      stopGuardian();
      setMode("ask");
      modeRef.current = "ask";
      speak("Ask mode activated.");
    }
  }, [startGuardian, stopGuardian]);

  // ── Speak fallback ────────────────────────────────────
  const speakFallback = useCallback((text: string | null) => {
    if (text) {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.8;
      u.onend = () => {
        setAppState("idle");
        if (guardianActiveRef.current) {
          guardianTimerRef.current = setTimeout(guardianScan, 4000);
        }
      };
      u.onerror = () => {
        setAppState("idle");
        if (guardianActiveRef.current) {
          guardianTimerRef.current = setTimeout(guardianScan, 4000);
        }
      };
      window.speechSynthesis.speak(u);
    } else {
      setAppState("idle");
      if (guardianActiveRef.current) {
        guardianTimerRef.current = setTimeout(guardianScan, 4000);
      }
    }
  }, [guardianScan]);

  // ── Replay entry ──────────────────────────────────────
  const replayEntry = useCallback(
    (entry: SessionEntry) => {
      if (appState === "thinking" || appState === "speaking") return;
      window.speechSynthesis.cancel();
      setResponseText(entry.answer);
      setAppState("speaking");
      const u = new SpeechSynthesisUtterance(entry.answer);
      u.rate = 1.8;
      u.onend = () => setAppState("idle");
      u.onerror = () => setAppState("idle");
      window.speechSynthesis.speak(u);
    },
    [appState]
  );

  // ── Add session entry ─────────────────────────────────
  const addSessionEntry = useCallback(
    (thumbnail: string, question: string, answer: string) => {
      setSessionHistory((prev) => [
        ...prev,
        {
          id: ++sessionIdRef.current,
          thumbnail,
          question,
          answer,
          timestamp: Date.now(),
        },
      ]);
    },
    []
  );

  // ── Process ask request ───────────────────────────────
  const processRequest = useCallback(
    async (transcript: string) => {
      if (!transcript) {
        setAppState("idle");
        if (guardianActiveRef.current) {
          guardianTimerRef.current = setTimeout(guardianScan, 4000);
        }
        return;
      }

      // Pause guardian while processing
      if (guardianTimerRef.current) {
        clearTimeout(guardianTimerRef.current);
        guardianTimerRef.current = null;
      }

      setAppState("thinking");

      const imageBase64 = frameRef.current;
      if (!imageBase64) {
        setResponseText("I couldn't capture an image. Please try again.");
        setAppState("speaking");
        const u = new SpeechSynthesisUtterance(
          "I couldn't capture an image. Please try again."
        );
        u.rate = 1.8;
        u.onend = () => {
          setAppState("idle");
          if (guardianActiveRef.current) {
            guardianTimerRef.current = setTimeout(guardianScan, 4000);
          }
        };
        window.speechSynthesis.speak(u);
        return;
      }

      const history = historyRef.current;
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
          historyRef.current = [
            ...newHistory,
            { role: "assistant", content: text },
          ];
          setResponseText(text || null);
          setAppState("speaking");
          addSessionEntry(imageBase64, transcript, text);

          const audio = audioRef.current;
          if (audio) {
            const url = URL.createObjectURL(blob);
            audio.src = url;
            audio.playbackRate = 1.4;
            audio.onended = () => {
              URL.revokeObjectURL(url);
              setAppState("idle");
              if (guardianActiveRef.current) {
                guardianTimerRef.current = setTimeout(guardianScan, 4000);
              }
            };
            audio.onerror = () => {
              URL.revokeObjectURL(url);
              speakFallback(text);
            };
            audio.play().catch(() => speakFallback(text));
          } else {
            speakFallback(text);
          }
        } else {
          const data = await response.json();
          if (data.error) throw new Error(data.error);
          historyRef.current = [
            ...newHistory,
            { role: "assistant", content: data.text },
          ];
          setResponseText(data.text);
          setAppState("speaking");
          addSessionEntry(imageBase64, transcript, data.text);
          speakFallback(data.text);
        }
      } catch (error: unknown) {
        const msg =
          error instanceof Error ? error.message : "Something went wrong";
        setResponseText(msg);
        setAppState("speaking");
        speakFallback(msg);
      }
    },
    [speakFallback, addSessionEntry, guardianScan]
  );

  // ── Screen tap handler ────────────────────────────────
  const handleScreenTap = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !audio.paused && appState !== "speaking") {
      audio.src = SILENT_WAV;
      audio.play().then(() => audio.pause()).catch(() => {});
    }
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(""));

    // Double-tap detection for guardian toggle
    const now = Date.now();
    if (now - lastTapRef.current < 350) {
      lastTapRef.current = 0;
      if (modeRef.current === "guardian") {
        if (guardianActiveRef.current) {
          stopGuardian();
          speak("Guardian paused.");
        } else {
          startGuardian();
          speak("Guardian resumed.");
        }
        // Cancel any listening that the first tap started
        if (isListeningRef.current) {
          setIsListening(false);
          try { recognitionRef.current?.stop(); } catch { /* */ }
          transcriptRef.current = "";
          setAppState("idle");
        }
        return;
      }
    }
    lastTapRef.current = now;

    const isBusy = appState === "thinking" || appState === "speaking";
    if (isBusy) return;

    if (isListening) {
      playChime(440);
      setIsListening(false);
      try { recognitionRef.current?.stop(); } catch { /* */ }
      const transcript = transcriptRef.current;
      transcriptRef.current = "";
      if (frameTimeoutRef.current) clearTimeout(frameTimeoutRef.current);
      processRequest(transcript);
    } else {
      playChime(1200);
      setIsListening(true);
      setAppState("listening");
      transcriptRef.current = "";
      try { recognitionRef.current?.start(); } catch { /* */ }
      frameTimeoutRef.current = setTimeout(() => {
        frameRef.current = cameraRef.current?.captureAndFreeze() || null;
      }, 500);
    }
  }, [appState, isListening, processRequest, startGuardian, stopGuardian]);

  // ── Cleanup guardian on unmount ────────────────────────
  useEffect(() => {
    return () => {
      if (guardianTimerRef.current) clearTimeout(guardianTimerRef.current);
    };
  }, []);

  return (
    <main className="fixed inset-0 bg-[#0a0a0a]">
      {screen !== "camera" && (
        <IntroScreen
          onSelectMode={handleSelectMode}
          dismissing={screen === "dismissing"}
        />
      )}

      <CameraFeed ref={cameraRef} />

      {screen === "camera" && (
        <StatusIndicator
          state={appState}
          mode={mode}
          isListening={isListening}
          guardianActive={guardianActive}
          responseText={responseText}
          sessionHistory={sessionHistory}
          onReplayEntry={replayEntry}
          onSwitchMode={switchMode}
        />
      )}

      <audio ref={audioRef} className="hidden" playsInline />

      {screen === "camera" && (
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
                  : mode === "guardian"
                    ? "Tap to ask a question. Double-tap to toggle guardian mode."
                    : "Tap anywhere to start speaking your question"
          }
        />
      )}
    </main>
  );
}
