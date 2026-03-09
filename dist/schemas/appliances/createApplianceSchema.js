import { z } from "zod";
import { applianceCategorySchema } from "./appliance-category.schema.js";
export const createApplianceSchema = z.object({
    slug: z.string(),
    name: z.string(),
    category: applianceCategorySchema,
    typicalPowerW: z.number().positive(),
    minPpowerW: z.number().optional(),
    maxPpowerW: z.number().optional(),
});
//# sourceMappingURL=createApplianceSchema.js.map