"use client";

import Link from "next/link";
import { LogOut, X } from "lucide-react";
import LogoutButton from "./LogoutButton";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <div
      className={`fixed inset-0 z-50 bg-black/90 backdrop-blur-lg text-white flex flex-col 
      items-center justify-center space-y-10 transform transition-transform duration-500 
      ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-red-500 transition"
      >
        <X size={30} />
      </button>

      {/* Links */}
      <nav className="flex flex-col items-center space-y-6 text-lg uppercase tracking-widest">
       
        <Link href="/order" onClick={onClose} className="hover:text-red-500 transition">
          Orders
        </Link>
        <Link href="/collection" onClick={onClose} className="hover:text-red-500 transition">
          Collection
        </Link>
        
        <Link href="/cart" onClick={onClose} className="hover:text-red-500 transition">
          Bag [2]
        </Link>
        <LogoutButton/>
      </nav>
    </div>
  );
}
