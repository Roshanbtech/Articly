import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";

export const securityMiddleware = [
  helmet(),            
  xss(),               
  mongoSanitize(),     
  compression(),       
];
