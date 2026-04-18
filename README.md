# SceneSpeak

Real-time conversational AI guide for blind and visually impaired users. Point your camera, ask a question, get an instant spoken answer.

## Hackathon

**Hook 'Em Hacks 2026** — UT Austin  
Track: Multimodal Search & Generation

## Team

- Member 1
- Member 2
- Member 3

## How It Works

1. Camera captures a live video frame
2. User speaks a question (hold-to-talk)
3. Frame + transcript are sent to Gemini 2.0 Flash for multimodal analysis
4. Response is converted to natural speech via ElevenLabs TTS
5. Audio plays back automatically

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** — minimal, accessible UI
- **Web Speech API** — browser-native voice input
- **Google Gemini 2.0 Flash** — multimodal vision + language
- **ElevenLabs TTS** — natural voice output
- **Browser SpeechSynthesis** — TTS fallback

## Setup

```bash
# Clone the repo
git clone <repo-url>
cd SceneSpeak

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
# Edit .env.local with your API keys

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — allow camera and microphone access when prompted.

## Demo

1. Open the app on your phone (or desktop with a webcam)
2. Point the camera at something
3. Hold the button and ask a question (e.g., "What do you see?")
4. Release the button and listen to the response

## API Keys

- **Gemini**: Get a key at [Google AI Studio](https://aistudio.google.com/apikey)
- **ElevenLabs**: Get a key at [ElevenLabs](https://elevenlabs.io)
