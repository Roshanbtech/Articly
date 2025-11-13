import express from "express";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.js";
import { corsMiddleware } from "./middlewares/cors.js";

const app = express();

app.use(corsMiddleware);
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

app.use("/api", routes);

app.use(errorHandler);

export default app;
