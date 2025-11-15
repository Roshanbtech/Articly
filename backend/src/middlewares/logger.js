import morgan from "morgan";

export const devLogger = morgan("dev");

export const prodLogger = morgan(":method :url :status :res[content-length] - :response-time ms");
