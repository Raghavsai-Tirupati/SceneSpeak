"use client";

import { useRef, useEffect } from "react";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isListening: boolean;
}

export default function VoiceInput({
  onTranscript,
  isListening,
}: VoiceInputProps) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef("");
  const isListeningRef = useRef(false);
  const onTranscriptRef = useRef(onTranscript);

  // Keep refs in sync so callbacks see latest values
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  // Initialize speech recognition once
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = false;
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
        // Ended unexpectedly while still listening — restart
        try {
          recognition.start();
        } catch {
          // Already started
        }
      } else {
        // Stopped intentionally — deliver transcript
        const text = transcriptRef.current;
        transcriptRef.current = "";
        onTranscriptRef.current(text);
      }
    };

    recognition.onerror = () => {};

    recognitionRef.current = recognition;
  }, []);

  // Start/stop recognition based on isListening prop
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      transcriptRef.current = "";
      try {
        recognition.start();
      } catch {
        // Already started
      }
    } else {
      try {
        recognition.stop();
      } catch {
        // Already stopped
      }
    }
  }, [isListening]);

  return null;
}
