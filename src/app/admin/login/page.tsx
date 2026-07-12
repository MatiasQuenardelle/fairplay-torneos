import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { login } from "../actions";

export const metadata = {
  title: "Acceso Administrador | FairPlay",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/admin");
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="FairPlay"
            width={72}
            height={72}
            className="mx-auto rounded-full bg-white p-1"
          />
          <h1 className="mt-4 text-2xl font-black">
            Panel de <span className="text-gold-500">administración</span>
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Acceso exclusivo para organizadores
          </p>
        </div>

        {error && (
          <p className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
            Email o contraseña incorrectos.
          </p>
        )}

        <form action={login} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/70">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@fairplay.com"
              className="w-full rounded-lg border border-white/15 bg-pitch-800 px-4 py-2.5 text-sm outline-none transition focus:border-gold-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white/70">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/15 bg-pitch-800 px-4 py-2.5 text-sm outline-none transition focus:border-gold-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-gold-500 py-3 font-bold text-pitch-900 transition hover:bg-gold-400"
          >
            Ingresar
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/40">
          Demo: admin@fairplay.com / fairplay2026
        </p>
        <p className="mt-3 text-center">
          <Link href="/" className="text-sm text-gold-400 hover:text-gold-300">
            ← Volver al sitio
          </Link>
        </p>
      </div>
    </div>
  );
}
