import { z } from "zod";

export const createProjectschema = z.object({
	name: z.string(),
});

export type dataCreateProjectschema = z.infer<typeof createProjectschema>;
