import { db } from "./db";

export type StandingRow = {
  teamId: number;
  name: string;
  shortName: string;
  colorPrimary: string;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  dif: number;
  pts: number;
};

export async function getStandings(categoryId: number): Promise<StandingRow[]> {
  const teams = await db.team.findMany({ where: { categoryId } });
  const matches = await db.match.findMany({
    where: { categoryId, played: true },
  });

  const rows = new Map<number, StandingRow>();
  for (const t of teams) {
    rows.set(t.id, {
      teamId: t.id,
      name: t.name,
      shortName: t.shortName,
      colorPrimary: t.colorPrimary,
      pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dif: 0, pts: 0,
    });
  }

  for (const m of matches) {
    if (m.homeScore == null || m.awayScore == null) continue;
    const home = rows.get(m.homeTeamId);
    const away = rows.get(m.awayTeamId);
    if (!home || !away) continue;

    home.pj++; away.pj++;
    home.gf += m.homeScore; home.gc += m.awayScore;
    away.gf += m.awayScore; away.gc += m.homeScore;

    if (m.homeScore > m.awayScore) {
      home.pg++; home.pts += 3; away.pp++;
    } else if (m.homeScore < m.awayScore) {
      away.pg++; away.pts += 3; home.pp++;
    } else {
      home.pe++; away.pe++; home.pts++; away.pts++;
    }
  }

  const result = [...rows.values()];
  for (const r of result) r.dif = r.gf - r.gc;
  result.sort(
    (a, b) => b.pts - a.pts || b.dif - a.dif || b.gf - a.gf || a.name.localeCompare(b.name)
  );
  return result;
}
