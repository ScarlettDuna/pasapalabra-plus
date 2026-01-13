import "dotenv/config";
import { PrismaClient } from "@prisma/client";

console.log("DATABASE_URL =", process.env.DATABASE_URL ? "OK" : "MISSING");

const prisma = new PrismaClient();

async function main() {
    // Categories
    await prisma.category.createMany({
        data: [
            { name: "Ciencia", language: "ES", type: "theme" },
            { name: "Literatura", language: "ES", type: "theme" },
            { name: "Música", language: "ES", type: "theme" },
            { name: "General", language: "ES", type: "theme" },

            { name: "Vocabulary (translation)", language: "EN", type: "learning" },
            { name: "Vocabulary (definition)", language: "EN", type: "learning" },
            { name: "Local culture", language: "EN", type: "learning" },

            { name: "Vocabulaire (traduction)", language: "FR", type: "learning" },
            { name: "Vocabulaire (définition)", language: "FR", type: "learning" },
            { name: "Culture locale", language: "FR", type: "learning" }
        ],
        skipDuplicates: true
    });

    console.log("✅ Seed: categories inserted");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

const cienciaES = await prisma.category.findFirst({
    where: { name: "Ciencia", language: "ES" },
});

if (!cienciaES) throw new Error("No existe la categoría Ciencia ES. Ejecuta seed de categorías primero.");

await prisma.question.createMany({
    data: [
        {
            letter: "A",
            question: "Empieza con A: Ciencia que estudia los astros.",
            answer: "Astronomía",
            language: "ES",
            difficulty: "easy",
            categoryId: cienciaES.id,
        },
        {
            letter: "B",
            question: "Empieza con B: Unidad básica de información en informática.",
            answer: "Bit",
            language: "ES",
            difficulty: "easy",
            categoryId: cienciaES.id,
        },
        {
            letter: "C",
            question: "Empieza con C: Sustancia que acelera una reacción sin consumirse.",
            answer: "Catalizador",
            language: "ES",
            difficulty: "easy",
            categoryId: cienciaES.id,
        },
    ],
    skipDuplicates: true,
});

console.log("✅ Seed: questions inserted");
