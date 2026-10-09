import type { TimeSlotSchemaInput } from "../schemas/timeSlotSchema.js";
import { timeSlotSchema } from "../schemas/timeSlotSchema.js";

const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR;

type ProjectApplianceConsumptionInput = {
	id: string;
	applianceId: string;
	quantity: number;
	timeSlots: unknown;
	unitPowerWSnapshot: number;
	startupPowerWSnapshot: number;
	defaultDiversityFactorSnapshot: number;
	diversityFactorOverride: number | null;
	appliance?: {
		name: string;
		slug: string;
	};
};

type TimeInterval = {
	startMinute: number;
	endMinute: number;
};

type HourlyProfileItem = {
	hour: number;
	energyWh: number;
	averagePowerW: number;
	demandPowerW: number;
};

function parseTimeToMinutes(time: string): number {
	const [hourString, minuteString] = time.split(":");

	if (hourString === undefined || minuteString === undefined) {
		throw new Error("Format d'heure invalide");
	}

	const hour = Number(hourString);
	const minute = Number(minuteString);

	if (Number.isNaN(hour) || Number.isNaN(minute)) {
		throw new Error("Format d'heure invalide");
	}

	return hour * 60 + minute;
}

function getTimeSlotIntervals(timeSlot: TimeSlotSchemaInput): TimeInterval[] {
	if (timeSlot.label === "continuous") {
		return [{ startMinute: 0, endMinute: MINUTES_PER_DAY }];
	}

	const fromTotalMinutes = parseTimeToMinutes(timeSlot.from);
	const toTotalMinutes = parseTimeToMinutes(timeSlot.to);

	if (fromTotalMinutes === toTotalMinutes) {
		throw new Error("Format d'heure invalide");
	}

	if (toTotalMinutes > fromTotalMinutes) {
		return [{ startMinute: fromTotalMinutes, endMinute: toTotalMinutes }];
	}

	return [
		{ startMinute: fromTotalMinutes, endMinute: MINUTES_PER_DAY },
		{ startMinute: 0, endMinute: toTotalMinutes },
	];
}

function mergeIntervals(intervals: TimeInterval[]): TimeInterval[] {
	const sortedIntervals = [...intervals].sort(
		(a, b) => a.startMinute - b.startMinute,
	);
	const mergedIntervals: TimeInterval[] = [];

	for (const interval of sortedIntervals) {
		const lastInterval = mergedIntervals.at(-1);

		if (
			lastInterval === undefined ||
			interval.startMinute > lastInterval.endMinute
		) {
			mergedIntervals.push({ ...interval });
			continue;
		}

		lastInterval.endMinute = Math.max(
			lastInterval.endMinute,
			interval.endMinute,
		);
	}

	return mergedIntervals;
}

function getTimeSlotsIntervals(
	timeSlots: TimeSlotSchemaInput[],
): TimeInterval[] {
	return mergeIntervals(timeSlots.flatMap(getTimeSlotIntervals));
}

function getIntervalOverlapMinutes(
	interval: TimeInterval,
	startMinute: number,
	endMinute: number,
): number {
	const overlapStart = Math.max(interval.startMinute, startMinute);
	const overlapEnd = Math.min(interval.endMinute, endMinute);

	return Math.max(0, overlapEnd - overlapStart);
}

function getDiversityFactor(
	projectAppliance: ProjectApplianceConsumptionInput,
): number {
	return (
		projectAppliance.diversityFactorOverride ??
		projectAppliance.defaultDiversityFactorSnapshot
	);
}

// Énergie : puissance unitaire pleine, sans foisonnement.
function getEnergyPowerW(
	projectAppliance: ProjectApplianceConsumptionInput,
): number {
	return projectAppliance.quantity * projectAppliance.unitPowerWSnapshot;
}

// Pointe foisonnée : basée sur la puissance de démarrage (onglet B, calibre onduleur)
function getDemandPowerW(
	projectAppliance: ProjectApplianceConsumptionInput,
): number {
	return (
		projectAppliance.quantity *
		projectAppliance.startupPowerWSnapshot *
		getDiversityFactor(projectAppliance)
	);
}

function createEmptyHourlyProfile(): HourlyProfileItem[] {
	return Array.from({ length: HOURS_PER_DAY }, (_, hour) => ({
		hour,
		energyWh: 0,
		averagePowerW: 0,
		demandPowerW: 0,
	}));
}

export function getTimeSlotDurationHours(
	timeSlot: TimeSlotSchemaInput,
): number {
	const durationMinutes = getTimeSlotIntervals(timeSlot).reduce(
		(total, interval) => total + interval.endMinute - interval.startMinute,
		0,
	);

	return durationMinutes / MINUTES_PER_HOUR;
}

export function getTimeSlotsTotalHours(
	timeSlots: TimeSlotSchemaInput[],
): number {
	const durationMinutes = getTimeSlotsIntervals(timeSlots).reduce(
		(total, interval) => total + interval.endMinute - interval.startMinute,
		0,
	);

	return durationMinutes / MINUTES_PER_HOUR;
}

export function calculateProjectHourlyProfile(
	projectAppliances: ProjectApplianceConsumptionInput[],
): HourlyProfileItem[] {
	const hourlyProfile = createEmptyHourlyProfile();

	for (const projectAppliance of projectAppliances) {
		const timeSlots = timeSlotSchema.array().parse(projectAppliance.timeSlots);
		const intervals = getTimeSlotsIntervals(timeSlots);
		const energyPowerW = getEnergyPowerW(projectAppliance);
		const demandPowerW = getDemandPowerW(projectAppliance);

		for (const hourProfile of hourlyProfile) {
			const hourStartMinute = hourProfile.hour * MINUTES_PER_HOUR;
			const hourEndMinute = hourStartMinute + MINUTES_PER_HOUR;
			const overlapMinutes = intervals.reduce(
				(total, interval) =>
					total +
					getIntervalOverlapMinutes(interval, hourStartMinute, hourEndMinute),
				0,
			);

			if (overlapMinutes === 0) {
				continue;
			}

			hourProfile.energyWh +=
				energyPowerW * (overlapMinutes / MINUTES_PER_HOUR);
			hourProfile.demandPowerW += demandPowerW;
		}
	}

	return hourlyProfile.map((hourProfile) => ({
		...hourProfile,
		averagePowerW: hourProfile.energyWh,
	}));
}

export function calculateProjectApplianceDailyWh(
	projectAppliance: ProjectApplianceConsumptionInput,
) {
	const timeSlots = timeSlotSchema.array().parse(projectAppliance.timeSlots);
	const totalHours = getTimeSlotsTotalHours(timeSlots);
	const diversityFactor = getDiversityFactor(projectAppliance);
	const energyPowerW = getEnergyPowerW(projectAppliance);
	const dailyWh = energyPowerW * totalHours;

	return {
		projectApplianceId: projectAppliance.id,
		applianceId: projectAppliance.applianceId,
		applianceName: projectAppliance.appliance?.name ?? null,
		applianceSlug: projectAppliance.appliance?.slug ?? null,
		quantity: projectAppliance.quantity,
		unitPowerW: projectAppliance.unitPowerWSnapshot,
		totalHours,
		diversityFactor,
		dailyWh,
		dailyKWh: dailyWh / 1000,
	};
}

export function calculateProjectDailyConsumption(
	projectAppliances: ProjectApplianceConsumptionInput[],
) {
	const appliances = projectAppliances.map(calculateProjectApplianceDailyWh);
	const hourlyProfile = calculateProjectHourlyProfile(projectAppliances);
	const totalDailyWh = appliances.reduce(
		(total, appliance) => total + appliance.dailyWh,
		0,
	);

	return {
		totalDailyWh,
		totalDailyKWh: totalDailyWh / 1000,
		hourlyProfile,
		appliances,
	};
}
