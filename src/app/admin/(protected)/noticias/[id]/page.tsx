import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import PostForm from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function EditarNoticia({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await db.post.findUnique({ where: { id: Number(id) || 0 } });
  if (!post) notFound();

  return (
    <div>
      <Link href="/admin/noticias" className="text-sm text-gold-400 hover:text-gold-300">
        ← Volver a noticias
      </Link>
      <h1 className="mt-4 text-3xl font-black">
        Editar <span className="text-gold-500">noticia</span>
      </h1>
      <PostForm post={post} />
    </div>
  );
}
