import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).json({
      message:
        "Too many sign-up attempts. Please try again in an quarter of hour.",
      error: "Too Many Requests",
      code: 429,
    });
  },
  headers: true,
});
export default loginLimiter;
