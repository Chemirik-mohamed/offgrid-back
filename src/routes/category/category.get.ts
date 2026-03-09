import { Router } from "express";
import { getcategory } from "../../controllers/category.controllers.js";

export const routerGetCategory = Router();

routerGetCategory.get("/", getcategory);
