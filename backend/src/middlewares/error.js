export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  console.error("[errorHandler] name:", err?.name, "message:", err?.message);
  res.status(status).json({
    success: false,
    status,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
