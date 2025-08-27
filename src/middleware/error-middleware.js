import { ResponseError } from "../error/response-error.js";
import { logger } from "../application/logging.js";

const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next();
        return;
    }

    if (err instanceof ResponseError) {
        res.status(err.status).json({
            errors: err.message,
        }).end();
        return;
    }

    logger.error("Internal error", { error: err, stack: err.stack });

    const isProd = process.env.NODE_ENV === "production";
    const genericMessage = isProd ? "Internal Server Error" : (err.message || "Internal Server Error");

    res.status(500).json({
        errors: genericMessage,
    }).end();
};

export {
    errorMiddleware,
};