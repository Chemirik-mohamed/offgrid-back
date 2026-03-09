import { z } from "zod";

import { createCategory } from "../category/category.schema.js";

export const createApplianceSchema = z.object({
	slug: z.string(),
	name: z.string(),
	categorySlug: createCategory.shape.slug,
	typicalPowerW: z.number(),
	minPowerW: z
		.number()
		.optional()
		.transform((v) => v ?? null),
	maxPowerW: z
		.number()
		.optional()
		.transform((v) => v ?? null),
});

export type CreateApplianceInput = z.infer<typeof createApplianceSchema>;
