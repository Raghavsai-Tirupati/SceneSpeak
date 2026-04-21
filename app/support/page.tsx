import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support — Iris",
  description: "Get help with Iris.",
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <header className="border-b border-[#1a1a1a] px-6 py-5 bg-[#0d0d0d]">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="text-[#666] text-[13px] hover:text-[#999] transition-colors"
          >
            ← Back to Iris
          </Link>
          <h1
            className="text-[26px] sm:text-[32px] tracking-tight mt-3"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            Iris
            <span className="text-[#555] font-normal ml-2">/ Support</span>
          </h1>
        </div>
      </header>

      <section className="flex-1 max-w-2xl mx-auto px-6 py-16 w-full">
        <h2 className="text-white text-[32px] sm:text-[40px] tracking-tight mb-5">
          Support
        </h2>
        <p className="text-[#ccc] text-[17px] leading-relaxed mb-8">
          Need help with Iris? Have feedback or accessibility suggestions? We&apos;d love
          to hear from you.
        </p>

        <a
          href="mailto:raghavt@tamu.edu"
          className="inline-flex items-center gap-3 rounded-2xl bg-[#111] border border-[#1a1a1a] px-6 py-5 hover:border-[#333] transition-colors"
          aria-label="Email Iris support at raghavt@tamu.edu"
        >
          <span
            className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center"
            aria-hidden
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4FC3F7"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="3" />
              <path d="M2 7l10 6 10-6" />
            </svg>
          </span>
          <span className="flex flex-col">
            <span className="text-[#666] text-[11px] uppercase tracking-wider">
              Email
            </span>
            <span className="text-white text-[17px]">raghavt@tamu.edu</span>
          </span>
        </a>

        <p className="text-[#555] text-[13px] leading-relaxed mt-10">
          Accessibility is a priority. If something in Iris is harder to use than it
          should be — especially with VoiceOver, screen magnification, or voice control —
          please say so. That feedback shapes the roadmap.
        </p>
      </section>

      <footer className="border-t border-[#1a1a1a] px-6 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-[12px] text-[#444]">
          <span>Iris &bull; iris.how</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-[#888] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#888] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
