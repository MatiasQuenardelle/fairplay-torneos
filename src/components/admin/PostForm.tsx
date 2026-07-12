import type { Post } from "@prisma/client";
import { savePost } from "@/app/admin/actions";
import { IMAGENES } from "@/lib/images";

export default function PostForm({ post }: { post?: Post }) {
  return (
    <form action={savePost} className="mt-8 max-w-2xl space-y-5">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-white/70">
          Título
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={post?.title}
          className="w-full rounded-lg border border-white/15 bg-pitch-800 px-4 py-2.5 text-sm outline-none focus:border-gold-500"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="mb-1.5 block text-sm font-medium text-white/70">
          Extracto (resumen corto)
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          required
          defaultValue={post?.excerpt}
          className="w-full rounded-lg border border-white/15 bg-pitch-800 px-4 py-2.5 text-sm outline-none focus:border-gold-500"
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-1.5 block text-sm font-medium text-white/70">
          Contenido (usá **negrita** y *cursiva*)
        </label>
        <textarea
          id="content"
          name="content"
          rows={10}
          required
          defaultValue={post?.content}
          className="w-full rounded-lg border border-white/15 bg-pitch-800 px-4 py-2.5 text-sm outline-none focus:border-gold-500"
        />
      </div>

      <div>
        <label htmlFor="coverImage" className="mb-1.5 block text-sm font-medium text-white/70">
          Imagen de portada
        </label>
        <select
          id="coverImage"
          name="coverImage"
          defaultValue={post?.coverImage ?? IMAGENES[0].src}
          className="w-full rounded-lg border border-white/15 bg-pitch-800 px-4 py-2.5 text-sm outline-none focus:border-gold-500"
        >
          {IMAGENES.map((img) => (
            <option key={img.src} value={img.src}>
              {img.label}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2.5 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published ?? true}
          className="h-4 w-4 accent-gold-500"
        />
        Publicada (visible en el sitio)
      </label>

      <button className="rounded-full bg-gold-500 px-8 py-3 font-bold text-pitch-900 hover:bg-gold-400">
        {post ? "Guardar cambios" : "Crear noticia"}
      </button>
    </form>
  );
}
