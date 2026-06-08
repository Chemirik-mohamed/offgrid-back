import { z } from "zod";
import { timeSlotSchema } from "./timeSlotSchema.js";

export const addApplianceToProjectSchema = z.object({
	applianceId: z.uuid({ error: "Identifiant d'appareil invalide" }),
	quantity: z.int().min(1, { error: "La quantité doit être d'au moins 1" }),
	timeSlots: z.array(timeSlotSchema).min(1, {
		error: "Au moins une plage horaire est requise",
	}),
	currentType: z.enum(["AC", "DC"], { error: "Type de courant invalide" }),
});

export type AddApplianceToProjectSchemaInput = z.infer<
	typeof addApplianceToProjectSchema
>;

export const projectApplianceParamsSchema = z.object({
	id: z.uuid({ error: "Identifiant projet invalide" }),
	applianceId: z.uuid({ error: "Identifiant appareil invalide" }),
});

export const updateProjectApplianceSchema = z.object({
	quantity: z
		.int()
		.min(1, { error: "La quantité doit être d'au moins 1" })
		.optional(),
	timeSlots: z
		.array(timeSlotSchema)
		.min(1, { error: "Au moins une plage horaire est requise" })
		.optional(),
	currentType: z
		.enum(["AC", "DC"], { error: "Type de courant invalide" })
		.optional(),
	diversityFactorOverride: z.number().nullable().optional(),
});
