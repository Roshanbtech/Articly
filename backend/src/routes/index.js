import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import categoryRoutes from "./category.routes.js";
import bannerRoutes from "./banner.routes.js";
import articleRoutes from "./article.routes.js";
import reactionRoutes from "./reaction.routes.js";
import adminDashboardRoutes from "./admin.dashboard.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/banners", bannerRoutes);
router.use("/reactions", reactionRoutes);
router.use("/articles", articleRoutes);
router.use("/admin/dashboard", adminDashboardRoutes);

export default router;
