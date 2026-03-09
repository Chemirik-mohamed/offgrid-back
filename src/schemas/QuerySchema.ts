import { boolean, z } from "zod";

export const querySchema = z.object({
	fields: z
		.string()
		.optional()
		.transform((v) =>
			v
				?.split(",")
				.map((s) => s.trim())
				.filter(boolean),
		),

	category: z.string().optional(),
	q: z.string().optional(),

	limit: z.coerce.number().int().min(1).max(100).optional().default(100),
});
