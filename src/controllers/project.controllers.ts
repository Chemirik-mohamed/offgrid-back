import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";
import { z } from "zod";

import {
	createProjectschema,
	projectParamsSchema,
	updateProjectschema,
} from "../schemas/project.schema.js";
import {
	addApplianceToProjectSchema,
	projectApplianceParamsSchema,
	updateProjectApplianceSchema,
} from "../schemas/addApplianceSchema.js";
import { updateSiteSchema } from "../schemas/site.scheam.js";

const projectInclude = {
	client: {
		select: {
			id: true,
			name: true,
			phone: true,
			email: true,
		},
	},
	site: true,
} as const;

export async function getProject(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const projects = await prisma.project.findMany({
			where: { userId: req.user.id },
			omit: {
				lastCalculationSnapshot: true,
			},
			include: projectInclude,
			orderBy: { createdAt: "desc" as const },
		});

		return res.json({ data: projects });
	} catch (error) {
		next(error);
	}
}

export async function getProjectById(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const parsedParams = projectParamsSchema.safeParse(req.params);

		if (!parsedParams.success) {
			return res
				.status(400)
				.json({ error: z.treeifyError(parsedParams.error) });
		}

		const { id } = parsedParams.data;

		const project = await prisma.project.findFirst({
			where: { id, userId: req.user.id },
			include: {
				...projectInclude,
				projectAppliances: {
					include: {
						appliance: {
							select: {
								id: true,
								name: true,
								slug: true,
								unitPowerW: true,
								startupPowerW: true,
							},
						},
					},
				},
			},
		});

		if (!project) {
			return res.status(404).json({ error: "Projet introuvable" });
		}

		return res.json({ data: project });
	} catch (error) {
		next(error);
	}
}

export async function createProject(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const parsed = createProjectschema.safeParse(req.body);

		if (!parsed.success) {
			return res.status(400).json({ error: z.treeifyError(parsed.error) });
		}
		const data = parsed.data;

		const dataCreate: Prisma.ProjectCreateInput = {
			name: data.name,
			description: data.description ?? null,
			...(data.status !== undefined && { status: data.status }),
			user: { connect: { id: req.user.id } },
			site: {
				create: {
					...data.site,
				},
			},
			...(data.client !== undefined && { client: { create: data.client } }),
		};

		const project = await prisma.project.create({
			data: dataCreate,
			include: projectInclude,
		});

		return res.status(201).json({ message: "create", data: project });
	} catch (error) {
		next(error);
	}
}

export async function updateProject(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const parsedParams = projectParamsSchema.safeParse(req.params);

		if (!parsedParams.success) {
			return res
				.status(400)
				.json({ error: z.treeifyError(parsedParams.error) });
		}

		const parsedBody = updateProjectschema.safeParse(req.body);

		if (!parsedBody.success) {
			return res.status(400).json({ error: z.treeifyError(parsedBody.error) });
		}

		const { id } = parsedParams.data;

		const dataToUpdate: Prisma.ProjectUpdateInput = {
			...(parsedBody.data.name !== undefined && { name: parsedBody.data.name }),
			...(parsedBody.data.description !== undefined && {
				description: parsedBody.data.description,
			}),
			...(parsedBody.data.isPinned !== undefined && {
				isPinned: parsedBody.data.isPinned,
			}),
			...(parsedBody.data.status !== undefined && {
				status: parsedBody.data.status,
			}),
		};
		if (Object.keys(dataToUpdate).length === 0) {
			return res.status(400).json({ message: "Aucune donnée à mettre à jour" });
		}

		const project = await prisma.project.update({
			where: { id, userId: req.user.id },
			data: dataToUpdate,
			include: projectInclude,
		});

		return res.status(200).json({ message: "update", data: project });
	} catch (error) {
		next(error);
	}
}

export async function deleteProject(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const parsedParams = projectParamsSchema.safeParse(req.params);

		if (!parsedParams.success) {
			return res
				.status(400)
				.json({ error: z.treeifyError(parsedParams.error) });
		}
		const { id } = parsedParams.data;

		await prisma.project.delete({
			where: { id, userId: req.user.id },
		});

		return res.status(200).json({ message: "delete" });
	} catch (error) {
		next(error);
	}
}
export async function updateProjectSite(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const parsedParams = projectParamsSchema.safeParse(req.params);
		if (!parsedParams.success) {
			return res
				.status(400)
				.json({ error: z.treeifyError(parsedParams.error) });
		}

		const parsedBody = updateSiteSchema.safeParse(req.body);
		if (!parsedBody.success) {
			return res.status(400).json({ error: z.treeifyError(parsedBody.error) });
		}

		const { id } = parsedParams.data;
		const body = parsedBody.data;

		const existing = await prisma.projectSite.findFirst({
			where: { id, project: { userId: req.user.id } },
		});

		if (!existing) {
			return res.status(404).json({ error: "Site introuvable" });
		}

		const dataToUpdate: Prisma.ProjectSiteUpdateInput = {
			...(body.address !== undefined && { address: body.address }),
			...(body.city !== undefined && { city: body.city }),
			...(body.zipCode !== undefined && { zipCode: body.zipCode }),
			...(body.latitude !== undefined && { latitude: body.latitude }),
			...(body.longitude !== undefined && { longitude: body.longitude }),
			...(body.altitudeM !== undefined && { altitudeM: body.altitudeM }),
			...(body.accessType !== undefined && { accessType: body.accessType }),
			...(body.requiresFourWheelDrive !== undefined && {
				requiresFourWheelDrive: body.requiresFourWheelDrive,
			}),
			...(body.lightningRisk !== undefined && {
				lightningRisk: body.lightningRisk,
			}),
			...(body.usagePeriods !== undefined && {
				usagePeriods: body.usagePeriods,
			}),
			...(body.dcBusVoltageV !== undefined && {
				dcBusVoltageV: body.dcBusVoltageV,
			}),
			...(body.autonomyDays !== undefined && {
				autonomyDays: body.autonomyDays,
			}),
			...(body.panelToBatteryDistanceM !== undefined && {
				panelToBatteryDistanceM: body.panelToBatteryDistanceM,
			}),
			...(body.pvMountingType !== undefined && {
				pvMountingType: body.pvMountingType,
			}),
			...(body.optimizePvInclination !== undefined && {
				optimizePvInclination: body.optimizePvInclination,
			}),
			...(body.hasGenerator !== undefined && {
				hasGenerator: body.hasGenerator,
			}),
			...(body.hasWindTurbine !== undefined && {
				hasWindTurbine: body.hasWindTurbine,
			}),
			...(body.hasHydro !== undefined && { hasHydro: body.hasHydro }),
		};

		if (Object.keys(dataToUpdate).length === 0) {
			return res.status(400).json({ message: "Aucune donnée à mettre à jour" });
		}

		const site = await prisma.projectSite.update({
			where: { id },
			data: dataToUpdate,
		});

		return res.status(200).json({ message: "update", data: site });
	} catch (error) {
		next(error);
	}
}

export async function deleteProjectAppliance(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const parsedParams = projectApplianceParamsSchema.safeParse(req.params);
		if (!parsedParams.success) {
			return res
				.status(400)
				.json({ error: z.treeifyError(parsedParams.error) });
		}

		const { id, applianceId } = parsedParams.data;

		const existing = await prisma.projectAppliance.findFirst({
			where: {
				id: applianceId,
				projectId: id,
				project: { userId: req.user.id },
			},
		});

		if (!existing) {
			return res
				.status(404)
				.json({ error: "Appareil introuvable dans ce projet" });
		}

		await prisma.projectAppliance.delete({ where: { id: applianceId } });

		return res.status(200).json({ message: "delete" });
	} catch (error) {
		next(error);
	}
}

export async function updateProjectAppliance(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const parsedParams = projectApplianceParamsSchema.safeParse(req.params);
		if (!parsedParams.success) {
			return res
				.status(400)
				.json({ error: z.treeifyError(parsedParams.error) });
		}

		const parsedBody = updateProjectApplianceSchema.safeParse(req.body);
		if (!parsedBody.success) {
			return res.status(400).json({ error: z.treeifyError(parsedBody.error) });
		}

		const { id, applianceId } = parsedParams.data;
		const body = parsedBody.data;

		const existing = await prisma.projectAppliance.findFirst({
			where: {
				id: applianceId,
				projectId: id,
				project: { userId: req.user.id },
			},
		});

		if (!existing) {
			return res
				.status(404)
				.json({ error: "Appareil introuvable dans ce projet" });
		}

		const dataToUpdate: Prisma.ProjectApplianceUpdateInput = {
			...(body.quantity !== undefined && { quantity: body.quantity }),
			...(body.timeSlots !== undefined && { timeSlots: body.timeSlots }),
			...(body.currentType !== undefined && { currentType: body.currentType }),
			...(body.diversityFactorOverride !== undefined && {
				diversityFactorOverride: body.diversityFactorOverride,
			}),
		};

		if (Object.keys(dataToUpdate).length === 0) {
			return res.status(400).json({ message: "Aucune donnée à mettre à jour" });
		}

		const projectAppliance = await prisma.projectAppliance.update({
			where: { id: applianceId },
			data: dataToUpdate,
		});

		return res.status(200).json({ message: "update", data: projectAppliance });
	} catch (error) {
		next(error);
	}
}

export async function addApplianceToProject(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const parsedParams = projectParamsSchema.safeParse(req.params);

		if (!parsedParams.success) {
			return res
				.status(400)
				.json({ error: z.treeifyError(parsedParams.error) });
		}

		const { id } = parsedParams.data;

		const parsedBody = addApplianceToProjectSchema.safeParse(req.body);

		if (!parsedBody.success) {
			return res.status(400).json({ error: z.treeifyError(parsedBody.error) });
		}
		const data = parsedBody.data;

		const project = await prisma.project.findFirst({
			where: { id, userId: req.user.id },
		});

		if (!project) {
			return res.status(404).json({ error: "Projet introuvable" });
		}

		const appliance = await prisma.appliance.findUnique({
			where: { id: data.applianceId },
		});

		if (!appliance) {
			return res.status(404).json({ error: "appliance introuvable" });
		}

		const projectAppliance = await prisma.projectAppliance.create({
			data: {
				projectId: id,
				...data,
				voltageVSnapshot: appliance.voltageV,
				unitPowerWSnapshot: appliance.unitPowerW,
				startupPowerWSnapshot: appliance.startupPowerW,
				defaultDiversityFactorSnapshot: appliance.defaultDiversityFactor,
			},
		});

		return res.status(201).json({ message: "create", data: projectAppliance });
	} catch (error) {
		next(error);
	}
}
