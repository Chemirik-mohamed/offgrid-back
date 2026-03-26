import { Router } from "express";
import appliancesRouter from "./appliance.routes.js";
import categoryRouter from "./category.routes.js";
import projectRoutes from "./project.routes.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

export const router = Router();

router.use("/appliance", appliancesRouter);
router.use("/category", categoryRouter);
router.use("/project", authMiddleware, projectRoutes);
