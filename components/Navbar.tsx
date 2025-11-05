"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import MobileMenu from "./MobileMenu";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30); // activates after scrolling 30px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-5 transition-all duration-300 
        ${scrolled ? "bg-white text-black border-b border-black/10" : "bg-transparent text-white border-b border-white/10"}`}
      >
        {/* Left Links */}
        <div className="hidden md:flex items-center space-x-6 text-sm uppercase tracking-widest">
          <Link href="/order" className="hover:text-red-500 transition">
            Orders
          </Link>
          <Link href="/products" className="hover:text-red-500 transition">
            Products
          </Link>
        </div>

        {/* Center Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link
            href="/"
            className={`text-xl md:text-2xl font-bold tracking-[0.3em] uppercase transition 
            ${scrolled ? "text-red-900" : "text-white"}`}
          >
            ThreadHeist
          </Link>
        </div>

        {/* Right Links */}
        <div className="hidden md:flex items-center space-x-6 text-sm uppercase tracking-widest">
          <Link href="/cart" className="hover:text-red-500 transition">
            Bag
          </Link>
          <LogoutButton />
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setIsOpen(true)}
          className={`md:hidden transition ${scrolled ? "text-black" : "text-white"} hover:text-red-500`}
        >
          <Menu size={28} />
        </button>
      </header>

      <MobileMenu open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
