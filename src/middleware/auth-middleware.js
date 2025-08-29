export const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = req.session.user;
    next();
};
