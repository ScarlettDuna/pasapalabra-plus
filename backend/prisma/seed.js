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

function parseTSV(filePath) {
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
            const fields = line.split("\t").map(f => f.trim());

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

            { name: "General", language: "EN", type: "theme" },
            { name: "Definición", language: "EN", type: "learning" },
            { name: "Traducción", language: "EN", type: "learning" },
            { name: "General", language: "FR", type: "theme" },
            { name: "Definición", language: "FR", type: "learning" },
            { name: "Traducción", language: "FR", type: "learning" },
        ],
        skipDuplicates: true,
    });
    console.log("✅ Categorías insertadas");

    // ── 2. Cargar todas las categorías en un mapa para lookup rápido ─────────
    const categories = await prisma.category.findMany();
    const categoryMap = new Map(
        categories.map((c) => [`${c.language}:${c.name.toLowerCase()}`, c])
    );

    // ── 3. Leer TSV ──────────────────────────────────────────────────────────
    const tsvFiles = [
        "Preguntas pasapalabra + allLang.tsv",
        "Preguntas CineTV.tsv",
        "Preguntas Historia.tsv",
    ];
    const allRows = await Promise.all(
        tsvFiles.map(f => parseTSV(path.join(__dirname, "..", f)))
    );
    const rows = allRows.flat();
    console.log(`📄 ${rows.length} filas leídas de ${tsvFiles.length} archivos TSV`);

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
        const idioma = row["Idioma"]?.trim().toUpperCase();

        if (!letra || !condicion || !definicion || !respuesta || !tema || !nivel || !idioma) {
            skipped++;
            continue;
        }

        const difficulty = DIFFICULTY_MAP[nivel];
        if (!difficulty) {
            skipped++;
            continue;
        }

        const category = categoryMap.get(`${idioma}:${tema.toLowerCase()}`);
        if (!category) {
            skipped++;
            continue;
        }

        questions.push({
            letter: letra,
            question: `${condicion} ${letra}: ${definicion}`,
            answer: respuesta,
            language: idioma,
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

    // ── Admin por defecto ────────────────────────────────────────────────────────
    const bcrypt = await import("bcrypt");
    const adminPassword = await bcrypt.default.hash("admin1234", 10);

    await prisma.user.upsert({
        where: { email: "admin@pasapalabra.com" },
        update: {},
        create: {
            username: "admin",
            email: "admin@pasapalabra.com",
            passwordHash: adminPassword,
            role: "admin"
        }
    });

    const userPassword = await bcrypt.default.hash("user1234", 10);
    await prisma.user.upsert({
        where: { email: "user@pasapalabra.com" },
        update: {},
        create: {
            username: "user",
            email: "user@pasapalabra.com",
            passwordHash: userPassword,
            role: "user"
        }
    });
    console.log("✅ Usuarios de prueba creados (admin / user)");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
