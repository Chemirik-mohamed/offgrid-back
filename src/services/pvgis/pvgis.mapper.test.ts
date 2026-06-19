import assert from "node:assert/strict";
import test from "node:test";
import { mapPvgisProductionEstimate } from "./pvgis.mapper.js";
import { PvgisError, type PvgisProductionEstimateInput } from "./pvgis.types.js";

const input: PvgisProductionEstimateInput = {
	latitude: 43.6045,
	longitude: 1.444,
	inclinationDeg: 30,
	azimuthDeg: 0,
	lossPercent: 14,
	technology: "crystSi",
	mountingPlace: "free",
};

function createMonthlyRows() {
	return Array.from({ length: 12 }, (_, index) => ({
		month: index + 1,
		"H(i)_d": index + 1.1,
		"H(i)_m": (index + 1) * 30,
		E_d: index + 0.9,
		E_m: (index + 1) * 25,
	}));
}

test("normalise les résultats mensuels PVGIS pour une référence de 1 kWp", () => {
	const result = mapPvgisProductionEstimate(input, {
		outputs: {
			monthly: { fixed: createMonthlyRows() },
			totals: {
				fixed: {
					"H(i)_y": 1_540,
					E_y: 1_230,
				},
			},
		},
	});

	assert.equal(result.configuration.referencePeakPowerKwp, 1);
	assert.equal(result.monthly.length, 12);
	assert.deepEqual(result.monthly[0], {
		month: 1,
		averageDailyIrradiationKwhPerM2: 1.1,
		monthlyIrradiationKwhPerM2: 30,
		averageDailyProductionKwhPerKwp: 0.9,
		monthlyProductionKwhPerKwp: 25,
	});
	assert.deepEqual(result.annual, {
		irradiationKwhPerM2: 1_540,
		productionKwhPerKwp: 1_230,
	});
});

test("refuse une réponse PVGIS incomplète", () => {
	assert.throws(
		() =>
			mapPvgisProductionEstimate(input, {
				outputs: {
					monthly: { fixed: createMonthlyRows().slice(0, 11) },
					totals: { fixed: { "H(i)_y": 1_540, E_y: 1_230 } },
				},
			}),
		(error: unknown) =>
			error instanceof PvgisError && error.code === "INVALID_RESPONSE",
	);
});
