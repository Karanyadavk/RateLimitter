import rateLimit from "express-rate-limit";


export const taskRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    keyGenerator: (req) => {
        const userId = req.headers.user_id;
        if (typeof userId === "string") {
            return userId;
        }
        return "unknown_user";
    },
    handler: (req, res, next) => {
        res.status(429).json({ message: "Too many requests, please try again later." });
    }
});

export const oneTaskPerSecondLimiter = rateLimit({
    windowMs: 1000,
    max: 1,
    keyGenerator: (req) => {
        const userId = req.headers.user_id;
        if (typeof userId === "string") {
            return userId;
        }
        return "unknown_user";
    },
    handler: (req, res, next) => {
        res.status(429).json({ message: "Rate limit exceeded. Only 1 task per second is allowed." });
    }
});