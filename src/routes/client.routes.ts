import { Router } from "express";
import { updateClient } from "../controllers/client.controllers.js";

export const clientRouter = Router();

clientRouter.patch("/:id", updateClient);
