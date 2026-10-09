import { prisma } from "../../lib/prisma.js";
import type { PvgisProductionEstimate } from "./pvgis.types.js";

export function createPvgisEstimate(
	projectId: string,
	estimate: PvgisProductionEstimate,
) {
	return prisma.pvgisEstimate.create({
		data: {
			projectId,
			latitude: estimate.location.latitude,
			longitude: estimate.location.longitude,
			inclinationDeg: estimate.configuration.inclinationDeg,
			azimuthDeg: estimate.configuration.azimuthDeg,
			lossPercent: estimate.configuration.lossPercent,
			technology: estimate.configuration.technology,
			mountingPlace: estimate.configuration.mountingPlace,
			referencePeakPowerKwp: estimate.configuration.referencePeakPowerKwp,
			annualIrradiationKwhPerM2: estimate.annual.irradiationKwhPerM2,
			annualProductionKwhPerKwp: estimate.annual.productionKwhPerKwp,
			monthly: estimate.monthly,
		},
	});
}

export function findLatestPvgisEstimate(projectId: string, userId: string) {
	return prisma.pvgisEstimate.findFirst({
		where: {
			projectId,
			project: {
				userId,
			},
		},
		orderBy: {
			calculatedAt: "desc",
		},
	});
}
