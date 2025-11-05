"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import InfiniteMarquee from "@/components/Marquee";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import ProductsPage from "./products/page";
import HomeProductsSection from "@/components/HomeProduct";
import { Footer } from "react-day-picker";

export default function Home() {

  return (
   <>
   <div>
    <Header/>
    <HomeProductsSection/>
    
   </div>
   </>
  );
}
