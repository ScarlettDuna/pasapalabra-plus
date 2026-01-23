import { prisma } from "../db/prisma.js";

export const getRanking = async (req, res, next) => {
    try {
        const { language, category } = req.query;

        if (!language) {
            return res.status(400).json({ message: "Query param 'language' es obligatorio" })
        }

        const lang = String(language).toUpperCase();
        const allowed = new Set(["ES", "EN", "FR"]);

        if (!allowed.has(lang)) {
            return res.status(400).json({ message: "language debe ser ES, EN o FR" });
        }

        const categ = Number(category)
        const categoryExists = await prisma.category.findUnique({
            where: { id: categ }
            });

        if (!categoryExists) {
            return res.status(400).json({ message: "category not recognized" });
        }

        const scores = await prisma.score.findMany({
            where: { game: { language: lang, categoryId: categ } },
            orderBy: [{ score: "desc" }, { duration: "asc"}],
            take: 15,
            select: { score: true, correct: true, duration: true, createdAt: true }
            
        });

        res.status(200).json(scores)
    } catch (err) {
        next(err)
    }
}