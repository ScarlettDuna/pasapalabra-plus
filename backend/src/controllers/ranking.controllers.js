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

        let categ;

        if (category !== undefined) {
            categ = Number(category);

            if (Number.isNaN(categ)) {
                return res.status(400).json({ message: "category debe ser un número" });
            }

            const categoryExists = await prisma.category.findUnique({
                where: { id: categ }
            })

            if (!categoryExists) {
                return res.status(400).json({ message: "category not recognized" });
            }
        }
        const where = {
            game: {
                language: lang,
                ...(categ && { categoryId: categ })
            }
        };


        const scores = await prisma.score.findMany({
            where,
            orderBy: [{ score: "desc" }, { duration: "asc"}],
            take: 15,
            select: { 
                score: true, 
                correct: true, 
                duration: true, 
                createdAt: true,
                game: {
                    select: {
                        startedAt: true,
                        user: { select: { username: true }},
                        category: { select: { name: true }}
                    }
                }
            }
            
        });

        const ranking = scores.map((s, i) => {
            let playerName;
            if (s.game.user) {
                playerName = s.game.user.username;
            } else {
                const date = new Date(s.game.startedAt);
                const day = date.getDate();
                const month = date.toLocaleString('es-ES', { month: "short" });
                playerName = `${s.game.category.name}-${day}${month}`;
            }

            return {
                position: i + 1,
                playerName,
                score: s.score,
                correct: s.correct,
                duration: s.duration,
                createdAt: s.createdAt
            }
        })

        res.status(200).json(ranking)
    } catch (err) {
        next(err)
    }
}