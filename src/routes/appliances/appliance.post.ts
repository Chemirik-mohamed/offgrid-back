import { Router } from "express";
import { createAppliance } from "../../controllers/appliance.controllers.js";
export const routerCreateAppliance = Router();

routerCreateAppliance.post("/", createAppliance);
