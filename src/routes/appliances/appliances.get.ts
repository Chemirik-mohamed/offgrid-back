import { Router } from "express";
import { getAppliance } from "../../controllers/appliance.controllers.js";

export const routerAppliances = Router();

routerAppliances.get("/", getAppliance);
