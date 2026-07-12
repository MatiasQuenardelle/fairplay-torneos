import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-pitch-800">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="FairPlay"
              width={48}
              height={48}
              className="rounded-full bg-white p-0.5"
            />
            <div>
              <p className="text-lg font-extrabold">
                Fair<span className="text-gold-500">Play</span>
              </p>
              <p className="text-xs text-white/60">Juego Limpio</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Fútbol amateur a nivel profesional. Organizamos los torneos
            regionales más grandes del Nordeste argentino.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-gold-400">
            Secciones
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link href="/posiciones" className="hover:text-gold-400">Tabla de posiciones</Link></li>
            <li><Link href="/equipos" className="hover:text-gold-400">Equipos y planteles</Link></li>
            <li><Link href="/blog" className="hover:text-gold-400">Noticias</Link></li>
            <li><Link href="/admin" className="hover:text-gold-400">Acceso administrador</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-gold-400">
            Contacto
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <a href="https://wa.me/543624227512" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400">
                WhatsApp: 3624-227512 (Prof. Ignacio Rudaz)
              </a>
            </li>
            <li>
              <a href="https://instagram.com/fairplay.juegolimpio" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400">
                Instagram: @fairplay.juegolimpio
              </a>
            </li>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400">
                Facebook: Agencia De Eventos De Fútbol &quot;Fair Play&quot;
              </a>
            </li>
            <li>Resistencia, Chaco — Argentina</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © 2026 FairPlay — Juego Limpio. El torneo más grande del Nordeste.
      </div>
    </footer>
  );
}
