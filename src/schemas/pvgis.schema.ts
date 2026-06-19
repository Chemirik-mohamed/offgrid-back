import { z } from "zod";
import {
	PVGIS_MOUNTING_PLACES,
	PVGIS_TECHNOLOGIES,
} from "../services/pvgis/pvgis.types.js";

export const pvgisEstimateSchema = z.object({
	inclinationDeg: z.number().min(0).max(90),
	// Convention PVGIS : 0 = sud, 90 = ouest, -90 = est.
	azimuthDeg: z.number().min(-180).max(180),
	lossPercent: z.number().min(0).lt(100),
	technology: z.enum(PVGIS_TECHNOLOGIES),
	mountingPlace: z.enum(PVGIS_MOUNTING_PLACES),
});

export const pvgisCoordinatesSchema = z.object({
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180),
});
