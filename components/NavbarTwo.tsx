"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";
import LogoutButton from "./LogoutButton";

export default function NavbarTwo() {
  const [isOpen, setIsOpen] = useState(false);

  return React.createElement(
    React.Fragment,
    null,
    // ===== DESKTOP NAVBAR =====
    React.createElement(
      "header",
      {
        className:
          "fixed top-0 text-black left-0 w-full z-50 flex items-center justify-between px-8 py-5 bg-transparent backdrop-blur-sm border-b border-white/10",
      },
      // Left Links (Hidden on Mobile)
      React.createElement(
        "div",
        { className: "hidden md:flex items-center space-x-6 text-sm uppercase tracking-widest" },
        React.createElement(
          Link,
          { href: "/order", className: "hover:text-red-500 transition" },
          "Orders"
        ),
        React.createElement(
          Link,
          { href: "/products", className: "hover:text-red-500 transition" },
          "Products"
        )
      ),
      // Center Title
      React.createElement(
        "div",
        { className: "absolute left-1/2 transform -translate-x-1/2" },
        React.createElement(
          Link,
          {
            href: "/",
            className:
              "text-xl md:text-2xl font-bold tracking-[0.3em] uppercase text-red-900 hover:text-red-600 transition",
          },
          "ThreadHeist"
        )
      ),
      // Right Section
      React.createElement(
        "div",
        { className: "hidden md:flex text-black items-center space-x-6 text-sm uppercase  tracking-widest" },
        React.createElement(
          Link,
          { href: "/cart", className: "hover:text-red-500 transition" },
          "Bag"
        ),
        React.createElement(LogoutButton, null)
      ),
      // ===== MOBILE MENU BUTTON =====
      React.createElement(
        "button",
        {
          onClick: function () {
            return setIsOpen(true);
          },
          className: "md:hidden text-white hover:text-red-500 transition",
        },
        React.createElement(Menu, { size: 28 })
      )
    ),
    // ===== MOBILE MENU OVERLAY =====
    React.createElement(MobileMenu, { open: isOpen, onClose: function () { return setIsOpen(false); } })
  );
}
