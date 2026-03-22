import { Router } from "express";
import { getAppliance } from "../../controllers/appliance.controllers.js";

const router = Router();

router.get("/", getAppliance);

export default router;
