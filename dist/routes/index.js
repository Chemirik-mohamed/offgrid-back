import { Router } from "express";
import { routerAppliances } from "./appliances/appliances.get.js";
export const router = Router();
router.use("/appliance", routerAppliances);
//# sourceMappingURL=index.js.map