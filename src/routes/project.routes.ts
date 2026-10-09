import { Router } from "express";

import {
	createProject,
	getProject,
	getProjectById,
	getProjectConsumption,
	updateProject,
	deleteProject,
	addApplianceToProject,
	updateProjectSite,
	deleteProjectAppliance,
	updateProjectAppliance,
} from "../controllers/project.controllers.js";
import { generateIntake } from "../controllers/intake.controllers.js";
import {
	estimateProjectPvgis,
	getLatestProjectPvgisEstimate,
} from "../controllers/pvgis.controller.js";

const router = Router();

router.get("/", getProject);
router.get("/:id/consumption", getProjectConsumption);
router.post("/:id/pvgis/estimate", estimateProjectPvgis);
router.get("/:id/pvgis/estimate", getLatestProjectPvgisEstimate);
router.get("/:id", getProjectById);
router.patch("/site/:id", updateProjectSite);
router.patch("/:id", updateProject);
router.post("/", createProject);
router.post("/:id/intake", generateIntake);
router.post("/:id/appliance", addApplianceToProject);
router.patch("/:id/appliance/:applianceId", updateProjectAppliance);
router.delete("/:id/appliance/:applianceId", deleteProjectAppliance);
router.delete("/:id", deleteProject);

export default router;
