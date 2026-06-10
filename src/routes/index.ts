import { Router } from "express";
import appliancesRouter from "./appliance.routes.js";
import categoryRouter from "./category.routes.js";
import projectRoutes from "./project.routes.js";
import clientRouter from "./client.routes.js";
import intakeRouter from "./intake.routes.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

export const router = Router();

router.use("/appliance", appliancesRouter);
router.use("/categories", categoryRouter);
router.use("/project", authMiddleware, projectRoutes);
router.use("/client", authMiddleware, clientRouter);
router.use("/intake", intakeRouter);
