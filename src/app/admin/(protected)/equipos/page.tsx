import Link from "next/link";
import { db } from "@/lib/db";
import { saveTeam } from "../../actions";
import TeamBadge from "@/components/TeamBadge";

export const dynamic = "force-dynamic";

export default async function AdminEquipos() {
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
    <div>
      <h1 className="text-3xl font-black">
        Equipos y <span className="text-gold-500">jugadores</span>
      </h1>

      {/* Crear equipo */}
      <form
        action={saveTeam}
        className="mt-8 grid max-w-3xl gap-3 rounded-2xl border border-white/10 bg-pitch-800 p-5 sm:grid-cols-5"
      >
        <div className="sm:col-span-2">
          <label htmlFor="name" className="mb-1 block text-xs text-white/60">Nombre del equipo</label>
          <input id="name" name="name" required placeholder="Ej: Atlético Chaco"
            className="w-full rounded-lg border border-white/15 bg-pitch-900 px-3 py-2 text-sm outline-none focus:border-gold-500" />
        </div>
        <div>
          <label htmlFor="shortName" className="mb-1 block text-xs text-white/60">Sigla (3)</label>
          <input id="shortName" name="shortName" maxLength={3} placeholder="ACH"
            className="w-full rounded-lg border border-white/15 bg-pitch-900 px-3 py-2 text-sm uppercase outline-none focus:border-gold-500" />
        </div>
        <div>
          <label htmlFor="categoryId" className="mb-1 block text-xs text-white/60">Categoría</label>
          <select id="categoryId" name="categoryId"
            className="w-full rounded-lg border border-white/15 bg-pitch-900 px-3 py-2 text-sm outline-none focus:border-gold-500">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label htmlFor="colorPrimary" className="mb-1 block text-xs text-white/60">Color</label>
            <input id="colorPrimary" name="colorPrimary" type="color" defaultValue="#d4a017"
              className="h-9 w-full cursor-pointer rounded-lg border border-white/15 bg-pitch-900" />
          </div>
          <button className="h-9 rounded-lg bg-gold-500 px-4 text-sm font-bold text-pitch-900 hover:bg-gold-400">
            Crear
          </button>
        </div>
      </form>

      {categories.map((c) => (
        <section key={c.id} className="mt-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gold-400">
            {c.name} · {c.teams.length} equipos
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {c.teams.map((t) => (
              <Link
                key={t.id}
                href={`/admin/equipos/${t.id}`}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-pitch-800 p-4 transition hover:border-gold-500/50"
              >
                <TeamBadge shortName={t.shortName} color={t.colorPrimary} size={40} />
                <div className="min-w-0">
                  <p className="truncate font-bold">{t.name}</p>
                  <p className="text-xs text-white/50">
                    {t._count.players} jugadores · Editar →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
