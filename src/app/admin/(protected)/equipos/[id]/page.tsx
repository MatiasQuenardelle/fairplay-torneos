import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  saveTeam,
  deleteTeam,
  savePlayer,
  deletePlayer,
} from "../../../actions";
import TeamBadge from "@/components/TeamBadge";

export const dynamic = "force-dynamic";

const POSICIONES = ["Arquero", "Defensor", "Mediocampista", "Delantero"];

export default async function AdminEquipo({
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

  const categories = await db.category.findMany({ orderBy: { slug: "asc" } });

  return (
    <div>
      <Link href="/admin/equipos" className="text-sm text-gold-400 hover:text-gold-300">
        ← Volver a equipos
      </Link>

      <div className="mt-4 flex items-center gap-4">
        <TeamBadge shortName={team.shortName} color={team.colorPrimary} size={56} />
        <div>
          <h1 className="text-3xl font-black">{team.name}</h1>
          <p className="text-sm text-white/50">{team.category.name}</p>
        </div>
      </div>

      {/* Editar equipo */}
      <form
        action={saveTeam}
        className="mt-8 grid max-w-3xl gap-3 rounded-2xl border border-white/10 bg-pitch-800 p-5 sm:grid-cols-5"
      >
        <input type="hidden" name="id" value={team.id} />
        <div className="sm:col-span-2">
          <label htmlFor="name" className="mb-1 block text-xs text-white/60">Nombre</label>
          <input id="name" name="name" required defaultValue={team.name}
            className="w-full rounded-lg border border-white/15 bg-pitch-900 px-3 py-2 text-sm outline-none focus:border-gold-500" />
        </div>
        <div>
          <label htmlFor="shortName" className="mb-1 block text-xs text-white/60">Sigla</label>
          <input id="shortName" name="shortName" maxLength={3} defaultValue={team.shortName}
            className="w-full rounded-lg border border-white/15 bg-pitch-900 px-3 py-2 text-sm uppercase outline-none focus:border-gold-500" />
        </div>
        <div>
          <label htmlFor="categoryId" className="mb-1 block text-xs text-white/60">Categoría</label>
          <select id="categoryId" name="categoryId" defaultValue={team.categoryId}
            className="w-full rounded-lg border border-white/15 bg-pitch-900 px-3 py-2 text-sm outline-none focus:border-gold-500">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label htmlFor="colorPrimary" className="mb-1 block text-xs text-white/60">Color</label>
            <input id="colorPrimary" name="colorPrimary" type="color" defaultValue={team.colorPrimary}
              className="h-9 w-full cursor-pointer rounded-lg border border-white/15 bg-pitch-900" />
          </div>
          <button className="h-9 rounded-lg bg-gold-500 px-4 text-sm font-bold text-pitch-900 hover:bg-gold-400">
            Guardar
          </button>
        </div>
      </form>

      {/* Jugadores */}
      <h2 className="mt-12 text-xl font-black">
        Plantel <span className="text-gold-500">({team.players.length})</span>
      </h2>

      {/* Agregar jugador */}
      <form
        action={savePlayer}
        className="mt-4 grid max-w-3xl gap-3 rounded-2xl border border-gold-500/30 bg-gold-500/5 p-5 sm:grid-cols-6"
      >
        <input type="hidden" name="teamId" value={team.id} />
        <div className="sm:col-span-2">
          <label htmlFor="pname" className="mb-1 block text-xs text-white/60">Nombre y apellido</label>
          <input id="pname" name="name" required placeholder="Nuevo jugador"
            className="w-full rounded-lg border border-white/15 bg-pitch-900 px-3 py-2 text-sm outline-none focus:border-gold-500" />
        </div>
        <div>
          <label htmlFor="pnumber" className="mb-1 block text-xs text-white/60">N°</label>
          <input id="pnumber" name="number" type="number" min={1} max={99} defaultValue={10}
            className="w-full rounded-lg border border-white/15 bg-pitch-900 px-3 py-2 text-sm outline-none focus:border-gold-500" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="pposition" className="mb-1 block text-xs text-white/60">Posición</label>
          <select id="pposition" name="position"
            className="w-full rounded-lg border border-white/15 bg-pitch-900 px-3 py-2 text-sm outline-none focus:border-gold-500">
            {POSICIONES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button className="h-9 w-full rounded-lg bg-gold-500 px-4 text-sm font-bold text-pitch-900 hover:bg-gold-400">
            Agregar
          </button>
        </div>
      </form>

      {/* Lista editable */}
      <div className="mt-6 space-y-2">
        {team.players.map((p) => (
          <div key={p.id} className="rounded-xl border border-white/10 bg-pitch-800 p-3">
            <form action={savePlayer} className="grid items-end gap-3 sm:grid-cols-7">
              <input type="hidden" name="id" value={p.id} />
              <input type="hidden" name="teamId" value={team.id} />
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[10px] uppercase text-white/40">Nombre</label>
                <input name="name" defaultValue={p.name}
                  className="w-full rounded-lg border border-white/15 bg-pitch-900 px-3 py-2 text-sm outline-none focus:border-gold-500" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase text-white/40">N°</label>
                <input name="number" type="number" min={1} max={99} defaultValue={p.number}
                  className="w-full rounded-lg border border-white/15 bg-pitch-900 px-3 py-2 text-sm outline-none focus:border-gold-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[10px] uppercase text-white/40">Posición</label>
                <select name="position" defaultValue={p.position}
                  className="w-full rounded-lg border border-white/15 bg-pitch-900 px-3 py-2 text-sm outline-none focus:border-gold-500">
                  {POSICIONES.map((pos) => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[10px] uppercase text-white/40">Goles</label>
                <input name="goals" type="number" min={0} defaultValue={p.goals}
                  className="w-full rounded-lg border border-white/15 bg-pitch-900 px-3 py-2 text-sm outline-none focus:border-gold-500" />
              </div>
              <div className="flex gap-2">
                <button className="h-9 flex-1 rounded-lg border border-gold-500/50 px-3 text-xs font-bold text-gold-400 hover:bg-gold-500 hover:text-pitch-900">
                  Guardar
                </button>
                <button
                  formAction={deletePlayer}
                  className="h-9 rounded-lg border border-red-500/40 px-3 text-xs font-semibold text-red-300 hover:bg-red-500/10"
                >
                  Borrar
                </button>
              </div>
            </form>
          </div>
        ))}
      </div>

      {/* Eliminar equipo */}
      <form action={deleteTeam} className="mt-12 border-t border-white/10 pt-6">
        <input type="hidden" name="id" value={team.id} />
        <button className="rounded-lg border border-red-500/40 px-5 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/10">
          Eliminar equipo (borra jugadores y partidos asociados)
        </button>
      </form>
    </div>
  );
}
