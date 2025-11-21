import cors from "cors";

const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

export const corsMiddleware = cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
