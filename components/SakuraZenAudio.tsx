"use client";

import { useEffect, useRef, useState } from "react";

export default function SakuraZenAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);

  const initZenAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Pentatonic / Insen Japanese Scale Frequencies (D, Eb, G, A, C)
      const scale = [146.83, 155.56, 196.0, 220.0, 261.63, 293.66, 311.13, 392.0, 440.0, 523.25];

      const playChime = () => {
        if (!ctx || ctx.state !== "running") return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        const freq = scale[Math.floor(Math.random() * scale.length)];
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        // Soft bell envelope
        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.12, now + 0.15);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 4.6);
      };

      // Soft ambient background drone
      const droneOsc = ctx.createOscillator();
      const droneGain = ctx.createGain();
      droneOsc.type = "triangle";
      droneOsc.frequency.setValueAtTime(110.0, ctx.currentTime); // A2
      droneGain.gain.setValueAtTime(0.015, ctx.currentTime);
      droneOsc.connect(droneGain);
      droneGain.connect(masterGain);
      droneOsc.start();

      playChime();
      intervalRef.current = window.setInterval(() => {
        if (Math.random() > 0.3) playChime();
      }, 2400);

      setIsPlaying(true);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const toggleAudio = () => {
    if (!audioCtxRef.current) {
      initZenAudio();
      return;
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
      setIsPlaying(true);
    } else if (isPlaying) {
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0.0001, audioCtxRef.current.currentTime, 0.2);
      }
      setTimeout(() => {
        audioCtxRef.current?.suspend();
        setIsPlaying(false);
      }, 250);
    } else {
      audioCtxRef.current.resume();
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0.08, audioCtxRef.current.currentTime, 0.2);
      }
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-auto select-none">
      <button
        type="button"
        onClick={toggleAudio}
        aria-label={isPlaying ? "Mute Zen Soundscape" : "Play Zen Soundscape"}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-full backdrop-blur-xl bg-black/40 hover:bg-black/60 border border-white/20 hover:border-white/40 text-white/90 hover:text-white transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 group cursor-pointer"
      >
        <div className="flex items-center gap-[3px] h-3.5">
          <span
            className={`w-[2.5px] bg-[#e60012] rounded-full transition-all duration-300 ${
              isPlaying ? "h-3.5 animate-pulse" : "h-1.5 opacity-50"
            }`}
          />
          <span
            className={`w-[2.5px] bg-[#e60012] rounded-full transition-all duration-300 ${
              isPlaying ? "h-2 animate-bounce" : "h-1.5 opacity-50"
            }`}
          />
          <span
            className={`w-[2.5px] bg-[#e60012] rounded-full transition-all duration-300 ${
              isPlaying ? "h-3 animate-pulse" : "h-1.5 opacity-50"
            }`}
          />
        </div>
        <span className="text-[10px] font-bold tracking-[0.18em] uppercase select-none">
          {isPlaying ? "Zen Ambience: ON" : "Sound: OFF"}
        </span>
      </button>
    </div>
  );
}
