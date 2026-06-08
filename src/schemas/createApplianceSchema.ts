import { z } from "zod";
import { createCategorySchemas } from "./category.schema.js";

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
	unitPowerW: z
		.number()
		.positive("La puissance unitaire doit être supérieure à 0"),
	startupPowerW: z
		.number()
		.positive("La puissance de démarrage doit être supérieure à 0"),
	defaultDiversityFactor: z.number().min(0).max(1).default(1.0),
	voltageV: z
		.number()
		.positive("La tension doit être supérieure à 0")
		.default(230),
	currentType: z.enum(["AC", "DC"]).default("AC"),
});

export type CreateApplianceInput = z.infer<typeof createApplianceSchema>;
