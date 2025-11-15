import express from "express";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.js";
import { corsMiddleware } from "./middlewares/cors.js";
import { securityMiddleware } from "./middlewares/security.js";
import { apiRateLimiter } from "./middlewares/rateLimit.js";
import { devLogger, prodLogger } from "./middlewares/logger.js";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(devLogger);
} else {
  app.use(prodLogger);
}

app.use(corsMiddleware);
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
if (process.env.NODE_ENV !== "development") {
  app.use(apiRateLimiter);
}
app.use(securityMiddleware);

app.use("/api", routes);
app.use(errorHandler);

export default app;
