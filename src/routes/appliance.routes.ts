import { Router } from "express";
import {
	createAppliance,
	getAppliance,
} from "../controllers/appliance.controllers.js";
const router = Router();

router.get("/", getAppliance);
router.post("/", createAppliance);

export default router;
