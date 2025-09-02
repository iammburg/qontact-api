import crypto from "crypto";

export const generateCsrfToken = (req, res, next) => {
    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(32).toString("hex");
    }
    res.cookie("XSRF-TOKEN", req.session.csrfToken, {
        httpOnly: false,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
    next();
};

export const verifyCsrfToken = (req, res, next) => {
    // Skip CSRF verification for testing in development
    if (process.env.NODE_ENV === "development" && req.headers["x-test-bypass"] === "true") {
        return next();
    }

    const csrfToken = req.session.csrfToken;
    const requestToken = req.get("X-XSRF-TOKEN");

    if (!csrfToken || !requestToken || csrfToken !== requestToken) {
        return res.status(403).json({ error: "Invalid CSRF token" });
    }
    next();
};
