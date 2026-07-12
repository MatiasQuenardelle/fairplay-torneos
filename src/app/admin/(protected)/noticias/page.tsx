import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { deletePost } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminNoticias() {
  const posts = await db.post.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">
          <span className="text-gold-500">Noticias</span>
        </h1>
        <Link
          href="/admin/noticias/nueva"
          className="rounded-full bg-gold-500 px-5 py-2 text-sm font-bold text-pitch-900 hover:bg-gold-400"
        >
          + Nueva noticia
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {posts.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 rounded-xl border border-white/10 bg-pitch-800 p-3"
          >
            <div className="relative hidden h-16 w-24 shrink-0 overflow-hidden rounded-lg sm:block">
              <Image src={p.coverImage} alt="" fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{p.title}</p>
              <p className="mt-0.5 text-xs text-white/50">
                {new Date(p.publishedAt).toLocaleDateString("es-AR")} ·{" "}
                {p.published ? (
                  <span className="text-green-400">Publicada</span>
                ) : (
                  <span className="text-yellow-400">Borrador</span>
                )}
              </p>
            </div>
            <Link
              href={`/admin/noticias/${p.id}`}
              className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold hover:bg-white/10"
            >
              Editar
            </Link>
            <form action={deletePost}>
              <input type="hidden" name="id" value={p.id} />
              <button className="rounded-lg border border-red-500/40 px-4 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/10">
                Eliminar
              </button>
            </form>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="text-white/50">No hay noticias todavía.</p>
        )}
      </div>
    </div>
  );
}
