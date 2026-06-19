import { z } from "zod";
import {
	PvgisError,
	type PvgisProductionEstimate,
	type PvgisProductionEstimateInput,
} from "./pvgis.types.js";

const pvgisMonthlyRowSchema = z.object({
	month: z.number().int().min(1).max(12),
	"H(i)_d": z.number().finite(),
	"H(i)_m": z.number().finite(),
	E_d: z.number().finite(),
	E_m: z.number().finite(),
});

const pvgisApiResponseSchema = z.object({
	outputs: z.object({
		monthly: z.object({
			fixed: z.array(pvgisMonthlyRowSchema).length(12),
		}),
		totals: z.object({
			fixed: z.object({
				"H(i)_y": z.number().finite(),
				E_y: z.number().finite(),
			}),
		}),
	}),
});

export function mapPvgisProductionEstimate(
	input: PvgisProductionEstimateInput,
	payload: unknown,
): PvgisProductionEstimate {
	const parsedPayload = pvgisApiResponseSchema.safeParse(payload);

	if (!parsedPayload.success) {
		throw new PvgisError("INVALID_RESPONSE");
	}

	const rows = [...parsedPayload.data.outputs.monthly.fixed].sort(
		(a, b) => a.month - b.month,
	);
	const distinctMonths = new Set(rows.map((row) => row.month));

	if (distinctMonths.size !== 12) {
		throw new PvgisError("INVALID_RESPONSE");
	}

	return {
		location: {
			latitude: input.latitude,
			longitude: input.longitude,
		},
		configuration: {
			inclinationDeg: input.inclinationDeg,
			azimuthDeg: input.azimuthDeg,
			lossPercent: input.lossPercent,
			technology: input.technology,
			mountingPlace: input.mountingPlace,
			referencePeakPowerKwp: 1,
		},
		monthly: rows.map((row) => ({
			month: row.month,
			averageDailyIrradiationKwhPerM2: row["H(i)_d"],
			monthlyIrradiationKwhPerM2: row["H(i)_m"],
			averageDailyProductionKwhPerKwp: row.E_d,
			monthlyProductionKwhPerKwp: row.E_m,
		})),
		annual: {
			irradiationKwhPerM2: parsedPayload.data.outputs.totals.fixed["H(i)_y"],
			productionKwhPerKwp: parsedPayload.data.outputs.totals.fixed.E_y,
		},
	};
}
