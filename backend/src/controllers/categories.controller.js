import { prisma } from "../db/prisma.js";

export const getCategories = async (req, res, next) => {
    try {
        const { language } = req.query;

        if (!language) {
            return res.status(400).json({ message: "Query param 'language' es obligatorio" });
        }

        const lang = String(language).toUpperCase();
        const allowed = new Set(["ES", "EN", "FR"]);

        if (!allowed.has(lang)) {
            return res.status(400).json({ message: "language debe ser ES, EN o FR" });
        }

        const categories = await prisma.category.findMany({
            where: { language: lang },
            orderBy: { id: "asc" },
            select: { id: true, name: true, language: true, type: true }
        });

        res.status(200).json(categories);
    } catch (err) {
        next(err);
    }
};
