import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const POSICIONES = ["Arquero", "Defensor", "Mediocampista", "Delantero"];

const NOMBRES = [
  "Juan Gómez", "Lucas Fernández", "Matías Benítez", "Franco Acosta", "Nicolás Romero",
  "Gonzalo Vera", "Emanuel Ríos", "Brian Sosa", "Kevin Martínez", "Axel González",
  "Facundo López", "Ramiro Duarte", "Cristian Ojeda", "Leandro Aguirre", "Diego Cabrera",
  "Sebastián Núñez", "Marcos Ledesma", "Iván Barrios", "Tomás Escobar", "Agustín Meza",
  "Rodrigo Paredes", "Damián Cáceres", "Federico Alegre", "Enzo Villalba", "Maximiliano Ayala",
  "Pablo Insaurralde", "Gastón Monzón", "Elías Retamozo", "Joaquín Zárate", "Santiago Roldán",
];

function jugadores(teamIdx: number, count = 10) {
  const players = [];
  for (let i = 0; i < count; i++) {
    const nombre = NOMBRES[(teamIdx * 7 + i * 3) % NOMBRES.length];
    players.push({
      name: nombre,
      number: i + 1,
      position: i === 0 ? "Arquero" : POSICIONES[1 + ((teamIdx + i) % 3)],
      goals: i > 5 ? ((teamIdx + i) % 4) + 1 : (teamIdx + i) % 2,
    });
  }
  return players;
}

async function main() {
  await prisma.post.deleteMany();
  await prisma.match.deleteMany();
  await prisma.player.deleteMany();
  await prisma.team.deleteMany();
  await prisma.category.deleteMany();
  await prisma.admin.deleteMany();

  // Admin
  await prisma.admin.create({
    data: {
      email: "admin@fairplay.com",
      name: "Prof. Ignacio Rudaz",
      passwordHash: await bcrypt.hash("fairplay2026", 10),
    },
  });

  // Categorías
  const catA = await prisma.category.create({ data: { name: "Categoría A", slug: "a" } });
  const catB = await prisma.category.create({ data: { name: "Categoría B", slug: "b" } });
  const catC = await prisma.category.create({ data: { name: "Categoría C", slug: "c" } });

  // Equipos
  const equiposA = [
    { name: "Palermo II FC", shortName: "PAL", colorPrimary: "#1e6fd9" },
    { name: "B.C.N.", shortName: "BCN", colorPrimary: "#1a1a2e" },
    { name: "Premier FC", shortName: "PRE", colorPrimary: "#7ec8e3" },
    { name: "Deportivo 1996", shortName: "D96", colorPrimary: "#2d7a2d" },
    { name: "San Diego FC", shortName: "SDG", colorPrimary: "#c0392b" },
    { name: "Atlético Fontana", shortName: "FON", colorPrimary: "#8e44ad" },
    { name: "Juventud Unida", shortName: "JUV", colorPrimary: "#e67e22" },
    { name: "Defensores del Chaco", shortName: "DEF", colorPrimary: "#16a085" },
  ];
  const equiposB = [
    { name: "Villa Libertad", shortName: "VLI", colorPrimary: "#2980b9" },
    { name: "Sportivo Barranqueras", shortName: "SBA", colorPrimary: "#d35400" },
    { name: "Racing de Resistencia", shortName: "RAC", colorPrimary: "#27ae60" },
    { name: "Central Norte", shortName: "CNO", colorPrimary: "#34495e" },
    { name: "Estrella del Sur", shortName: "EDS", colorPrimary: "#f1c40f" },
    { name: "Unión Vilelas", shortName: "UVI", colorPrimary: "#9b59b6" },
  ];
  const equiposC = [
    { name: "Los Halcones", shortName: "HAL", colorPrimary: "#7f8c8d" },
    { name: "El Ciclón del Norte", shortName: "CIC", colorPrimary: "#c0392b" },
    { name: "Deportivo Toba", shortName: "TOB", colorPrimary: "#2c3e50" },
    { name: "Amistad FC", shortName: "AMI", colorPrimary: "#e74c3c" },
  ];

  const teamsA = [];
  for (let i = 0; i < equiposA.length; i++) {
    teamsA.push(
      await prisma.team.create({
        data: {
          ...equiposA[i],
          categoryId: catA.id,
          players: { create: jugadores(i) },
        },
      })
    );
  }
  for (let i = 0; i < equiposB.length; i++) {
    await prisma.team.create({
      data: {
        ...equiposB[i],
        categoryId: catB.id,
        players: { create: jugadores(i + 8, 8) },
      },
    });
  }
  for (let i = 0; i < equiposC.length; i++) {
    await prisma.team.create({
      data: {
        ...equiposC[i],
        categoryId: catC.id,
        players: { create: jugadores(i + 14, 8) },
      },
    });
  }

  // Lautaro Ozuna — mejor arquero del torneo (Palermo II)
  await prisma.player.updateMany({
    where: { teamId: teamsA[0].id, number: 1 },
    data: { name: "Lautaro Ozuna", position: "Arquero" },
  });

  // Fixture categoría A: 5 fechas jugadas + fecha 6 por jugar
  // Resultados fijos para que la tabla sea verificable
  const resultados: [number, number, number, number][][] = [
    // [homeIdx, awayIdx, homeScore, awayScore] por fecha
    [ [0, 1, 3, 1], [2, 3, 2, 2], [4, 5, 1, 0], [6, 7, 0, 2] ],
    [ [1, 2, 0, 2], [3, 4, 1, 1], [5, 6, 2, 1], [7, 0, 1, 4] ],
    [ [0, 2, 2, 0], [1, 3, 3, 2], [4, 6, 2, 2], [5, 7, 0, 1] ],
    [ [2, 4, 3, 1], [3, 5, 2, 0], [6, 1, 1, 3], [7, 0, 0, 0] ],
    [ [0, 3, 5, 1], [1, 4, 2, 1], [2, 5, 4, 0], [6, 7, 2, 3] ],
  ];
  const base = new Date("2026-06-07T16:00:00-03:00");
  for (let f = 0; f < resultados.length; f++) {
    for (const [h, a, hs, as] of resultados[f]) {
      await prisma.match.create({
        data: {
          round: `Fecha ${f + 1}`,
          date: new Date(base.getTime() + f * 7 * 24 * 3600 * 1000),
          played: true,
          homeScore: hs,
          awayScore: as,
          categoryId: catA.id,
          homeTeamId: teamsA[h].id,
          awayTeamId: teamsA[a].id,
        },
      });
    }
  }
  // Fecha 6 (próxima, sin jugar)
  const proxima: [number, number][] = [ [3, 0], [4, 1], [5, 2], [7, 6] ];
  for (const [h, a] of proxima) {
    await prisma.match.create({
      data: {
        round: "Fecha 6",
        date: new Date("2026-07-19T16:00:00-03:00"),
        played: false,
        categoryId: catA.id,
        homeTeamId: teamsA[h].id,
        awayTeamId: teamsA[a].id,
      },
    });
  }

  // Posts de blog
  await prisma.post.createMany({
    data: [
      {
        title: "¡Arrancó la Copa Mundial de Clubes 2026!",
        slug: "arranco-la-copa-mundial-de-clubes-2026",
        excerpt:
          "Comenzó el Torneo Apertura más esperado del año. Más de 18 equipos de toda la región compiten en tres categorías por levantar la copa.",
        content:
          "El fin de semana pasado dio inicio oficial el **Torneo Regional 2026 — Copa Mundial de Clubes**, la competencia más grande del Nordeste.\n\nCon más de 18 equipos distribuidos en las categorías A, B y C, el torneo promete un semestre a puro fútbol en las canchas de Resistencia y alrededores.\n\nComo siempre, desde FairPlay apostamos al **fútbol amateur a nivel profesional**: árbitros oficiales, cobertura fotográfica, premios individuales y la transmisión de las finales en vivo.\n\n¡Que gane el mejor y que reine el juego limpio!",
        coverImage: "/images/poster-torneo-2026.png",
        publishedAt: new Date("2026-06-01T10:00:00-03:00"),
      },
      {
        title: "Semifinales: goleada 5-1 y boleto a la gran final",
        slug: "semifinales-goleada-y-boleto-a-la-gran-final",
        excerpt:
          "Deportivo 1996 aplastó a B.C.N. por 5 a 1 en una tarde inolvidable y se metió en la definición del Torneo Apertura, Categoría C.",
        content:
          "En una de las semifinales más contundentes que se recuerden, **Deportivo 1996** superó por **5 a 1** a **B.C.N.** y selló su pasaje a la gran final de la Categoría C.\n\nEl conjunto verdinegro fue superior de principio a fin, con una actuación consagratoria de su delantera.\n\nLa final se jugará el próximo domingo en el Club Fontana desde las 20:30 hs. ¡No te la pierdas!",
        coverImage: "/images/semifinal-5-1.png",
        publishedAt: new Date("2026-06-24T18:00:00-03:00"),
      },
      {
        title: "Lautaro Ozuna, elegido Mejor Arquero del Torneo",
        slug: "lautaro-ozuna-mejor-arquero-del-torneo",
        excerpt:
          "El guardameta de Palermo II FC se quedó con el premio individual al mejor arquero de la Categoría A en el Apertura 2026.",
        content:
          "**Lautaro Ozuna**, arquero de **Palermo II FC**, fue distinguido con el premio al **Mejor Arquero del Torneo** en la Categoría A del Apertura 2026.\n\nCon actuaciones decisivas fecha tras fecha y la valla menos vencida del campeonato, Ozuna se ganó el reconocimiento de rivales y organizadores.\n\nDesde FairPlay felicitamos a Lautaro y a todos los jugadores que hacen grande este torneo. Los premios individuales son parte de nuestra apuesta por darle al fútbol amateur un marco profesional.",
        coverImage: "/images/mejor-arquero-ozuna.png",
        publishedAt: new Date("2026-07-01T12:00:00-03:00"),
      },
      {
        title: "Se viene la Gran Final de la Categoría B",
        slug: "gran-final-categoria-b",
        excerpt:
          "Este domingo desde las 20:30 hs en el Club Fontana se define el campeón del Torneo Apertura — Copa Mundial de Clubes 2026, Categoría B.",
        content:
          "Llega el momento más esperado: la **Gran Final de la Categoría B** del Torneo Apertura — Copa Mundial de Clubes 2026.\n\n**Día:** Domingo\n**Hora:** 20:30 hs\n**Sede:** Club Fontana\n\nEl torneo más grande del Nordeste corona a un nuevo campeón. Habrá cobertura fotográfica completa, transmisión en vivo por nuestro Instagram y premios para el campeón y el subcampeón.\n\n¡Los esperamos a todos para vivir una verdadera fiesta del fútbol regional!",
        coverImage: "/images/gran-final-categoria-b.png",
        publishedAt: new Date("2026-07-08T09:00:00-03:00"),
      },
    ],
  });

  console.log("Seed completado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
