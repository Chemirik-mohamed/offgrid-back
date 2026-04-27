import { z } from "zod";

export const createCategorySchemas = z.object({
	label: z.string().min(1, "Le nom est obligatoire"),
	slug: z
		.string()
		.min(1, "Le slug est obligatoire")
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
			message:
				"Le slug doit être en minuscules, sans espaces, avec des tirets uniquement",
		}),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchemas>;
