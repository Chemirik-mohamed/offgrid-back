import { Router } from "express";
import {
	getcategory,
	createCategory,
} from "../controllers/category.controllers.js";

const router = Router();

router.get("/", getcategory);
router.post("/", createCategory);

export default router;
