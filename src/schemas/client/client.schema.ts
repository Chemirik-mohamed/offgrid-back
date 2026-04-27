import { z } from "zod";

export const createClientSchema = z.object({
	name: z.string().min(2, { message: "Minimum 2 caractères" }),
	email: z
		.email()
		.optional()
		.transform((val) => val ?? null),
	phone: z
		.string()
		.optional()
		.transform((val) => val ?? null),
	address: z
		.string()
		.optional()
		.transform((val) => val ?? null),
	city: z
		.string()
		.optional()
		.transform((val) => val ?? null),
	zipCode: z
		.string()
		.optional()
		.transform((val) => val ?? null),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
