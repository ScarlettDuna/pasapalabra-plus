import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { createInterface } from "readline";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

const DIFFICULTY_MAP = {
    "fácil": "easy",
    "medio": "medium",
    "difícil": "hard",
};

function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const rows = [];
        const rl = createInterface({
            input: fs.createReadStream(filePath, { encoding: "utf-8" }),
            crlfDelay: Infinity,
        });

        let isFirst = true;
        let headers = [];

        rl.on("line", (line) => {
            if (!line.trim()) return;

            // Parseo simple que respeta campos entre comillas
            const fields = [];
            let current = "";
            let inQuotes = false;
            for (let i = 0; i < line.length; i++) {
                const ch = line[i];
                if (ch === '"') {
                    inQuotes = !inQuotes;
                } else if (ch === "," && !inQuotes) {
                    fields.push(current.trim());
                    current = "";
                } else {
                    current += ch;
                }
            }
            fields.push(current.trim());

            if (isFirst) {
                headers = fields;
                isFirst = false;
                return;
            }

            const row = {};
            headers.forEach((h, i) => (row[h] = fields[i] ?? ""));
            rows.push(row);
        });

        rl.on("close", () => resolve(rows));
        rl.on("error", reject);
    });
}

async function main() {
    // ── 1. Categorías ────────────────────────────────────────────────────────
    await prisma.category.createMany({
        data: [
            { name: "Ciencia", language: "ES", type: "theme" },
            { name: "Literatura", language: "ES", type: "theme" },
            { name: "Música", language: "ES", type: "theme" },
            { name: "General", language: "ES", type: "theme" },
            { name: "Historia", language: "ES", type: "theme" },
            { name: "Geografía", language: "ES", type: "theme" },
            { name: "Deporte", language: "ES", type: "theme" },
            { name: "Cine y TV", language: "ES", type: "theme" },

            { name: "Vocabulary (translation)", language: "EN", type: "learning" },
            { name: "Vocabulary (definition)", language: "EN", type: "learning" },
            { name: "Local culture", language: "EN", type: "learning" },

            { name: "Vocabulaire (traduction)", language: "FR", type: "learning" },
            { name: "Vocabulaire (définition)", language: "FR", type: "learning" },
            { name: "Culture locale", language: "FR", type: "learning" },
        ],
        skipDuplicates: true,
    });
    console.log("✅ Categorías insertadas");

    // ── 2. Cargar categorías ES en un mapa para lookup rápido ────────────────
    const categories = await prisma.category.findMany({
        where: { language: "ES" },
    });
    const categoryMap = new Map(categories.map((c) => [c.name.toLowerCase(), c]));

    // ── 3. Leer CSV ──────────────────────────────────────────────────────────
    const csvPath = path.join(__dirname, "..", "Preguntas pasapalabra + - Español.csv");
    const rows = await parseCSV(csvPath);
    console.log(`📄 ${rows.length} filas leídas del CSV`);

    // ── 4. Construir preguntas ───────────────────────────────────────────────
    const questions = [];
    let skipped = 0;

    for (const row of rows) {
        const letra = row["Letra"]?.trim().toUpperCase();
        const condicion = row["Condición"]?.trim();
        const definicion = row["Definición"]?.trim();
        const respuesta = row["Respuesta"]?.trim();
        const tema = row["Tema"]?.trim();
        const nivel = row["Nivel"]?.trim().toLowerCase();

        if (!letra || !condicion || !definicion || !respuesta || !tema || !nivel) {
            skipped++;
            continue;
        }

        const difficulty = DIFFICULTY_MAP[nivel];
        if (!difficulty) {
            skipped++;
            continue;
        }

        const category = categoryMap.get(tema.toLowerCase());
        if (!category) {
            skipped++;
            continue;
        }

        questions.push({
            letter: letra,
            question: `${condicion} con ${letra}: ${definicion}`,
            answer: respuesta,
            language: "ES",
            difficulty,
            categoryId: category.id,
        });
    }

    console.log(`📝 ${questions.length} preguntas preparadas (${skipped} omitidas)`);

    // ── 5. Insertar en lotes ─────────────────────────────────────────────────
    const BATCH = 100;
    let inserted = 0;
    for (let i = 0; i < questions.length; i += BATCH) {
        const batch = questions.slice(i, i + BATCH);
        await prisma.question.createMany({ data: batch, skipDuplicates: true });
        inserted += batch.length;
    }

    console.log(`✅ ${inserted} preguntas insertadas`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
