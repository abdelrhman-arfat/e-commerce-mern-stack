import rateLimit from "express-rate-limit";

const signUpLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 10,
  handler: (req, res) => {
    res.status(429).json({
      message:
        "Too many sign-up attempts. Please try again in an half of hour.",
      error: "Too Many Requests",
      code: 429,
    });
  },
  headers: true,
});
export default signUpLimiter;
