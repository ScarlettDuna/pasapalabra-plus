import { prisma } from "../db/prisma.js";

async function grantAchievement(userId, achievement, tx = prisma) {
  try {
    await tx.userAchievement.create({
      data: { userId, achievement }
    })
  } catch {

  }
}

export async function checkAndGrantAchievements(userId) {
  // ── Partidas jugadas ─────────────────────────────────────────────────────
  const totalGames = await prisma.game.count({
    where: { userId, endedAt: { not: null } }
  });

  if (totalGames >= 1) await grantAchievement(userId, "FIRST_GAME");
  if (totalGames >= 5) await grantAchievement(userId, "NEWBIE");
  if (totalGames >= 25) await grantAchievement(userId, "SENIOR");
  if (totalGames >= 50) await grantAchievement(userId, "ADDICTED");
  if (totalGames >= 200) await grantAchievement(userId, "LORD_OF_THE_WORDS");

  // ── Rendimiento ──────────────────────────────────────────────────────────────
  const lastScore = await prisma.score.findFirst({
    where: { game: { userId } },
    orderBy: { createdAt: "desc" }
  });

  if (lastScore) {
    if (lastScore.correct === 26) await grantAchievement(userId, "PERFECT_GAME");
    if (lastScore.score > 2000) await grantAchievement(userId, "SHARPSHOOTER");
    if (lastScore.duration < 180) await grantAchievement(userId, "SPEED_DEMON");
  }

  // ── Exploración ───────────────────────────────────────────────────────────────
  const languages = await prisma.game.findMany({
    where: { userId, endedAt: { not: null } },
    select: { language: true },
    distinct: ["language"]
  });
  if (languages.length >= 3) await grantAchievement(userId, "POLYGLOT");

  const categories = await prisma.game.findMany({
    where: { userId, endedAt: { not: null } },
    select: { categoryId: true },
    distinct: ["categoryId"]
  });
  if (categories.length >= 3) await grantAchievement(userId, "EXPLORER");

  // ── Contribución ──────────────────────────────────────────────────────────────
  const questions = await prisma.question.count({
    where: { createdBy: userId }
  });
  if (questions >= 1) await grantAchievement(userId, "CONTRIBUTOR");
  if (questions >= 5) await grantAchievement(userId, "EDITOR");

  if (lastScore) {
    await checkDictionaryKing(userId, lastScore.score);
  }
}

async function checkDictionaryKing(userId, scoreValue) {
  // ¿Es este score el más alto global?
  const topScore = await prisma.score.findFirst({
    orderBy: { score: "desc" },
    include: { game: { select: { userId: true } } }
  });

  if (!topScore || topScore.game.userId !== userId) return;

  // Revocar al anterior rey (si existe y es diferente)
  const currentKing = await prisma.userAchievement.findFirst({
    where: { achievement: "DICTIONARY_KING", revokedAt: null },
  });

  if (currentKing && currentKing.userId === userId) return; // ya es el rey

  if (currentKing) {
    await prisma.userAchievement.update({
      where: { id: currentKing.id },
      data: { revokedAt: new Date() }
    });
  }

  // Otorgar al nuevo rey
  await prisma.userAchievement.create({
    data: { userId, achievement: "DICTIONARY_KING" }
  });
}