import { Router } from "express";

import {
	createProject,
	getProject,
	getProjectById,
	updateProject,
	deleteProject,
	addApplianceToProject,
} from "../controllers/project.controllers.js";

const router = Router();

router.get("/", getProject);
router.get("/:id", getProjectById);
router.patch("/:id", updateProject);
router.post("/", createProject);
router.post("/:id/appliance", addApplianceToProject);
router.delete("/:id", deleteProject);

export default router;
