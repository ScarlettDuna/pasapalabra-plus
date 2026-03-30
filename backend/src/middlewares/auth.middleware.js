import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        console.log("Headers:", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token requerido" });
        }

        const token = authHeader.split(" ")[1];

        console.log("Token extraído:", token);

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