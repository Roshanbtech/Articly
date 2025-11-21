import helmet from "helmet";
import compression from "compression";
import xss from "xss";
import mongoSanitize from "mongo-sanitize";

const sanitizeDeep = (value) => {
  if (value == null) return value;

  if (typeof value === "string") {
    const mongoSafe = mongoSanitize(value);
    return xss(mongoSafe);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeDeep(item));
  }

  if (typeof value === "object") {
    const result = {};

    for (const [key, val] of Object.entries(value)) {
      if (key.startsWith("$") || key.includes(".")) continue;
      result[key] = sanitizeDeep(val);
    }

    return result;
  }

  return value;
};

const sanitizeRequest = (req, _res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeDeep(req.body);
  }

  if (req.query && typeof req.query === "object") {
    const q = req.query;
    Object.keys(q).forEach((key) => {
      q[key] = sanitizeDeep(q[key]);
    });
  }

  if (req.params && typeof req.params === "object") {
    const p = req.params;
    Object.keys(p).forEach((key) => {
      p[key] = sanitizeDeep(p[key]);
    });
  }

  next();
};

export const securityMiddleware = [
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
  compression(),
  sanitizeRequest,
];
