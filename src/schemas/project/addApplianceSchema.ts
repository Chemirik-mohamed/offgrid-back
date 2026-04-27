import { z } from "zod";

export const addApplianceToProjectSchema = z.object({
	applianceId: z.uuid(),
	quantity: z.int().positive().min(1),
	currentType: z.enum(["AC", "DC"]).default("AC"),
	voltageV: z.float32().default(230),
	dailyUsageMinutes: z.float32().positive().min(1),
	ratedPowerW: z.float32().positive().min(1),
	startupPowerW: z
		.float32()
		.optional()
		.transform((v) => v ?? null),
	diversityCoeff: z.float32().default(1.0),
	dailyScheduleMinutes: z.array(z.int().min(0).max(1439)),
});

export type AddApplianceToProjectSchemaInput = z.infer<
	typeof addApplianceToProjectSchema
>;
