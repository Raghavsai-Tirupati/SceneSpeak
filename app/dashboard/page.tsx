"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

interface Hazard {
  id: string;
  latitude: number;
  longitude: number;
  description: string;
  timestamp: number;
}

const HazardMap = dynamic(() => import("./HazardMap"), { ssr: false });

export default function DashboardPage() {
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [loading, setLoading] = useState(true);
  const prevCountRef = useRef(0);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const fetchHazards = () => {
      fetch("/api/hazard")
        .then((r) => r.json())
        .then((data) => {
          if (data.length > prevCountRef.current && prevCountRef.current > 0) {
            setFlash(true);
            setTimeout(() => setFlash(false), 1500);
          }
          prevCountRef.current = data.length;
          setHazards(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    fetchHazards();
    const interval = setInterval(fetchHazards, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-[#1a1a1a] px-6 py-5 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-serif)] text-[26px] sm:text-[32px] tracking-tight">
              SceneSpeak
              <span className="text-[#555] font-normal ml-2">/ Hazard Dashboard</span>
            </h1>
            <p className="text-[#666] text-[13px] mt-1">
              Real-time accessibility hazard monitoring for city planners &amp; universities
            </p>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-3.5 py-2">
              <span
                className="w-2 h-2 rounded-full bg-[#EF5350]"
                style={{ animation: "pulse 2s ease-in-out infinite" }}
              />
              <span className="text-[#EF5350] text-[11px] font-semibold tracking-wider uppercase">
                Live
              </span>
            </div>
            <div className="text-right">
              <p
                className="text-[28px] font-semibold transition-all duration-300"
                style={{ color: flash ? "#EF5350" : "#4FC3F7" }}
              >
                {hazards.length}
              </p>
              <p className="text-[#666] text-[11px] uppercase tracking-wider">
                Reports
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-[70vh]">
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-10 h-10 rounded-full border-2 border-[#333] border-t-[#4FC3F7]"
                style={{ animation: "spin 1s linear infinite" }}
              />
              <p className="text-[#666] text-[14px]">Loading hazard data...</p>
            </div>
          </div>
        ) : hazards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
            <div className="w-16 h-16 rounded-full bg-[#111] border border-[#222] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <p className="text-[#808080] text-[16px]">No hazards reported yet</p>
            <p className="text-[#555] text-[13px] text-center max-w-sm leading-relaxed">
              Hazards are automatically detected when users scan their environment with SceneSpeak. Start exploring to generate reports.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-[#1a1a1a] h-[calc(100vh-180px)] min-h-[500px]" style={{ boxShadow: "0 0 40px rgba(0,0,0,0.3)" }}>
              <HazardMap hazards={hazards} />
            </div>

            <div className="flex flex-col h-[calc(100vh-180px)] min-h-[500px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#999] text-[12px] font-semibold uppercase tracking-[0.15em]">
                  Recent Reports
                </h2>
                <span className="text-[#444] text-[11px]">
                  auto-refreshing
                </span>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto hide-scrollbar pr-1">
                {[...hazards].reverse().map((h, i) => (
                  <div
                    key={h.id}
                    className="rounded-xl bg-[#111] border border-[#1a1a1a] p-4 transition-all duration-300 hover:border-[#333]"
                    style={i === 0 && flash ? {
                      borderColor: "rgba(239,83,80,0.4)",
                      boxShadow: "0 0 20px rgba(239,83,80,0.1)",
                    } : undefined}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 flex-shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ef5350]" style={{
                          boxShadow: "0 0 8px rgba(239,83,80,0.5)",
                        }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#E0E0E0] text-[13px] leading-relaxed line-clamp-3">
                          {h.description}
                        </p>
                        <div className="flex items-center gap-2.5 mt-3 text-[11px] text-[#555]">
                          <span>
                            {new Date(h.timestamp).toLocaleString([], {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="text-[#333]">&bull;</span>
                          <span>
                            {h.latitude.toFixed(4)}, {h.longitude.toFixed(4)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
