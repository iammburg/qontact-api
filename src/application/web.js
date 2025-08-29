import express from "express";
import { publicRouter } from "../route/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { userRouter } from "../route/api.js";
import cors from "cors";
import session from "express-session";

export const web = express();
web.use(express.json());
web.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
web.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60
    }
}));

web.use(publicRouter);
web.use(userRouter);

web.use(errorMiddleware);