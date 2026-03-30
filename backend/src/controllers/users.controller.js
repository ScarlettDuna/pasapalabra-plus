import { prisma } from "../db/prisma.js";

export const createUser = async (req, res, next) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: "Body param 'username' es obligatorio" })
        }
        const uname = String(username).trim();
        if (!uname) {
            return res.status(400).json({ message: "username no puede estar vacío" });
        }
        
        const user = await prisma.user.create({
            data: {
                username: uname
            },
            select: {
                id: true,
                username: true,
                createdAt: true
            }
        });

        return res.status(201).json({user})
    } catch (err) {
        if (err.code === "P2002") { 
            return res.status(409).json({ message: "Username already in use" });
        }
        next(err)
    }
}

export const getMe = async (req, res, next) => {
    try {

    const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: {
                id: true,
                username: true,
                email: true,
                createdAt: true
            }
    });

    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    return res.status(200).json(user)

    } catch (err) {
        next(err)
    }

    
}

export const getMyGames = async (req, res, next) => {
    try {

        const user = req.user.userId;
        const games = await prisma.game.findMany({
            where: { userId: user, endedAt: { not: null }},
            include: { score: true },
            orderBy: { score: { score: 'desc' }}
        })
        
        return res.status(200).json(games)
        
    } catch (err) {
        next(err)
    }
}