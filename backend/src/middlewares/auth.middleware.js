import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token requerido" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next(); // ← le dice a Express "ya he terminado, pasa al controlador"

    } catch (err) {
        console.error("❌ Error middleware:", err);
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};

export const optionalAuth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return next();

    const token = header.split(" ")[1];
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch {
        req.user = null;
        next()
    }
}

export const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Acceso restringido a administradores" })
    }
    next();
}