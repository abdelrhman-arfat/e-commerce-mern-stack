import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.ip || "unknown-ip",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      message:
        "Too many login attempts. Please try again in an quarter of hour.",
      error: "Too Many Requests",
      code: 429,
    });
  },
});
export default loginLimiter;
