import { Router } from "express";
import { getProject } from "../../controllers/project.controllers.js";

const router = Router();

router.get("/", getProject);

export default router;
