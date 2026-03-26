import { Router } from "express";

import {
	createProject,
	getProject,
	getProjectById,
} from "../controllers/project.controllers.js";

const router = Router();

router.get("/", getProject);
router.get("/:id", getProjectById);
router.post("/", createProject);

export default router;
