import { z } from "zod";
import { createCategorySchemas } from "../category/category.schema.js";

export const createApplianceSchema = z.object({
	slug: z
		.string()
		.min(1, "Le slug est obligatoire")
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
			message:
				"Le slug doit être en minuscules, sans espaces, avec des tirets uniquement",
		}),
	name: z.string().min(1, "Le nom est obligatoire"),
	categorySlug: createCategorySchemas.shape.slug,
	typicalPowerW: z
		.number()
		.positive("La puissance typique doit être supérieure à 0"),
	minPowerW: z
		.number()
		.positive("La puissance minimale doit être supérieure à 0")
		.optional()
		.transform((v) => v ?? null),
	maxPowerW: z
		.number()
		.positive("La puissance maximale doit être supérieure à 0")
		.optional()
		.transform((v) => v ?? null),
});

export type CreateApplianceInput = z.infer<typeof createApplianceSchema>;
