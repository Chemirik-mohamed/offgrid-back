import { Router } from "express";
import {
	addIntakeAppliance,
	deleteIntakeAppliance,
	getIntakeByToken,
	getIntakeCategories,
	getIntakeAppliances,
	submitIntake,
	updateIntakeAppliance,
} from "../controllers/intake.controllers.js";

const router = Router();

router.get("/:token/categories", getIntakeCategories);
router.get("/:token/appliance", getIntakeAppliances);
router.get("/:token", getIntakeByToken);
router.post("/:token/appliance", addIntakeAppliance);
router.patch("/:token/appliance/:id", updateIntakeAppliance);
router.delete("/:token/appliance/:id", deleteIntakeAppliance);
router.post("/:token", submitIntake);

export default router;
