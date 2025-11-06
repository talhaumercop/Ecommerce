"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/auth/sign-in" })}
      className="p-2 rounded-md bg-gradient-to-r from-[#B3001B] to-[#6F1021] hover:from-[#e21b14] transition-all duration-300 shadow-md"
    >
      <LogOut size={22} className="text-white group-hover:text-black transition-colors duration-300" />
    </button>
  );
}
