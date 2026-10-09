import assert from "node:assert/strict";
import test from "node:test";
import { getPvgisProductionEstimate } from "./pvgis.client.js";
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

function createPvgisPayload() {
	return {
		outputs: {
			monthly: {
				fixed: Array.from({ length: 12 }, (_, index) => ({
					month: index + 1,
					"H(i)_d": index + 1.1,
					"H(i)_m": (index + 1) * 30,
					E_d: index + 0.9,
					E_m: (index + 1) * 25,
				})),
			},
			totals: {
				fixed: {
					"H(i)_y": 1_540,
					E_y: 1_230,
				},
			},
		},
	};
}

test("envoie les paramètres PVGIS attendus", async (t) => {
	let receivedUrl: URL | undefined;

	t.mock.method(globalThis, "fetch", async (...args: Parameters<typeof fetch>) => {
		const [resource] = args;
		receivedUrl = new URL(String(resource));

		return new Response(JSON.stringify(createPvgisPayload()), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	});

	const result = await getPvgisProductionEstimate(input);

	assert.equal(receivedUrl?.origin, "https://re.jrc.ec.europa.eu");
	assert.equal(receivedUrl?.pathname, "/api/v5_3/PVcalc");
	assert.equal(receivedUrl?.searchParams.get("lat"), "43.6045");
	assert.equal(receivedUrl?.searchParams.get("lon"), "1.444");
	assert.equal(receivedUrl?.searchParams.get("peakpower"), "1");
	assert.equal(receivedUrl?.searchParams.get("loss"), "14");
	assert.equal(receivedUrl?.searchParams.get("angle"), "30");
	assert.equal(receivedUrl?.searchParams.get("aspect"), "0");
	assert.equal(result.annual.productionKwhPerKwp, 1_230);
});

test("signale PVGIS comme indisponible lorsque la requête réseau échoue", async (t) => {
	t.mock.method(globalThis, "fetch", async () => {
		throw new Error("Erreur réseau");
	});

	await assert.rejects(
		() => getPvgisProductionEstimate(input),
		(error: unknown) =>
			error instanceof PvgisError && error.code === "UNAVAILABLE",
	);
});
