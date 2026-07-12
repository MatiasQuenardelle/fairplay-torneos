import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [posts, teams, players, matches, pendientes] = await Promise.all([
    db.post.count(),
    db.team.count(),
    db.player.count(),
    db.match.count(),
    db.match.count({ where: { played: false } }),
  ]);

  const cards = [
    { href: "/admin/noticias", label: "Noticias", n: posts, cta: "Gestionar blog" },
    { href: "/admin/equipos", label: "Equipos", n: teams, cta: "Gestionar equipos" },
    { href: "/admin/equipos", label: "Jugadores", n: players, cta: "Ver planteles" },
    { href: "/admin/partidos", label: "Partidos", n: matches, cta: `${pendientes} sin resultado` },
  ];

  return (
    <div>
      <h1 className="text-3xl font-black">
        Panel de <span className="text-gold-500">control</span>
      </h1>
      <p className="mt-1 text-white/60">
        Gestioná el blog, los equipos, jugadores y resultados del torneo.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-white/10 bg-pitch-800 p-5 transition hover:border-gold-500/50"
          >
            <p className="text-4xl font-black text-gold-500">{c.n}</p>
            <p className="mt-1 font-bold">{c.label}</p>
            <p className="mt-2 text-xs text-white/50">{c.cta} →</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-gold-500/30 bg-gold-500/5 p-6">
        <h2 className="font-bold text-gold-300">Accesos rápidos</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/noticias/nueva" className="rounded-full bg-gold-500 px-5 py-2 text-sm font-bold text-pitch-900 hover:bg-gold-400">
            + Nueva noticia
          </Link>
          <Link href="/admin/equipos" className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold hover:bg-white/10">
            + Nuevo equipo
          </Link>
          <Link href="/admin/partidos" className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold hover:bg-white/10">
            Cargar resultado
          </Link>
        </div>
      </div>
    </div>
  );
}
