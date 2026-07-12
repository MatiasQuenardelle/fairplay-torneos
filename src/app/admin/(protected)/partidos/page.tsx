import { db } from "@/lib/db";
import { createMatch, saveResult, deleteMatch } from "../../actions";
import TeamBadge from "@/components/TeamBadge";

export const dynamic = "force-dynamic";

export default async function AdminPartidos({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const [categories, matches] = await Promise.all([
    db.category.findMany({
      orderBy: { slug: "asc" },
      include: { teams: { orderBy: { name: "asc" } } },
    }),
    db.match.findMany({
      orderBy: [{ played: "asc" }, { date: "desc" }],
      include: { homeTeam: true, awayTeam: true, category: true },
    }),
  ]);

  const pendientes = matches.filter((m) => !m.played);
  const jugados = matches.filter((m) => m.played);

  return (
    <div>
      <h1 className="text-3xl font-black">
        Partidos y <span className="text-gold-500">resultados</span>
      </h1>
      <p className="mt-1 text-sm text-white/60">
        Al guardar un resultado, la tabla de posiciones se actualiza
        automáticamente.
      </p>

      {error === "equipos" && (
        <p className="mt-4 max-w-2xl rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
          Elegí dos equipos distintos de la misma categoría.
        </p>
      )}

      {/* Crear partido */}
      <form
        action={createMatch}
        className="mt-6 grid max-w-4xl gap-3 rounded-2xl border border-white/10 bg-pitch-800 p-5 sm:grid-cols-5"
      >
        <div>
          <label htmlFor="round" className="mb-1 block text-xs text-white/60">Fecha / Ronda</label>
          <input id="round" name="round" required placeholder="Fecha 6"
            className="w-full rounded-lg border border-white/15 bg-pitch-900 px-3 py-2 text-sm outline-none focus:border-gold-500" />
        </div>
        <div>
          <label htmlFor="date" className="mb-1 block text-xs text-white/60">Día</label>
          <input id="date" name="date" type="date" required
            className="w-full rounded-lg border border-white/15 bg-pitch-900 px-3 py-2 text-sm outline-none focus:border-gold-500" />
        </div>
        <div>
          <label htmlFor="homeTeamId" className="mb-1 block text-xs text-white/60">Local</label>
          <select id="homeTeamId" name="homeTeamId"
            className="w-full rounded-lg border border-white/15 bg-pitch-900 px-3 py-2 text-sm outline-none focus:border-gold-500">
            {categories.map((c) => (
              <optgroup key={c.id} label={c.name}>
                {c.teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="awayTeamId" className="mb-1 block text-xs text-white/60">Visitante</label>
          <select id="awayTeamId" name="awayTeamId"
            className="w-full rounded-lg border border-white/15 bg-pitch-900 px-3 py-2 text-sm outline-none focus:border-gold-500">
            {categories.map((c) => (
              <optgroup key={c.id} label={c.name}>
                {c.teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button className="h-9 w-full rounded-lg bg-gold-500 px-4 text-sm font-bold text-pitch-900 hover:bg-gold-400">
            Crear partido
          </button>
        </div>
      </form>
      <p className="mt-2 text-xs text-white/40">
        La categoría del partido se toma del equipo local.
      </p>

      {/* Pendientes */}
      <h2 className="mt-10 text-xl font-black">
        Sin resultado <span className="text-gold-500">({pendientes.length})</span>
      </h2>
      <div className="mt-4 space-y-2">
        {pendientes.map((m) => (
          <MatchRow key={m.id} m={m} />
        ))}
        {pendientes.length === 0 && (
          <p className="text-sm text-white/50">No hay partidos pendientes.</p>
        )}
      </div>

      {/* Jugados */}
      <h2 className="mt-10 text-xl font-black">
        Jugados <span className="text-gold-500">({jugados.length})</span>
      </h2>
      <div className="mt-4 space-y-2">
        {jugados.map((m) => (
          <MatchRow key={m.id} m={m} />
        ))}
      </div>
    </div>
  );
}

type MatchWithTeams = {
  id: number;
  round: string;
  date: Date;
  played: boolean;
  homeScore: number | null;
  awayScore: number | null;
  homeTeam: { name: string; shortName: string; colorPrimary: string };
  awayTeam: { name: string; shortName: string; colorPrimary: string };
  category: { name: string };
};

function MatchRow({ m }: { m: MatchWithTeams }) {
  return (
    <div className="rounded-xl border border-white/10 bg-pitch-800 p-3">
      <p className="text-xs uppercase tracking-widest text-white/40">
        {m.category.name} · {m.round} ·{" "}
        {new Date(m.date).toLocaleDateString("es-AR")}
      </p>
      <form
        action={saveResult}
        className="mt-2 flex flex-wrap items-center gap-3"
      >
        <input type="hidden" name="id" value={m.id} />
        <span className="flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold">
          <TeamBadge shortName={m.homeTeam.shortName} color={m.homeTeam.colorPrimary} size={28} />
          <span className="truncate">{m.homeTeam.name}</span>
        </span>
        <input
          name="homeScore"
          type="number"
          min={0}
          defaultValue={m.homeScore ?? ""}
          className="w-14 rounded-lg border border-white/15 bg-pitch-900 px-2 py-1.5 text-center text-sm font-black outline-none focus:border-gold-500"
        />
        <span className="text-white/40">-</span>
        <input
          name="awayScore"
          type="number"
          min={0}
          defaultValue={m.awayScore ?? ""}
          className="w-14 rounded-lg border border-white/15 bg-pitch-900 px-2 py-1.5 text-center text-sm font-black outline-none focus:border-gold-500"
        />
        <span className="flex min-w-0 flex-1 items-center justify-end gap-2 text-sm font-semibold">
          <span className="truncate">{m.awayTeam.name}</span>
          <TeamBadge shortName={m.awayTeam.shortName} color={m.awayTeam.colorPrimary} size={28} />
        </span>
        <button className="rounded-lg border border-gold-500/50 px-4 py-1.5 text-xs font-bold text-gold-400 hover:bg-gold-500 hover:text-pitch-900">
          Guardar
        </button>
        <button
          formAction={deleteMatch}
          className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/10"
        >
          Borrar
        </button>
      </form>
    </div>
  );
}
