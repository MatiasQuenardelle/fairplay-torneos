"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  createSession,
  destroySession,
  requireAdmin,
} from "@/lib/auth";

// ---------- Auth ----------

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const admin = await db.admin.findUnique({ where: { email } });
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    redirect("/admin/login?error=1");
  }

  await createSession({ adminId: admin.id, email: admin.email, name: admin.name });
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// ---------- Helpers ----------

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function revalidateAll() {
  revalidatePath("/", "layout");
}

// ---------- Noticias ----------

export async function savePost(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id") || 0);
  const title = String(formData.get("title") ?? "").trim();
  if (!title) redirect("/admin/noticias");

  const data = {
    title,
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
    coverImage: String(formData.get("coverImage") ?? "/images/poster-torneo-2026.png"),
    published: formData.get("published") === "on",
  };

  if (id) {
    await db.post.update({ where: { id }, data });
  } else {
    let slug = slugify(title);
    const existing = await db.post.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;
    await db.post.create({ data: { ...data, slug } });
  }
  revalidateAll();
  redirect("/admin/noticias");
}

export async function deletePost(formData: FormData) {
  await requireAdmin();
  await db.post.delete({ where: { id: Number(formData.get("id")) } });
  revalidateAll();
}

// ---------- Equipos ----------

export async function saveTeam(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id") || 0);
  const name = String(formData.get("name") ?? "").trim();
  if (!name) redirect("/admin/equipos");

  const data = {
    name,
    shortName: String(formData.get("shortName") ?? "").trim().toUpperCase().slice(0, 3) || name.slice(0, 3).toUpperCase(),
    colorPrimary: String(formData.get("colorPrimary") ?? "#d4a017"),
    categoryId: Number(formData.get("categoryId")),
  };

  if (id) {
    await db.team.update({ where: { id }, data });
    revalidateAll();
    redirect(`/admin/equipos/${id}`);
  } else {
    const team = await db.team.create({ data });
    revalidateAll();
    redirect(`/admin/equipos/${team.id}`);
  }
}

export async function deleteTeam(formData: FormData) {
  await requireAdmin();
  await db.team.delete({ where: { id: Number(formData.get("id")) } });
  revalidateAll();
  redirect("/admin/equipos");
}

// ---------- Jugadores ----------

export async function savePlayer(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id") || 0);
  const teamId = Number(formData.get("teamId"));
  const name = String(formData.get("name") ?? "").trim();
  if (!name) redirect(`/admin/equipos/${teamId}`);

  const data = {
    name,
    number: Number(formData.get("number") || 0),
    position: String(formData.get("position") ?? "Mediocampista"),
    goals: Number(formData.get("goals") || 0),
    teamId,
  };

  if (id) {
    await db.player.update({ where: { id }, data });
  } else {
    await db.player.create({ data });
  }
  revalidateAll();
  redirect(`/admin/equipos/${teamId}`);
}

export async function deletePlayer(formData: FormData) {
  await requireAdmin();
  const player = await db.player.delete({
    where: { id: Number(formData.get("id")) },
  });
  revalidateAll();
  redirect(`/admin/equipos/${player.teamId}`);
}

// ---------- Partidos ----------

export async function createMatch(formData: FormData) {
  await requireAdmin();
  const homeTeamId = Number(formData.get("homeTeamId"));
  const awayTeamId = Number(formData.get("awayTeamId"));
  if (!homeTeamId || !awayTeamId || homeTeamId === awayTeamId) {
    redirect("/admin/partidos?error=equipos");
  }
  const home = await db.team.findUnique({ where: { id: homeTeamId } });
  if (!home) redirect("/admin/partidos");

  await db.match.create({
    data: {
      round: String(formData.get("round") ?? "Fecha").trim() || "Fecha",
      date: new Date(String(formData.get("date")) || Date.now()),
      categoryId: home.categoryId,
      homeTeamId,
      awayTeamId,
    },
  });
  revalidateAll();
  redirect("/admin/partidos");
}

export async function saveResult(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const homeScore = formData.get("homeScore");
  const awayScore = formData.get("awayScore");

  if (homeScore === "" || awayScore === "") {
    // limpiar resultado
    await db.match.update({
      where: { id },
      data: { played: false, homeScore: null, awayScore: null },
    });
  } else {
    await db.match.update({
      where: { id },
      data: {
        played: true,
        homeScore: Math.max(0, Number(homeScore)),
        awayScore: Math.max(0, Number(awayScore)),
      },
    });
  }
  revalidateAll();
}

export async function deleteMatch(formData: FormData) {
  await requireAdmin();
  await db.match.delete({ where: { id: Number(formData.get("id")) } });
  revalidateAll();
}
