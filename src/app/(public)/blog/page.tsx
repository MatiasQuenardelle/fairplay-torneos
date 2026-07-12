import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Noticias | FairPlay Torneos",
};

export default async function BlogPage() {
  const posts = await db.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-20">
      <h1 className="text-4xl font-black tracking-tight">
        <span className="gold-gradient-text">Noticias</span> del torneo
      </h1>
      <p className="mt-2 text-white/60">
        Resultados, premios, finales y todo lo que pasa en FairPlay
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              <h2 className="mt-2 text-lg font-bold leading-snug group-hover:text-gold-300">
                {p.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-white/60">
                {p.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="mt-12 text-center text-white/50">
          Todavía no hay noticias publicadas.
        </p>
      )}
    </div>
  );
}
