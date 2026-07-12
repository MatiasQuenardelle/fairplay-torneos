import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex w-full flex-col border-b border-white/10 bg-pitch-800 md:min-h-screen md:w-60 md:border-b-0 md:border-r">
        <Link href="/admin" className="flex items-center gap-2.5 px-5 py-5">
          <Image
            src="/logo.png"
            alt="FairPlay"
            width={36}
            height={36}
            className="rounded-full bg-white p-0.5"
          />
          <div>
            <p className="text-sm font-extrabold leading-none">
              Fair<span className="text-gold-500">Play</span>
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-white/50">
              Admin
            </p>
          </div>
        </Link>

        <nav className="flex flex-row gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
          {[
            { href: "/admin", label: "Inicio" },
            { href: "/admin/noticias", label: "Noticias" },
            { href: "/admin/equipos", label: "Equipos y jugadores" },
            { href: "/admin/partidos", label: "Partidos y resultados" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto hidden border-t border-white/10 p-4 md:block">
          <p className="truncate text-xs text-white/50">{session.name}</p>
          <div className="mt-3 flex items-center gap-2">
            <Link
              href="/"
              className="flex-1 rounded-lg border border-white/15 px-3 py-2 text-center text-xs font-semibold text-white/70 hover:bg-white/10"
            >
              Ver sitio
            </Link>
            <form action={logout} className="flex-1">
              <button className="w-full rounded-lg border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/10">
                Salir
              </button>
            </form>
          </div>
        </div>
      </aside>

      <main className="flex-1 px-5 py-8 md:px-10">{children}</main>
    </div>
  );
}
