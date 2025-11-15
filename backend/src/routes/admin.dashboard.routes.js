import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/roles.js";
import * as ctrl from "../controllers/dashboard.controller.js";

const router = Router();

// All routes below are admin-only
router.use(requireAuth, requireRole("admin"));

router.get("/overview", ctrl.overview);
router.get("/top-users", ctrl.topUsers);
router.get("/top-categories", ctrl.topCategories);
router.get("/top-articles", ctrl.topArticles);
router.get("/recent-users", ctrl.recentUsers);
router.get("/recent-articles", ctrl.recentArticles);
router.get("/user-growth", ctrl.userGrowth);

export default router;
