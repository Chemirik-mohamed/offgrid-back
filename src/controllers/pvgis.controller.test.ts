import assert from "node:assert/strict";
import test from "node:test";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import {
	estimateProjectPvgis,
	getLatestProjectPvgisEstimate,
} from "./pvgis.controller.js";

const projectId = "018f64a0-7b56-7d6d-8b5d-76a13fd98db2";
const userId = "user-1";

const validBody = {
	inclinationDeg: 30,
	azimuthDeg: 0,
	lossPercent: 14,
	technology: "crystSi",
	mountingPlace: "free",
};

function createRequest(body = validBody): Request {
	return {
		params: { id: projectId },
		body,
		user: { id: userId },
	} as unknown as Request;
}

function createResponseRecorder() {
	let statusCode = 200;
	let payload: unknown;

	const response = {
		status(code: number) {
			statusCode = code;
			return response;
		},
		json(body: unknown) {
			payload = body;
			return response;
		},
	};

	return {
		response: response as unknown as Response,
		getStatusCode: () => statusCode,
		getPayload: () => payload,
	};
}

type ProjectDelegateForTest = {
	findFirst: (args: unknown) => Promise<unknown>;
};

function mockProjectFindFirst(
	t: { after: (callback: () => void) => void },
	implementation: (args: unknown) => Promise<unknown>,
) {
	const projectDelegate = prisma.project as unknown as ProjectDelegateForTest;
	const originalFindFirst = projectDelegate.findFirst;

	projectDelegate.findFirst = implementation;
	t.after(() => {
		projectDelegate.findFirst = originalFindFirst;
	});
}

type PvgisEstimateDelegateForTest = {
	create: (args: unknown) => Promise<unknown>;
	findFirst: (args: unknown) => Promise<unknown>;
};

function mockPvgisEstimateCreate(
	t: { after: (callback: () => void) => void },
	implementation: (args: unknown) => Promise<unknown>,
) {
	const pvgisEstimateDelegate =
		prisma.pvgisEstimate as unknown as PvgisEstimateDelegateForTest;
	const originalCreate = pvgisEstimateDelegate.create;

	pvgisEstimateDelegate.create = implementation;
	t.after(() => {
		pvgisEstimateDelegate.create = originalCreate;
	});
}

function mockPvgisEstimateFindFirst(
	t: { after: (callback: () => void) => void },
	implementation: (args: unknown) => Promise<unknown>,
) {
	const pvgisEstimateDelegate =
		prisma.pvgisEstimate as unknown as PvgisEstimateDelegateForTest;
	const originalFindFirst = pvgisEstimateDelegate.findFirst;

	pvgisEstimateDelegate.findFirst = implementation;
	t.after(() => {
		pvgisEstimateDelegate.findFirst = originalFindFirst;
	});
}

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

test("limite la recherche PVGIS au projet de l’utilisateur connecté", async (t) => {
	let receivedQuery: unknown;
	mockProjectFindFirst(t, async (query) => {
		receivedQuery = query;
		return null;
	});
	const result = createResponseRecorder();
	let forwardedError: unknown;

	await estimateProjectPvgis(createRequest(), result.response, (error) => {
		forwardedError = error;
	});

	const query = receivedQuery as { where?: unknown } | undefined;

	assert.deepEqual(query?.where, { id: projectId, userId });
	assert.equal(result.getStatusCode(), 404);
	assert.deepEqual(result.getPayload(), { error: "Projet introuvable" });
	assert.equal(forwardedError, undefined);
});

test("refuse une estimation PVGIS sans coordonnées de site", async (t) => {
	mockProjectFindFirst(t, async () => ({
		site: { latitude: null, longitude: 1.444 },
	}));
	const result = createResponseRecorder();

	await estimateProjectPvgis(createRequest(), result.response, () => undefined);

	assert.equal(result.getStatusCode(), 422);
	assert.deepEqual(result.getPayload(), {
		error:
			"Les coordonnées GPS du site sont nécessaires pour interroger PVGIS.",
	});
});

test("retourne une erreur temporaire lorsque PVGIS est indisponible", async (t) => {
	mockProjectFindFirst(t, async () => ({
		site: { latitude: 43.6045, longitude: 1.444 },
	}));
	t.mock.method(globalThis, "fetch", async () => {
		throw new Error("Erreur réseau");
	});
	const result = createResponseRecorder();

	await estimateProjectPvgis(createRequest(), result.response, () => undefined);

	assert.equal(result.getStatusCode(), 503);
	assert.deepEqual(result.getPayload(), {
		error:
			"PVGIS est temporairement indisponible. Réessaie dans quelques instants.",
	});
});

test("enregistre et retourne l’estimation PVGIS", async (t) => {
	mockProjectFindFirst(t, async () => ({
		site: { latitude: 43.6045, longitude: 1.444 },
	}));
	t.mock.method(globalThis, "fetch", async () => {
		return new Response(JSON.stringify(createPvgisPayload()), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	});
	const monthly = Array.from({ length: 12 }, (_, index) => ({
		month: index + 1,
		averageDailyIrradiationKwhPerM2: index + 1.1,
		monthlyIrradiationKwhPerM2: (index + 1) * 30,
		averageDailyProductionKwhPerKwp: index + 0.9,
		monthlyProductionKwhPerKwp: (index + 1) * 25,
	}));
	const savedEstimate = {
		id: "pvgis-estimate-1",
		projectId,
		calculatedAt: new Date("2026-06-24T10:00:00.000Z"),
		pvgisApiVersion: "5.3",
		latitude: 43.6045,
		longitude: 1.444,
		inclinationDeg: 30,
		azimuthDeg: 0,
		lossPercent: 14,
		technology: "crystSi",
		mountingPlace: "free",
		referencePeakPowerKwp: 1,
		annualIrradiationKwhPerM2: 1_540,
		annualProductionKwhPerKwp: 1_230,
		monthly,
	};
	let receivedCreateArgs: unknown;

	mockPvgisEstimateCreate(t, async (args) => {
		receivedCreateArgs = args;
		return savedEstimate;
	});
	const result = createResponseRecorder();

	await estimateProjectPvgis(createRequest(), result.response, () => undefined);

	const createData = (receivedCreateArgs as { data: unknown }).data;

	assert.deepEqual(createData, {
		projectId,
		latitude: 43.6045,
		longitude: 1.444,
		inclinationDeg: 30,
		azimuthDeg: 0,
		lossPercent: 14,
		technology: "crystSi",
		mountingPlace: "free",
		referencePeakPowerKwp: 1,
		annualIrradiationKwhPerM2: 1_540,
		annualProductionKwhPerKwp: 1_230,
		monthly,
	});
	assert.equal(result.getStatusCode(), 201);
	assert.deepEqual(result.getPayload(), {
		data: savedEstimate,
	});
});

test("retourne la dernière estimation PVGIS du projet", async (t) => {
	const savedEstimate = {
		id: "pvgis-estimate-1",
		projectId,
		calculatedAt: new Date("2026-06-24T10:00:00.000Z"),
		pvgisApiVersion: "5.3",
		latitude: 43.6045,
		longitude: 1.444,
		inclinationDeg: 30,
		azimuthDeg: 0,
		lossPercent: 14,
		technology: "crystSi",
		mountingPlace: "free",
		referencePeakPowerKwp: 1,
		annualIrradiationKwhPerM2: 1_540,
		annualProductionKwhPerKwp: 1_230,
		monthly: [],
	};
	let receivedQuery: unknown;

	mockPvgisEstimateFindFirst(t, async (query) => {
		receivedQuery = query;
		return savedEstimate;
	});
	const result = createResponseRecorder();

	await getLatestProjectPvgisEstimate(
		createRequest(),
		result.response,
		() => undefined,
	);

	assert.deepEqual(receivedQuery, {
		where: {
			projectId,
			project: { userId },
		},
		orderBy: {
			calculatedAt: "desc",
		},
	});
	assert.equal(result.getStatusCode(), 200);
	assert.deepEqual(result.getPayload(), { data: savedEstimate });
});

test("retourne 404 lorsqu’aucune estimation PVGIS n’existe", async (t) => {
	mockPvgisEstimateFindFirst(t, async () => null);
	const result = createResponseRecorder();

	await getLatestProjectPvgisEstimate(
		createRequest(),
		result.response,
		() => undefined,
	);

	assert.equal(result.getStatusCode(), 404);
	assert.deepEqual(result.getPayload(), {
		error: "Aucune estimation PVGIS n’est disponible pour ce projet.",
	});
});
