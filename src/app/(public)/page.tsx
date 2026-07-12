import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { getStandings } from "@/lib/standings";
import TeamBadge from "@/components/TeamBadge";

export const dynamic = "force-dynamic";

const GALERIA = [
  { src: "/images/festejo-campeon.png", alt: "Festejo del campeón con la copa" },
  { src: "/images/entrada-equipos.png", alt: "Entrada de los equipos a la cancha" },
  { src: "/images/equipo-blanco-rojo.png", alt: "Equipo saliendo a la cancha" },
  { src: "/images/equipos-arbitros.png", alt: "Equipos y árbitros antes del partido" },
  { src: "/images/jugadores-jovenes.png", alt: "Jugadores juveniles del torneo" },
  { src: "/images/banner-adversarios.png", alt: "Solo somos adversarios deportivos" },
];

export default async function Home() {
  const [teamCount, playerCount, playedCount, categories, posts] =
    await Promise.all([
      db.team.count(),
      db.player.count(),
      db.match.count({ where: { played: true } }),
      db.category.findMany({ include: { _count: { select: { teams: true } } } }),
      db.post.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
    ]);

  const catA = categories.find((c) => c.slug === "a");
  const standings = catA ? (await getStandings(catA.id)).slice(0, 5) : [];
  const ultimos = catA
    ? await db.match.findMany({
        where: { categoryId: catA.id, played: true },
        orderBy: { date: "desc" },
        take: 4,
        include: { homeTeam: true, awayTeam: true },
      })
    : [];

  return (
    <div>
      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <Image
          src="/images/entrada-equipos.png"
          alt="Entrada de los equipos a la cancha"
          fill
          priority
          className="object-cover object-top opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pitch-900/70 via-pitch-900/40 to-pitch-900" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 pt-24 pb-16 text-center">
          <div className="animate-fade-up mx-auto mb-6 w-fit rounded-full border border-gold-500/40 bg-pitch-900/60 px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-gold-400 backdrop-blur">
            Torneo Regional 2026 — Chaco
          </div>
          <h1 className="animate-fade-up delay-100 text-5xl font-black leading-tight tracking-tight md:text-7xl">
            El torneo más grande <br />
            <span className="gold-gradient-text">del Nordeste</span>
          </h1>
          <p className="animate-fade-up delay-200 mx-auto mt-6 max-w-2xl text-lg text-white/75 md:text-xl">
            Fútbol amateur a nivel profesional. Árbitros oficiales, cobertura
            fotográfica, premios individuales y la pasión de más de{" "}
            {teamCount} equipos de toda la región.
          </p>
          <div className="animate-fade-up delay-300 mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/posiciones"
              className="rounded-full bg-gold-500 px-8 py-3.5 font-bold text-pitch-900 shadow-lg shadow-gold-500/25 transition hover:bg-gold-400"
            >
              Ver tabla de posiciones
            </Link>
            <Link
              href="/blog"
              className="rounded-full border border-white/25 bg-white/5 px-8 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/15"
            >
              Últimas noticias
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-gold-500/20 bg-pitch-800">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 text-center md:grid-cols-4">
          {[
            { n: teamCount, label: "Equipos" },
            { n: playerCount, label: "Jugadores" },
            { n: playedCount, label: "Partidos jugados" },
            { n: categories.length, label: "Categorías" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-black text-gold-500 md:text-5xl">
                {s.n}
              </p>
              <p className="mt-1 text-sm uppercase tracking-widest text-white/60">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TORNEO 2026 */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold-500/30 shadow-2xl shadow-gold-500/10">
            <Image
              src="/images/poster-torneo-2026.png"
              alt="Copa Mundial de Clubes 2026"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold-400">
              Edición Apertura 2026
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Copa Mundial de <span className="gold-gradient-text">Clubes 2026</span>
            </h2>
            <p className="mt-4 leading-relaxed text-white/70">
              La competencia insignia de FairPlay: tres categorías, fixture
              completo, finales en escenarios de primer nivel y todos los
              partidos con cobertura profesional. Porque solo somos{" "}
              <em>adversarios deportivos</em>: acá gana el fútbol y gana el
              juego limpio.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/posiciones?categoria=${c.slug}`}
                  className="rounded-xl border border-white/10 bg-pitch-800 p-4 text-center transition hover:border-gold-500/50 hover:bg-pitch-700"
                >
                  <p className="text-2xl font-black text-gold-500 uppercase">
                    {c.slug}
                  </p>
                  <p className="mt-1 text-xs text-white/60">
                    {c._count.teams} equipos
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RESULTADOS + MINI TABLA */}
      <section className="bg-pitch-800/60 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Últimos <span className="text-gold-500">resultados</span>
            </h2>
            <p className="mt-1 text-sm text-white/50">Categoría A</p>
            <div className="mt-6 space-y-3">
              {ultimos.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-pitch-900 px-4 py-3"
                >
                  <div className="flex flex-1 items-center gap-2">
                    <TeamBadge shortName={m.homeTeam.shortName} color={m.homeTeam.colorPrimary} size={32} />
                    <span className="truncate text-sm font-medium">{m.homeTeam.name}</span>
                  </div>
                  <span className="mx-3 rounded-lg bg-gold-500 px-3 py-1 text-sm font-black text-pitch-900">
                    {m.homeScore} - {m.awayScore}
                  </span>
                  <div className="flex flex-1 items-center justify-end gap-2">
                    <span className="truncate text-sm font-medium">{m.awayTeam.name}</span>
                    <TeamBadge shortName={m.awayTeam.shortName} color={m.awayTeam.colorPrimary} size={32} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Tabla de <span className="text-gold-500">posiciones</span>
            </h2>
            <p className="mt-1 text-sm text-white/50">Top 5 — Categoría A</p>
            <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-pitch-700 text-xs uppercase tracking-wider text-white/60">
                  <tr>
                    <th className="px-3 py-2.5 text-left">#</th>
                    <th className="px-3 py-2.5 text-left">Equipo</th>
                    <th className="px-3 py-2.5 text-center">PJ</th>
                    <th className="px-3 py-2.5 text-center">DIF</th>
                    <th className="px-3 py-2.5 text-center">PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((r, i) => (
                    <tr
                      key={r.teamId}
                      className="border-t border-white/5 bg-pitch-900"
                    >
                      <td className="px-3 py-2.5 font-bold text-gold-500">{i + 1}</td>
                      <td className="px-3 py-2.5">
                        <span className="flex items-center gap-2">
                          <TeamBadge shortName={r.shortName} color={r.colorPrimary} size={26} />
                          <span className="font-medium">{r.name}</span>
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center text-white/70">{r.pj}</td>
                      <td className="px-3 py-2.5 text-center text-white/70">{r.dif > 0 ? `+${r.dif}` : r.dif}</td>
                      <td className="px-3 py-2.5 text-center font-black text-gold-400">{r.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link
              href="/posiciones"
              className="mt-4 inline-block text-sm font-semibold text-gold-400 hover:text-gold-300"
            >
              Ver tabla completa →
            </Link>
          </div>
        </div>
      </section>

      {/* NOTICIAS */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight">
              Últimas <span className="text-gold-500">noticias</span>
            </h2>
            <p className="mt-1 text-white/50">
              Todo lo que pasa dentro y fuera de la cancha
            </p>
          </div>
          <Link href="/blog" className="text-sm font-semibold text-gold-400 hover:text-gold-300">
            Ver todas →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/blog/${p.slug}`}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-pitch-800 transition hover:border-gold-500/40"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={p.coverImage}
                  alt={p.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-widest text-gold-400">
                  {new Date(p.publishedAt).toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <h3 className="mt-2 font-bold leading-snug group-hover:text-gold-300">
                  {p.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-white/60">
                  {p.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* GALERIA */}
      <section className="bg-pitch-800/60 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-black tracking-tight">
            La pasión en <span className="text-gold-500">imágenes</span>
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
            {GALERIA.map((g) => (
              <div
                key={g.src}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10"
              >
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pitch-900/70 to-transparent opacity-0 transition group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-600/20 via-pitch-900 to-pitch-900" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-4xl font-black tracking-tight">
            ¿Querés inscribir a <span className="gold-gradient-text">tu equipo</span>?
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Sumate al próximo torneo. Escribinos y asegurá tu lugar en la
            competencia más importante de la región.
          </p>
          <a
            href="https://wa.me/543624227512?text=Hola!%20Quiero%20inscribir%20mi%20equipo%20en%20el%20torneo%20FairPlay"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-gold-500 px-10 py-4 text-lg font-bold text-pitch-900 shadow-xl shadow-gold-500/25 transition hover:bg-gold-400"
          >
            Escribinos por WhatsApp
          </a>
          <p className="mt-4 text-sm text-white/50">
            Prof. Ignacio Rudaz — 3624-227512
          </p>
        </div>
      </section>
    </div>
  );
}
