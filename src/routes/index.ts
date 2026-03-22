import { Router } from "express";
import appliancesGet from "./appliances/appliances.get.js";
import appliancesPost from "./appliances/appliance.post.js";
import categoryPost from "./category/category.post.js";
import categoryGet from "./category/category.get.js";
import projectGet from "./project/get.project.js";
import projectPost from "./project/create.project.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const router = Router();

router.use("/appliance", appliancesGet);
router.use("/appliance", appliancesPost);
router.use("/category", categoryPost);
router.use("/category", categoryGet);
router.use("/project", authMiddleware, projectGet);
router.use("/project", authMiddleware, projectPost);
