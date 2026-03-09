import { Router } from "express";
import { routerAppliances } from "./appliances/appliances.get.js";
import { routerCreateAppliance } from "./appliances/appliance.post.js";
import { createCategoryRouter } from "./category/category.post.js";
import { routerGetCategory } from "./category/category.get.js";

export const router = Router();

router.use("/appliance", routerAppliances);
router.use("/appliance", routerCreateAppliance);
router.use("/category", createCategoryRouter);
router.use("/category", routerGetCategory);
