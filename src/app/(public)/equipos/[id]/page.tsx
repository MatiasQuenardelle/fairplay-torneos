import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import TeamBadge from "@/components/TeamBadge";

export const dynamic = "force-dynamic";

export default async function EquipoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = await db.team.findUnique({
    where: { id: Number(id) || 0 },
    include: {
      category: true,
      players: { orderBy: { number: "asc" } },
    },
  });
  if (!team) notFound();

  const matches = await db.match.findMany({
    where: {
      OR: [{ homeTeamId: team.id }, { awayTeamId: team.id }],
      played: true,
    },
    orderBy: { date: "desc" },
    take: 5,
    include: { homeTeam: true, awayTeam: true },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 pt-28 pb-20">
      <Link href="/equipos" className="text-sm text-gold-400 hover:text-gold-300">
        ← Volver a equipos
      </Link>
      <div className="mt-6 flex items-center gap-5">
        <TeamBadge shortName={team.shortName} color={team.colorPrimary} size={72} />
        <div>
          <h1 className="text-4xl font-black tracking-tight">{team.name}</h1>
          <p className="mt-1 text-white/60">{team.category.name}</p>
        </div>
      </div>

      <div className="mt-12 grid gap-12 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-black">
            El <span className="text-gold-500">plantel</span>
          </h2>
          <div className="mt-5 overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-pitch-700 text-xs uppercase tracking-wider text-white/60">
                <tr>
                  <th className="px-4 py-3 text-left">N°</th>
                  <th className="px-4 py-3 text-left">Jugador</th>
                  <th className="px-4 py-3 text-left">Posición</th>
                  <th className="px-4 py-3 text-center">Goles</th>
                </tr>
              </thead>
              <tbody>
                {team.players.map((p) => (
                  <tr key={p.id} className="border-t border-white/5 bg-pitch-900">
                    <td className="px-4 py-3 font-black text-gold-500">{p.number}</td>
                    <td className="px-4 py-3 font-semibold">{p.name}</td>
                    <td className="px-4 py-3 text-white/70">{p.position}</td>
                    <td className="px-4 py-3 text-center font-bold text-white/80">
                      {p.goals}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black">
            Últimos <span className="text-gold-500">partidos</span>
          </h2>
          <div className="mt-5 space-y-2">
            {matches.length === 0 && (
              <p className="text-sm text-white/50">Sin partidos jugados.</p>
            )}
            {matches.map((m) => {
              const esLocal = m.homeTeamId === team.id;
              const gf = esLocal ? m.homeScore! : m.awayScore!;
              const gc = esLocal ? m.awayScore! : m.homeScore!;
              const rival = esLocal ? m.awayTeam.name : m.homeTeam.name;
              const res = gf > gc ? "G" : gf < gc ? "P" : "E";
              const color =
                res === "G"
                  ? "bg-green-600"
                  : res === "P"
                  ? "bg-red-600"
                  : "bg-white/30";
              return (
                <div
                  key={m.id}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-pitch-800 px-4 py-2.5 text-sm"
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black text-white ${color}`}
                  >
                    {res}
                  </span>
                  <span className="flex-1 truncate">vs {rival}</span>
                  <span className="font-black text-gold-400">
                    {gf} - {gc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
