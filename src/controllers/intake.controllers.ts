import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";
import {
	intakeApplianceParamsSchema,
	intakeParamsSchema,
	submitIntakeSchema,
} from "../schemas/intakeSchema.js";
import {
	addApplianceToProjectSchema,
	updateProjectApplianceSchema,
} from "../schemas/addApplianceSchema.js";
import { projectParamsSchema } from "../schemas/project.schema.js";
import { z } from "zod";
import { querySchema } from "../schemas/QuerySchema.js";

function handleIntakeAccessError(
	intake: { expiresAt: Date | null; submittedAt: Date | null } | null,
	res: Response,
) {
	if (!intake) {
		res.status(404).json({ error: "Lien introuvable" });
		return true;
	}

	if (intake.expiresAt !== null && intake.expiresAt < new Date()) {
		res.status(410).json({ error: "Lien expiré" });
		return true;
	}

	if (intake.submittedAt !== null) {
		res.status(409).json({ error: "Formulaire déjà soumis" });
		return true;
	}

	return false;
}

export async function generateIntake(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const parsed = projectParamsSchema.safeParse(req.params);

		if (!parsed.success) {
			return res.status(400).json({ error: z.treeifyError(parsed.error) });
		}

		const { id } = parsed.data;

		const project = await prisma.project.findFirst({
			where: { id, userId: req.user.id },
			include: { intake: true },
		});

		if (!project) {
			return res.status(404).json({ error: "projet introuvable " });
		}

		const intake =
			project.intake ??
			(await prisma.clientIntake.create({ data: { projectId: project.id } }));

		if (project.status !== "CLIENT_PENDING") {
			await prisma.project.update({
				where: { id: project.id },
				data: { status: "CLIENT_PENDING" },
			});
		}
		const frontendUrl = process.env.FRONTEND_URL;

		return res.status(201).json({
			message: "intake generated",
			data: {
				token: intake.accessToken,
				url: `${frontendUrl}/intake/${intake.accessToken}`,
			},
		});
	} catch (error) {
		next(error);
	}
}

export async function getIntakeByToken(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const parsed = intakeParamsSchema.safeParse(req.params);

		if (!parsed.success) {
			return res.status(400).json({ error: z.treeifyError(parsed.error) });
		}

		const { token } = parsed.data;

		const intake = await prisma.clientIntake.findUnique({
			where: { accessToken: token },
			include: {
				project: {
					select: {
						id: true,
						name: true,
						description: true,
						status: true,
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
				},
			},
		});

		if (handleIntakeAccessError(intake, res)) {
			return;
		}
		if (!intake) {
			return;
		}

		const appliances = await prisma.appliance.findMany({
			select: {
				id: true,
				slug: true,
				name: true,
				currentType: true,
				voltageV: true,
				unitPowerW: true,
				startupPowerW: true,
				defaultDiversityFactor: true,
				category: {
					select: {
						slug: true,
						label: true,
					},
				},
			},
			orderBy: { name: "asc" },
		});

		return res.json({
			data: {
				project: {
					id: intake.project.id,
					name: intake.project.name,
					description: intake.project.description,
					status: intake.project.status,
				},
				projectAppliances: intake.project.projectAppliances,
				appliances,
			},
		});
	} catch (error) {
		next(error);
	}
}

export async function getIntakeCategories(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const parsed = intakeParamsSchema.safeParse(req.params);

		if (!parsed.success) {
			return res.status(400).json({ error: z.treeifyError(parsed.error) });
		}

		const { token } = parsed.data;

		const intake = await prisma.clientIntake.findUnique({
			where: { accessToken: token },
		});

		if (handleIntakeAccessError(intake, res)) {
			return;
		}
		if (!intake) {
			return;
		}

		const categories = await prisma.category.findMany({
			orderBy: { displayOrder: "asc" },
		});

		return res.status(200).json({
			data: categories,
		});
	} catch (error) {
		next(error);
	}
}
export async function getIntakeAppliances(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const parsed = intakeParamsSchema.safeParse(req.params);

		if (!parsed.success) {
			return res.status(400).json({ error: z.treeifyError(parsed.error) });
		}

		const parsedQuery = querySchema.safeParse(req.query);

		if (!parsedQuery.success) {
			return res.status(400).json({ error: z.treeifyError(parsedQuery.error) });
		}

		const { token } = parsed.data;
		const { category, q } = parsedQuery.data;

		const intake = await prisma.clientIntake.findFirst({
			where: { accessToken: token },
		});

		if (handleIntakeAccessError(intake, res)) {
			return;
		}

		const appliances = await prisma.appliance.findMany({
			where: {
				...(category !== undefined && {
					category: { slug: category },
				}),
				...(q !== undefined && {
					name: { contains: q, mode: "insensitive" },
				}),
			},
			include: {
				category: {
					select: { slug: true, label: true },
				},
			},
		});

		return res.status(200).json({
			data: appliances,
		});
	} catch (error) {
		next(error);
	}
}

export async function addIntakeAppliance(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const parsedParams = intakeParamsSchema.safeParse(req.params);

		if (!parsedParams.success) {
			return res
				.status(400)
				.json({ error: z.treeifyError(parsedParams.error) });
		}

		const parsedBody = addApplianceToProjectSchema.safeParse(req.body);

		if (!parsedBody.success) {
			return res.status(400).json({ error: z.treeifyError(parsedBody.error) });
		}

		const { token } = parsedParams.data;
		const data = parsedBody.data;

		const intake = await prisma.clientIntake.findUnique({
			where: { accessToken: token },
		});

		if (handleIntakeAccessError(intake, res)) {
			return;
		}
		if (!intake) {
			return;
		}

		const appliance = await prisma.appliance.findUnique({
			where: { id: data.applianceId },
		});

		if (!appliance) {
			return res.status(404).json({ error: "appliance introuvable" });
		}

		const projectAppliance = await prisma.projectAppliance.create({
			data: {
				projectId: intake.projectId,
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

export async function deleteIntakeAppliance(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const parsedParams = intakeApplianceParamsSchema.safeParse(req.params);

		if (!parsedParams.success) {
			return res
				.status(400)
				.json({ error: z.treeifyError(parsedParams.error) });
		}

		const { token, id } = parsedParams.data;

		const intake = await prisma.clientIntake.findUnique({
			where: { accessToken: token },
		});

		if (handleIntakeAccessError(intake, res)) {
			return;
		}
		if (!intake) {
			return;
		}

		const existing = await prisma.projectAppliance.findFirst({
			where: {
				id,
				projectId: intake.projectId,
			},
		});

		if (!existing) {
			return res
				.status(404)
				.json({ error: "Appareil introuvable dans ce projet" });
		}

		await prisma.projectAppliance.delete({ where: { id } });

		return res.status(200).json({ message: "delete" });
	} catch (error) {
		next(error);
	}
}

export async function updateIntakeAppliance(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const parsedParams = intakeApplianceParamsSchema.safeParse(req.params);

		if (!parsedParams.success) {
			return res
				.status(400)
				.json({ error: z.treeifyError(parsedParams.error) });
		}

		const parsedBody = updateProjectApplianceSchema.safeParse(req.body);

		if (!parsedBody.success) {
			return res.status(400).json({ error: z.treeifyError(parsedBody.error) });
		}

		const { token, id } = parsedParams.data;
		const body = parsedBody.data;

		const intake = await prisma.clientIntake.findUnique({
			where: { accessToken: token },
		});

		if (handleIntakeAccessError(intake, res)) {
			return;
		}
		if (!intake) {
			return;
		}

		const existing = await prisma.projectAppliance.findFirst({
			where: {
				id,
				projectId: intake.projectId,
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
			where: { id },
			data: dataToUpdate,
		});

		return res.status(200).json({ message: "update", data: projectAppliance });
	} catch (error) {
		next(error);
	}
}

export async function submitIntake(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const parsedParams = intakeParamsSchema.safeParse(req.params);

		if (!parsedParams.success) {
			return res
				.status(400)
				.json({ error: z.treeifyError(parsedParams.error) });
		}

		const parsedBody = submitIntakeSchema.safeParse(req.body);

		if (!parsedBody.success) {
			return res.status(400).json({ error: z.treeifyError(parsedBody.error) });
		}

		const { token } = parsedParams.data;
		const { appliances } = parsedBody.data;

		const intake = await prisma.clientIntake.findUnique({
			where: { accessToken: token },
		});

		if (handleIntakeAccessError(intake, res)) {
			return;
		}
		if (!intake) {
			return;
		}

		const applianceIds = appliances.map((appliance) => appliance.applianceId);
		const uniqueApplianceIds = [...new Set(applianceIds)];
		const catalogAppliances = await prisma.appliance.findMany({
			where: { id: { in: uniqueApplianceIds } },
		});

		if (catalogAppliances.length !== uniqueApplianceIds.length) {
			return res.status(404).json({ error: "Un appareil est introuvable" });
		}

		const appliancesById = new Map(
			catalogAppliances.map((appliance) => [appliance.id, appliance]),
		);

		const projectAppliances = await prisma.$transaction(async (tx) => {
			const createdProjectAppliances = await Promise.all(
				appliances.map((applianceInput) => {
					const appliance = appliancesById.get(applianceInput.applianceId);

					if (!appliance) {
						throw new Error("Appliance not found after validation");
					}

					return tx.projectAppliance.create({
						data: {
							projectId: intake.projectId,
							...applianceInput,
							voltageVSnapshot: appliance.voltageV,
							unitPowerWSnapshot: appliance.unitPowerW,
							startupPowerWSnapshot: appliance.startupPowerW,
							defaultDiversityFactorSnapshot: appliance.defaultDiversityFactor,
						},
					});
				}),
			);

			await tx.clientIntake.update({
				where: { id: intake.id },
				data: { submittedAt: new Date() },
			});

			await tx.project.update({
				where: { id: intake.projectId },
				data: { status: "CLIENT_FILLED" },
			});

			return createdProjectAppliances;
		});

		return res.status(201).json({
			message: "intake submitted",
			data: { projectAppliances },
		});
	} catch (error) {
		next(error);
	}
}
