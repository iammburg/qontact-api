import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { logger } from "./logging.js";

export const prismaClient = new PrismaClient({
    log: [
        { level: "query", emit: "event" },
        { level: "info", emit: "event" },
        { level: "warn", emit: "event" },
        { level: "error", emit: "event" }
    ]
});

prismaClient.$on("query", (e) => {
    logger.error("Query: ", e);
});

prismaClient.$on("info", (e) => {
    logger.error("Info: ", e);
});

prismaClient.$on("warn", (e) => {
    logger.error("Warn: ", e);
});

prismaClient.$on("error", (e) => {
    logger.error("Error: ", e);
});