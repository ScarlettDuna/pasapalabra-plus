import { prisma } from "../db/prisma.js";

export const getPendingQuestions = async (req, res, next) => {
  try {
    const preguntas = await prisma.question.findMany({
      where: { status: "pending" },
      include: {
        creator: { select: { id: true, username: true} },
        category: { select: { id: true, name: true } }
      }
    })
    res.status(200).json({ "preguntas": preguntas})
  } catch (err) {
    next(err)
  }
}

export const approveQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pregunta = await prisma.question.findUnique({
      where: { id: id }
    })
    if (!pregunta) return res.status(404).json({ message: "Pregunta no encontrada" })

    const updated = await prisma.question.update({
      where: { id: id },
      data: { status: "approved" },
      select: { id: true, status: true }
    })

    res.status(200).json(updated)
  } catch (err) {
    next(err)
  }
}

export const rejectQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pregunta = await prisma.question.findUnique({ where: { id: id }})
    if (!pregunta) return res.status(404).json({ message: "Pregunta no encontrada" })

    const updated = await prisma.question.update({
      where: { id: id },
      data: { status: "rejected" },
      select: { id: true, status: true }
    })

    res.status(200).json(updated)
  } catch (err) {
    next(err)
  }
}