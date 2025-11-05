"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import InfiniteMarquee from "@/components/Marquee";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function Header() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 20; // sensitivity
    const y = (e.clientY / innerHeight - 0.5) * 20;
    setOffset({ x, y });
  };
// font-[Montserrat]
  return (
    <div
      className="min-h-screen flex flex-col text-white relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <Navbar/>
      {/* ===== BACKGROUND (PARALLAX) ===== */}
      <div
        className="absolute inset-0 bg-center bg-cover transition-transform duration-300 ease-out will-change-transform"
        style={{
          backgroundImage: "url('/fall-back3.png')",
          transform: `translate(${offset.x}px, ${offset.y}px) scale(1.05)`,
          filter: "brightness(0.9)",
        }}
      ></div>

      {/* ===== OVERLAY ===== */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* ===== NAVBAR ===== */}
      
      {/* ===== HERO SECTION ===== */}
      <section className="relative z-10 flex flex-col items-center justify-center h-screen text-center">
        <div className="relative">
          {/* <h1 className="text-[10vw] tracking-widest text-white/90 ">
            THREADHEIST
          </h1> */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* <span className="text-[1.5vw] uppercase underline tracking-[1em] text-red-900 font-semibold">
              The Heist Collection
            </span> */}
          </div>
        </div>

         {/* <style>{`
        // @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300&display=swap');
      `}</style> */}
      <Link href="/collection" className="mt-80 px-10 py-3 border border-white/50 text-sm uppercase tracking-widest relative overflow-hidden group inline-block transition-all duration-300" style={{ fontFamily: '"Noto Sans TC", sans-serif', fontWeight: '300', letterSpacing: '0.15em' }}>
      {/* Background fill effect */}
      <span className="absolute inset-0 bg-red-600 transform -skew-x-12 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
      
      {/* Red glow effect on hover */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 shadow-lg shadow-red-600/50 transition-opacity duration-300"></span>
      
      {/* Text */}
      <span className="relative z-10 inline-block transition-colors duration-300 ">
        All Collection
      </span>
    </Link>
      </section>

      <InfiniteMarquee />
    </div>
  );
}
