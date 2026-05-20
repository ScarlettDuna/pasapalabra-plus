import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/db/prisma.js";

const TEST_EMAIL = "vitest_user@test.internal";
const TEST_USER = {
  username: "vitest_user",
  email: TEST_EMAIL,
  password: "testpass123",
};

let token;
let refreshToken;
let gameId;
let questions;

beforeAll(async () => {
  const user = await prisma.user.findUnique({ where: { email: TEST_EMAIL } });
  if (user) {
    await prisma.userAchievement.deleteMany({ where: { userId: user.id } });
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
  }
  await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
});

afterAll(async () => {
  const user = await prisma.user.findUnique({ where: { email: TEST_EMAIL } });
  if (user) {
    await prisma.userAchievement.deleteMany({ where: { userId: user.id } });
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
  }
  await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
  await prisma.$disconnect();
});

describe("Auth", () => {
  it("POST /api/auth/register → 201", async () => {
    const res = await request(app).post("/api/auth/register").send(TEST_USER);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  it("POST /api/auth/login → 200 con token y refreshToken", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: TEST_EMAIL,
      password: TEST_USER.password,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("refreshToken");
    token = res.body.token;
    refreshToken = res.body.refreshToken;
  });

  it("POST /api/auth/login con contraseña incorrecta → 401", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: TEST_EMAIL,
      password: "wrongpassword",
    });
    expect(res.status).toBe(401);
  });

  it("POST /api/auth/refresh → 200 con nuevo token", async () => {
    const res = await request(app).post("/api/auth/refresh").send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});

describe("Games", () => {
  it("POST /api/games/start → 201 con gameId y questions", async () => {
    const catRes = await request(app).get("/api/categories?language=ES");
    const categoryId = catRes.body[0]?.id;
    expect(categoryId).toBeDefined();

    const res = await request(app)
      .post("/api/games/start")
      .set("Authorization", `Bearer ${token}`)
      .send({ language: "ES", difficulty: "easy", categoryId });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("gameId");
    expect(Array.isArray(res.body.questions)).toBe(true);
    gameId = res.body.gameId;
    questions = res.body.questions;
  });

  it("POST /api/games/:id/finish → 201 con score", async () => {
    const answers = questions.map(q => ({ questionId: q.questionId, answer: "" }));

    const res = await request(app)
      .post(`/api/games/${gameId}/finish`)
      .set("Authorization", `Bearer ${token}`)
      .send({ answers });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("score");
  });
});

describe("Ranking", () => {
  it("GET /api/ranking → 200 con array", async () => {
    const res = await request(app).get("/api/ranking?language=ES");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});