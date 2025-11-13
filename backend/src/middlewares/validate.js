// middlewares/validate.js
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    console.log("[validate] path:", req.path, "result.success:", result.success);
if (!result.success) console.log("[validate] issues:", result.error.issues);


    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }
  req.body = result.data;
  next();
};
