import { z } from "zod";

export const createSiteSchema = z.object({
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
	latitude: z
		.number()
		.optional()
		.transform((val) => val ?? null),
	longitude: z
		.number()
		.optional()
		.transform((val) => val ?? null),
	altitudeM: z
		.number()
		.optional()
		.transform((val) => val ?? null),
	accessType: z.enum(["ROAD", "CARRIAGE", "FOOT"]),
	requiresFourWheelDrive: z.boolean().default(false),
	lightningRisk: z.enum(["LOW", "MODERATE", "HIGH"]),
	usagePeriods: z
		.string()
		.optional()
		.transform((val) => val ?? null),
	dcBusVoltageV: z.int(),
	autonomyDays: z
		.number()
		.optional()
		.transform((val) => val ?? null),
	panelToBatteryDistanceM: z
		.number()
		.optional()
		.transform((val) => val ?? null),
	pvMountingType: z
		.string()
		.optional()
		.transform((val) => val ?? null),
	optimizePvInclination: z.boolean().default(false),
	hasGenerator: z.boolean().default(false),
	hasWindTurbine: z.boolean().default(false),
	hasHydro: z.boolean().default(false),
});

export type CreateSiteInput = z.infer<typeof createSiteSchema>;
