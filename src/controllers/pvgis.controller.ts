import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import {
	createPvgisEstimate,
	findLatestPvgisEstimate,
} from "../services/pvgis/pvgis.repository.js";
import { projectParamsSchema } from "../schemas/project.schema.js";
import {
	pvgisCoordinatesSchema,
	pvgisEstimateSchema,
} from "../schemas/pvgis.schema.js";
import { getPvgisProductionEstimate } from "../services/pvgis/pvgis.client.js";
import { PvgisError } from "../services/pvgis/pvgis.types.js";

export async function estimateProjectPvgis(
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

		const parsedBody = pvgisEstimateSchema.safeParse(req.body);
		if (!parsedBody.success) {
			return res.status(400).json({ error: z.treeifyError(parsedBody.error) });
		}

		const project = await prisma.project.findFirst({
			where: { id: parsedParams.data.id, userId: req.user.id },
			select: {
				site: {
					select: {
						latitude: true,
						longitude: true,
					},
				},
			},
		});

		if (!project) {
			return res.status(404).json({ error: "Projet introuvable" });
		}

		if (project.site?.latitude == null || project.site.longitude == null) {
			return res.status(422).json({
				error:
					"Les coordonnées GPS du site sont nécessaires pour interroger PVGIS.",
			});
		}

		const parsedCoordinates = pvgisCoordinatesSchema.safeParse({
			latitude: project.site.latitude,
			longitude: project.site.longitude,
		});

		if (!parsedCoordinates.success) {
			return res.status(422).json({
				error: "Les coordonnées GPS enregistrées pour ce site sont invalides.",
			});
		}

		const estimate = await getPvgisProductionEstimate({
			...parsedCoordinates.data,
			...parsedBody.data,
		});

		const savedEstimate = await createPvgisEstimate(
			parsedParams.data.id,
			estimate,
		);
		return res.status(201).json({ data: savedEstimate });
	} catch (error) {
		if (error instanceof PvgisError) {
			if (error.code === "UNAVAILABLE") {
				return res.status(503).json({
					error:
						"PVGIS est temporairement indisponible. Réessaie dans quelques instants.",
				});
			}

			if (error.code === "REJECTED") {
				return res.status(422).json({
					error: "PVGIS ne peut pas produire de données pour ces paramètres.",
				});
			}

			return res.status(502).json({
				error: "PVGIS a renvoyé une réponse inexploitable.",
			});
		}

		next(error);
	}
}

export async function getLatestProjectPvgisEstimate(
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

		const estimate = await findLatestPvgisEstimate(
			parsedParams.data.id,
			req.user.id,
		);

		if (!estimate) {
			return res.status(404).json({
				error: "Aucune estimation PVGIS n’est disponible pour ce projet.",
			});
		}

		return res.json({ data: estimate });
	} catch (error) {
		next(error);
	}
}
