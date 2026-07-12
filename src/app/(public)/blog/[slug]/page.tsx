import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function renderMarkdown(content: string) {
  // Render minimalista: párrafos, **negrita** y *cursiva*
  return content.split(/\n\n+/).map((para, i) => {
    const html = para
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>");
    return (
      <p
        key={i}
        className="leading-relaxed text-white/80"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await db.post.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 pt-28 pb-20">
      <Link href="/blog" className="text-sm text-gold-400 hover:text-gold-300">
        ← Volver a noticias
      </Link>
      <p className="mt-6 text-xs uppercase tracking-widest text-gold-400">
        {new Date(post.publishedAt).toLocaleDateString("es-AR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight">
        {post.title}
      </h1>
      <p className="mt-4 text-lg text-white/60">{post.excerpt}</p>

      <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl border border-white/10">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="mt-10 space-y-5 text-[1.05rem]">
        {renderMarkdown(post.content)}
      </div>
    </article>
  );
}
