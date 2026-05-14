import { prisma } from "../db/prisma.js"

export const createQuestion = async (req, res, next) => {
  try {
    const { letter, question, answer, language, difficulty, categoryId, isPersonal} = req.body;
    if (!letter || !question || !answer || !language || !difficulty || !categoryId || isPersonal === undefined) {
      return res.status(400).json({
        message: "Query debe contener todos: letter, question, answer, language, difficulty, categoryId & isPersonal"
      })
    } 
    const lang = String(language).toUpperCase();
    const ALLOWED_LANG = new Set(["ES", "EN", "FR"]);

    if (!ALLOWED_LANG.has(lang)) {
      return res.status(400).json({ message: "language debe ser ES, EN o FR" });
    }
    const diff = String(difficulty).toLowerCase();
    const ALLOWED_DIFF = new Set(["easy", "medium", "hard"])

    if (!ALLOWED_DIFF.has(diff)) {
      return res.status(400).json({ message: "dificultad debe ser 'easy', 'medium' o 'hard'" });
    }

    const catId = Number(categoryId)
    if (!Number.isInteger(catId) || catId <= 0) {
      return res.status(400).json({ message: "categoryId debe ser un entero positivo" });
    }
    const category = await prisma.category.findUnique({ where: {id: catId }});
    if (!category) return res.status(404).json({ message: "Categoría no encontrada" })

    const status = isPersonal ? "approved" : "pending";

    const pregunta = await prisma.question.create({
      data: {
        letter,
        question,
        answer,
        language: lang,
        difficulty: diff,
        categoryId: catId,
        isPersonal,
        status, 
        createdBy: req.user.userId
      },
      select: {
        id: true, letter: true, question: true, difficulty: true, status: true
      }
    })
    res.status(201).json(pregunta)
  } catch (err) {
    next(err)
  }
}

export const getMyQuestions = async (req, res, next) => {
  try {
    const questions = await prisma.question.findMany({
      where: { createdBy: req.user.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, letter: true, question: true, answer: true, language: true, difficulty: true, categoryId: true,
        isPersonal: true, status: true, createdAt: true
      }
    });

    res.status(200).json(questions);
  } catch (err) {
    next(err)
  }
}