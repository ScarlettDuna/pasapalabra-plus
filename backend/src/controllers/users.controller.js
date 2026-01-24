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