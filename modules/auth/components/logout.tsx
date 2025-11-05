"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react"; // modern, clean icon set

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="relative group p-2 rounded-md bg-gradient-to-r from-[#B3001B] to-[#6F1021] 
                 hover:from-[#e21b14] hover:to-[#E2B714]/90 transition-all duration-300 shadow-md"
      title="Logout"
    >
      <LogOut
        size={22}
        className="text-white group-hover:text-black transition-colors duration-300"
      />
    </button>
  );
}
