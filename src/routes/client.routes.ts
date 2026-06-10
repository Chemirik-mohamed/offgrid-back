import { Router } from "express";
import { updateClient } from "../controllers/client.controllers.js";

const router = Router();

router.patch("/:id", updateClient);

export default router;
