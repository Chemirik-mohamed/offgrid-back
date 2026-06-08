import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";
import { z } from "zod";
import { projectParamsSchema } from "../schemas/project.schema.js";
import { updateClientSchema } from "../schemas/client.schema.js";

export async function updateClient(
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

		const parsedBody = updateClientSchema.safeParse(req.body);
		if (!parsedBody.success) {
			return res.status(400).json({ error: z.treeifyError(parsedBody.error) });
		}

		const { id } = parsedParams.data;
		const body = parsedBody.data;

		const existing = await prisma.client.findFirst({
			where: { id, projects: { some: { userId: req.user.id } } },
		});

		if (!existing) {
			return res.status(404).json({ error: "Client introuvable" });
		}

		const dataToUpdate: Prisma.ClientUpdateInput = {
			...(body.name !== undefined && { name: body.name }),
			...(body.email !== undefined && { email: body.email }),
			...(body.phone !== undefined && { phone: body.phone }),
			...(body.address !== undefined && { address: body.address }),
			...(body.city !== undefined && { city: body.city }),
			...(body.zipCode !== undefined && { zipCode: body.zipCode }),
		};

		if (Object.keys(dataToUpdate).length === 0) {
			return res.status(400).json({ message: "Aucune donnée à mettre à jour" });
		}

		const client = await prisma.client.update({
			where: { id },
			data: dataToUpdate,
		});

		return res.status(200).json({ message: "update", data: client });
	} catch (error) {
		next(error);
	}
}
