import express from "express";
import { publicRouter } from "../route/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { userRouter } from "../route/api.js";
import cors from "cors";
import session from "express-session";
import { prismaClient } from "./database.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import helmet from "helmet";
import { generateCsrfToken } from "../middleware/csrf-middleware.js";

export const web = express();

web.use(express.json({ limit: "1mb" }));
web.use(express.urlencoded({ extended: true, limit: "1mb" }));
web.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
web.use(helmet());
web.disable("x-powered-by");

if (process.env.NODE_ENV === "production") {
    web.set("trust proxy", 1);
}

web.use(session({
    store: new PrismaSessionStore(prismaClient, {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
    }),
    name: "connect.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60
    }
}));

// Generate CSRF token for all requests after session middleware
web.use(generateCsrfToken);

web.use(publicRouter);
web.use(userRouter);

web.use(errorMiddleware);