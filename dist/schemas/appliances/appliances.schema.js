import { z } from "zod";
import { ApplianceCategorySchema } from "./appliance-category.schema.js";
export const CreateApplianceSchema = z.object({
    name: z.string(),
    category: ApplianceCategorySchema,
    typicalPowerW: z.number().positive(),
});
//# sourceMappingURL=appliances.schema.js.map