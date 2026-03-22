import { Router } from "express";
import { getcategory } from "../../controllers/category.controllers.js";

const router = Router();

router.get("/", getcategory);

export default router;
