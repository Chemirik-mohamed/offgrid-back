export const PVGIS_TECHNOLOGIES = [
	"crystSi",
	"crystSi2025",
	"CIS",
	"CdTe",
	"Unknown",
] as const;

export const PVGIS_MOUNTING_PLACES = ["free", "building"] as const;

export type PvgisTechnology = (typeof PVGIS_TECHNOLOGIES)[number];
export type PvgisMountingPlace = (typeof PVGIS_MOUNTING_PLACES)[number];

export type PvgisProductionEstimateInput = {
	latitude: number;
	longitude: number;
	inclinationDeg: number;
	azimuthDeg: number;
	lossPercent: number;
	technology: PvgisTechnology;
	mountingPlace: PvgisMountingPlace;
};

export type PvgisMonthlySolarData = {
	month: number;
	averageDailyIrradiationKwhPerM2: number;
	monthlyIrradiationKwhPerM2: number;
	averageDailyProductionKwhPerKwp: number;
	monthlyProductionKwhPerKwp: number;
};

export type PvgisProductionEstimate = {
	location: {
		latitude: number;
		longitude: number;
	};
	configuration: {
		inclinationDeg: number;
		azimuthDeg: number;
		lossPercent: number;
		technology: PvgisTechnology;
		mountingPlace: PvgisMountingPlace;
		referencePeakPowerKwp: number;
	};
	monthly: PvgisMonthlySolarData[];
	annual: {
		irradiationKwhPerM2: number;
		productionKwhPerKwp: number;
	};
};

export type PvgisErrorCode =
	| "UNAVAILABLE"
	| "REJECTED"
	| "INVALID_RESPONSE";

export class PvgisError extends Error {
	constructor(readonly code: PvgisErrorCode) {
		super(code);
		this.name = "PvgisError";
	}
}
