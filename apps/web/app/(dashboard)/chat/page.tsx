"use client";

import { useEffect, useRef } from "react";
import { Logo } from "../../../components/client utilities/logo";

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current) {
      heroRef.current.classList.add("animate-slide-up");
    }
  }, []);

  return (
    <div
      ref={heroRef}
      className="h-screen w-full flex flex-col justify-center items-center text-center opacity-0 transform translate-y-10 transition-all duration-1000 ease-out"
    >
      <div className="max-w-3xl p-8 rounded-lg shadow-lg backdrop-blur-md">
        <h1 className="text-4xl sm:text-5xl flex gap-3 items-center justify-center font-extrabold mb-6">
          Welcome to <span><Logo className="text-5xl" /></span>
        </h1>
        <p className="text-lg sm:text-xl mb-6">
          Connect, chat, and collaborate in real-time with people all over the
          world. Create rooms, invite friends and start building meaningful
          conversations instantly!
        </p>
      </div>

      <div className="absolute bottom-8 text-sm">
        <p>Developed by Sujal and crafted with ❤️.</p>
      </div>
    </div>
  );
}
