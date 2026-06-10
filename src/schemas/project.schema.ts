import { z } from "zod";
import { createClientSchema } from "./client.schema.js";
import { createSiteSchema } from "./site.scheam.js";

export const projectParamsSchema = z.object({
	id: z.uuid({ error: "L'idantifaint du projet et invalide" }),
});

export const createProjectschema = z.object({
	name: z.string().min(3, { error: "minimum 3 caractères." }),
	description: z.string().optional(),
	status: z
		.enum([
			"DRAFT",
			"CLIENT_PENDING",
			"CLIENT_FILLED",
			"IN_PROGRESS",
			"COMPLETED",
		])
		.optional(),

	client: createClientSchema.optional(),
	site: createSiteSchema,
});

export const updateProjectschema = z.object({
	name: z.string().min(3, { error: "minimum 3 caractères." }).optional(),
	description: z.string().optional(),
	status: z
		.enum([
			"DRAFT",
			"CLIENT_PENDING",
			"CLIENT_FILLED",
			"IN_PROGRESS",
			"COMPLETED",
		])
		.optional(),
	isPinned: z.boolean().optional(),
});

export type dataCreateProjectschema = z.infer<typeof createProjectschema>;
