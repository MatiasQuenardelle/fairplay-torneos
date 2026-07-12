import Link from "next/link";
import { db } from "@/lib/db";
import TeamBadge from "@/components/TeamBadge";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Equipos | FairPlay Torneos",
};

export default async function EquiposPage() {
  const categories = await db.category.findMany({
    orderBy: { slug: "asc" },
    include: {
      teams: {
        orderBy: { name: "asc" },
        include: { _count: { select: { players: true } } },
      },
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-20">
      <h1 className="text-4xl font-black tracking-tight">
        Los <span className="gold-gradient-text">equipos</span>
      </h1>
      <p className="mt-2 text-white/60">
        Todos los planteles que compiten en la Copa Mundial de Clubes 2026
      </p>

      {categories.map((c) => (
        <section key={c.id} className="mt-12">
          <h2 className="text-xl font-black uppercase tracking-widest text-gold-400">
            {c.name}
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.teams.map((t) => (
              <Link
                key={t.id}
                href={`/equipos/${t.id}`}
                className="group rounded-2xl border border-white/10 bg-pitch-800 p-5 transition hover:border-gold-500/50 hover:bg-pitch-700"
              >
                <TeamBadge shortName={t.shortName} color={t.colorPrimary} size={52} />
                <h3 className="mt-4 font-bold group-hover:text-gold-300">
                  {t.name}
                </h3>
                <p className="mt-1 text-xs text-white/50">
                  {t._count.players} jugadores
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
