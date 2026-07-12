import Link from "next/link";
import { db } from "@/lib/db";
import { getStandings } from "@/lib/standings";
import TeamBadge from "@/components/TeamBadge";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tabla de Posiciones | FairPlay Torneos",
};

export default async function PosicionesPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const categories = await db.category.findMany({ orderBy: { slug: "asc" } });
  const active =
    categories.find((c) => c.slug === categoria) ?? categories[0];

  if (!active) {
    return (
      <div className="mx-auto max-w-4xl px-4 pt-32 pb-20 text-center text-white/60">
        Todavía no hay categorías cargadas.
      </div>
    );
  }

  const [standings, matches, scorers] = await Promise.all([
    getStandings(active.id),
    db.match.findMany({
      where: { categoryId: active.id },
      orderBy: { date: "asc" },
      include: { homeTeam: true, awayTeam: true },
    }),
    db.player.findMany({
      where: { team: { categoryId: active.id }, goals: { gt: 0 } },
      orderBy: { goals: "desc" },
      take: 10,
      include: { team: true },
    }),
  ]);

  const jugados = matches.filter((m) => m.played).reverse();
  const proximos = matches.filter((m) => !m.played);

  // agrupar jugados por fecha/ronda
  const porRonda = new Map<string, typeof jugados>();
  for (const m of jugados) {
    if (!porRonda.has(m.round)) porRonda.set(m.round, []);
    porRonda.get(m.round)!.push(m);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-20">
      <h1 className="text-4xl font-black tracking-tight">
        Tabla de <span className="gold-gradient-text">posiciones</span>
      </h1>
      <p className="mt-2 text-white/60">
        Torneo Apertura — Copa Mundial de Clubes 2026
      </p>

      {/* Tabs de categorías */}
      <div className="mt-8 flex gap-2">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/posiciones?categoria=${c.slug}`}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
              c.id === active.id
                ? "bg-gold-500 text-pitch-900"
                : "border border-white/15 text-white/70 hover:bg-white/10"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-3">
        {/* Tabla */}
        <div className="lg:col-span-2">
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-pitch-700 text-xs uppercase tracking-wider text-white/60">
                <tr>
                  <th className="px-3 py-3 text-left">#</th>
                  <th className="px-3 py-3 text-left">Equipo</th>
                  <th className="px-2 py-3 text-center">PJ</th>
                  <th className="px-2 py-3 text-center">PG</th>
                  <th className="px-2 py-3 text-center">PE</th>
                  <th className="px-2 py-3 text-center">PP</th>
                  <th className="px-2 py-3 text-center">GF</th>
                  <th className="px-2 py-3 text-center">GC</th>
                  <th className="px-2 py-3 text-center">DIF</th>
                  <th className="px-3 py-3 text-center">PTS</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((r, i) => (
                  <tr
                    key={r.teamId}
                    className={`border-t border-white/5 ${
                      i < 4 ? "bg-gold-500/5" : "bg-pitch-900"
                    }`}
                  >
                    <td className="px-3 py-3">
                      <span
                        className={`font-black ${
                          i < 4 ? "text-gold-500" : "text-white/50"
                        }`}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <Link
                        href={`/equipos/${r.teamId}`}
                        className="flex items-center gap-2.5 hover:text-gold-300"
                      >
                        <TeamBadge shortName={r.shortName} color={r.colorPrimary} size={30} />
                        <span className="font-semibold">{r.name}</span>
                      </Link>
                    </td>
                    <td className="px-2 py-3 text-center text-white/70">{r.pj}</td>
                    <td className="px-2 py-3 text-center text-white/70">{r.pg}</td>
                    <td className="px-2 py-3 text-center text-white/70">{r.pe}</td>
                    <td className="px-2 py-3 text-center text-white/70">{r.pp}</td>
                    <td className="px-2 py-3 text-center text-white/70">{r.gf}</td>
                    <td className="px-2 py-3 text-center text-white/70">{r.gc}</td>
                    <td className="px-2 py-3 text-center text-white/70">
                      {r.dif > 0 ? `+${r.dif}` : r.dif}
                    </td>
                    <td className="px-3 py-3 text-center text-base font-black text-gold-400">
                      {r.pts}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-white/40">
            Los primeros 4 clasifican a semifinales. Criterio: puntos,
            diferencia de gol, goles a favor.
          </p>

          {/* Resultados por fecha */}
          <h2 className="mt-12 text-2xl font-black">
            Resultados <span className="text-gold-500">por fecha</span>
          </h2>
          {porRonda.size === 0 && (
            <p className="mt-4 text-sm text-white/50">
              Todavía no hay partidos jugados en esta categoría.
            </p>
          )}
          <div className="mt-6 space-y-8">
            {[...porRonda.entries()].map(([ronda, ms]) => (
              <div key={ronda}>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gold-400">
                  {ronda}
                </h3>
                <div className="mt-3 space-y-2">
                  {ms.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-pitch-800 px-4 py-2.5 text-sm"
                    >
                      <span className="flex flex-1 items-center gap-2 font-medium">
                        <TeamBadge shortName={m.homeTeam.shortName} color={m.homeTeam.colorPrimary} size={26} />
                        {m.homeTeam.name}
                      </span>
                      <span className="mx-3 rounded bg-pitch-700 px-2.5 py-1 font-black text-gold-400">
                        {m.homeScore} - {m.awayScore}
                      </span>
                      <span className="flex flex-1 items-center justify-end gap-2 font-medium">
                        {m.awayTeam.name}
                        <TeamBadge shortName={m.awayTeam.shortName} color={m.awayTeam.colorPrimary} size={26} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: próximos + goleadores */}
        <div className="space-y-10">
          <div>
            <h2 className="text-xl font-black">
              Próximos <span className="text-gold-500">partidos</span>
            </h2>
            <div className="mt-4 space-y-2">
              {proximos.length === 0 && (
                <p className="text-sm text-white/50">Sin partidos programados.</p>
              )}
              {proximos.map((m) => (
                <div
                  key={m.id}
                  className="rounded-lg border border-white/10 bg-pitch-800 px-4 py-3 text-sm"
                >
                  <p className="text-xs uppercase tracking-widest text-gold-400">
                    {m.round} ·{" "}
                    {new Date(m.date).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                  <p className="mt-1.5 font-semibold">
                    {m.homeTeam.name}{" "}
                    <span className="text-white/40">vs</span>{" "}
                    {m.awayTeam.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black">
              <span className="text-gold-500">Goleadores</span>
            </h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-sm">
                <tbody>
                  {scorers.map((p, i) => (
                    <tr key={p.id} className="border-t border-white/5 first:border-0 bg-pitch-900">
                      <td className="w-8 px-3 py-2.5 font-bold text-gold-500">{i + 1}</td>
                      <td className="px-2 py-2.5">
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-xs text-white/50">{p.team.name}</p>
                      </td>
                      <td className="px-3 py-2.5 text-right font-black text-gold-400">
                        {p.goals}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
