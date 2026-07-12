"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/posiciones", label: "Posiciones" },
  { href: "/equipos", label: "Equipos" },
  { href: "/blog", label: "Noticias" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-pitch-900/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="FairPlay"
            width={40}
            height={40}
            className="rounded-full bg-white p-0.5"
          />
          <span className="text-lg font-extrabold tracking-tight">
            Fair<span className="text-gold-500">Play</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                pathname === l.href
                  ? "bg-gold-500 text-pitch-900"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="ml-2 rounded-full border border-gold-500/50 px-4 py-2 text-sm font-medium text-gold-400 transition-colors hover:bg-gold-500 hover:text-pitch-900"
          >
            Admin
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden"
          aria-label="Menú"
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-white" />
            <span className="block h-0.5 w-6 bg-white" />
            <span className="block h-0.5 w-6 bg-white" />
          </div>
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-pitch-900 px-4 py-3 md:hidden">
          {[...links, { href: "/admin", label: "Admin" }].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-white/85 hover:bg-white/10"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
