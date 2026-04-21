import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Iris",
  description: "The terms under which Iris is provided.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
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
            <span className="text-[#555] font-normal ml-2">/ Terms of Service</span>
          </h1>
          <p className="text-[#666] text-[13px] mt-2">Last updated: April 2026</p>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-8 space-y-8 text-[#E0E0E0] text-[15px] leading-relaxed">
        <p className="text-[#ccc]">
          By using Iris, you agree to these terms. They&apos;re short on purpose — Iris is
          a free tool and these rules exist to keep the service safe and usable for
          everyone.
        </p>

        <Section title="What Iris is">
          <p>
            Iris is a free AI-powered visual assistant. It uses AI models to describe what
            your camera sees and read text aloud. It is provided as-is, with no guarantees
            of uptime, accuracy, or fitness for any particular purpose.
          </p>
        </Section>

        <Section title="Use at your own judgment">
          <ul className="list-disc pl-5 space-y-3 marker:text-[#555]">
            <li>
              AI can be wrong. Iris may misidentify objects, mis-read signs, or miss
              hazards entirely.
            </li>
            <li>
              Do <span className="text-white">not</span> rely on Iris alone for
              safety-critical decisions — crossing a street, avoiding a hazard, taking
              medication, driving, operating machinery, or anything where a mistake could
              cause harm.
            </li>
            <li>
              Use Iris the way you&apos;d use any assistive tool: as one source of
              information alongside your own judgment and other trusted resources.
            </li>
          </ul>
        </Section>

        <Section title="Limitation of liability">
          <p>
            To the fullest extent allowed by law, we are not liable for any harm, loss, or
            damages resulting from your use of Iris, including any inaccurate or
            incomplete AI-generated descriptions.
          </p>
        </Section>

        <Section title="Service availability">
          <p>
            We may change, pause, or discontinue Iris at any time without notice. We may
            also add or remove features, update AI models, or change how the service
            works.
          </p>
        </Section>

        <Section title="Acceptable use">
          <ul className="list-disc pl-5 space-y-3 marker:text-[#555]">
            <li>
              Don&apos;t use Iris to break the law, harass anyone, or violate anyone&apos;s
              rights.
            </li>
            <li>
              Don&apos;t use Iris to capture images of people who haven&apos;t consented,
              where laws require consent.
            </li>
          </ul>
        </Section>

        <Section title="Eligibility">
          <p>
            You must be 13 or older to use Iris. If you&apos;re under 18, you should use
            Iris with the supervision of a parent or guardian who has also read these
            terms.
          </p>
        </Section>

        <Section title="Third-party services">
          <p>
            Iris depends on third-party APIs, including Google&apos;s Gemini API and
            ElevenLabs&apos; text-to-speech API. Those services have their own terms, and
            using Iris means indirectly agreeing to theirs too:
          </p>
          <ul className="list-disc pl-5 space-y-3 marker:text-[#555] mt-3">
            <li>
              <ExtLink href="https://policies.google.com/terms">Google Terms of Service</ExtLink>
            </li>
            <li>
              <ExtLink href="https://elevenlabs.io/terms">ElevenLabs Terms</ExtLink>
            </li>
          </ul>
        </Section>

        <Section title="Changes to these terms">
          <p>
            We may update these terms at any time. The current version will always be at{" "}
            <a
              href="https://iris.how/terms"
              className="text-[#4FC3F7] hover:underline underline-offset-2"
            >
              iris.how/terms
            </a>
            . Continued use of Iris after changes means you accept the updated terms.
          </p>
        </Section>

        <Section title="Governing law">
          <p>
            These terms are governed by the laws of the State of Texas, United States,
            without regard to conflict-of-laws rules.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these terms? Email{" "}
            <a
              href="mailto:raghavt@tamu.edu"
              className="text-[#4FC3F7] hover:underline underline-offset-2"
            >
              raghavt@tamu.edu
            </a>
            .
          </p>
        </Section>
      </article>

      <footer className="border-t border-[#1a1a1a] px-6 py-6 mt-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-[12px] text-[#444]">
          <span>Iris &bull; iris.how</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-[#888] transition-colors">
              Privacy
            </Link>
            <Link href="/support" className="hover:text-[#888] transition-colors">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-white text-[18px] font-semibold tracking-tight mb-3">{title}</h2>
      <div className="text-[#ccc]">{children}</div>
    </section>
  );
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#4FC3F7] hover:underline underline-offset-2"
    >
      {children}
    </a>
  );
}
