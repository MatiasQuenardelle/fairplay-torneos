import Link from "next/link";
import PostForm from "@/components/admin/PostForm";

export default function NuevaNoticia() {
  return (
    <div>
      <Link href="/admin/noticias" className="text-sm text-gold-400 hover:text-gold-300">
        ← Volver a noticias
      </Link>
      <h1 className="mt-4 text-3xl font-black">
        Nueva <span className="text-gold-500">noticia</span>
      </h1>
      <PostForm />
    </div>
  );
}
