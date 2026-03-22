import { Router } from "express";
import { createAppliance } from "../../controllers/appliance.controllers.js";
const router = Router();

router.post("/", createAppliance);

export default router;
