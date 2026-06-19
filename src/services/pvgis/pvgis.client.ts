import { mapPvgisProductionEstimate } from "./pvgis.mapper.js";
import {
	PvgisError,
	type PvgisProductionEstimate,
	type PvgisProductionEstimateInput,
} from "./pvgis.types.js";

const PVGIS_PVCALC_URL = "https://re.jrc.ec.europa.eu/api/v5_3/PVcalc";
const PVGIS_REQUEST_TIMEOUT_MS = 10_000;
const REFERENCE_PEAK_POWER_KWP = 1;

function createPvgisUrl(input: PvgisProductionEstimateInput): URL {
	const url = new URL(PVGIS_PVCALC_URL);

	url.searchParams.set("lat", String(input.latitude));
	url.searchParams.set("lon", String(input.longitude));
	url.searchParams.set("peakpower", String(REFERENCE_PEAK_POWER_KWP));
	url.searchParams.set("loss", String(input.lossPercent));
	url.searchParams.set("pvtechchoice", input.technology);
	url.searchParams.set("mountingplace", input.mountingPlace);
	url.searchParams.set("angle", String(input.inclinationDeg));
	url.searchParams.set("aspect", String(input.azimuthDeg));
	url.searchParams.set("outputformat", "json");

	return url;
}

export async function getPvgisProductionEstimate(
	input: PvgisProductionEstimateInput,
): Promise<PvgisProductionEstimate> {
	const abortController = new AbortController();
	const timeout = setTimeout(
		() => abortController.abort(),
		PVGIS_REQUEST_TIMEOUT_MS,
	);

	try {
		let response: Response;

		try {
			response = await fetch(createPvgisUrl(input), {
				headers: { Accept: "application/json" },
				signal: abortController.signal,
			});
		} catch {
			throw new PvgisError("UNAVAILABLE");
		}

		if (!response.ok) {
			throw new PvgisError(
				response.status >= 500 ? "UNAVAILABLE" : "REJECTED",
			);
		}

		let payload: unknown;

		try {
			payload = await response.json();
		} catch {
			throw new PvgisError("INVALID_RESPONSE");
		}

		return mapPvgisProductionEstimate(input, payload);
	} finally {
		clearTimeout(timeout);
	}
}
