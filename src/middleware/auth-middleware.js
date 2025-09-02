import rateLimit from "express-rate-limit";

export const authMiddleware = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({
            errors: "Unauthorized",
            message: "Please login to access this resource"
        });
    }

    if (!req.session.user.username) {
        return res.status(401).json({
            errors: "Invalid session",
            message: "Session corrupted, please login again"
        });
    }
    req.user = req.session.user;
    next();
};

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
