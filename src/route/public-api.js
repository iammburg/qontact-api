import express from 'express';
import userController from '../controller/user-controller.js';
import { authLimiter } from '../middleware/auth-middleware.js';
import { verifyCsrfToken } from '../middleware/csrf-middleware.js';

const publicRouter = new express.Router();

publicRouter.get("/api/csrf-token", (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json({
        csrfToken: req.session.csrfToken,
        message: "CSRF token generated successfully"
    });
});

publicRouter.post("/api/users", verifyCsrfToken, authLimiter, userController.register);
publicRouter.post("/api/users/login", verifyCsrfToken, authLimiter, userController.login);

export {
    publicRouter,
};