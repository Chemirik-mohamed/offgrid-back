import z from "zod";
import { addApplianceToProjectSchema } from "./addApplianceSchema.js";

export const intakeParamsSchema = z.object({
	token: z.uuid({ error: "Token invalide" }),
});

export const intakeApplianceParamsSchema = z.object({
	token: z.uuid({ error: "Token invalide" }),
	id: z.uuid({ error: "Identifiant appareil invalide" }),
});

export const submitIntakeSchema = z.object({
	appliances: z
		.array(addApplianceToProjectSchema)
		.min(1, { error: "Au moins un appareil est requis" }),
});
