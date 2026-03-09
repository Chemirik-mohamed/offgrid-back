import { Router } from "express";
import { create } from "../../controllers/category.controllers.js";

export const createCategoryRouter = Router();

createCategoryRouter.post("/", create);
