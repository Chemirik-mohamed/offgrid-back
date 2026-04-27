import type { Request, Response } from "express";
import { querySchema } from "../schemas/QuerySchema.js";
import { prisma } from "../lib/prisma.js";
import { createApplianceSchema } from "../schemas/appliances/createApplianceSchema.js";
import { z } from "zod";

export async function getAppliance(req: Request, res: Response) {
	const parsde = querySchema.safeParse(req.query);

	if (!parsde.success) {
		return res.status(400).json({ error: z.treeifyError(parsde.error) });
	}

	const { category, q } = parsde.data;

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

	return res.json({
		data: appliances,
	});
}

export async function createAppliance(req: Request, res: Response) {
	const parsde = createApplianceSchema.safeParse(req.body);

	if (!parsde.success) {
		return res.status(409).json({ error: "invalid body" });
	}

	const category = await prisma.category.findUnique({
		where: { slug: parsde.data.categorySlug },
	});

	if (!category) {
		return res.status(409).json({ error: "Category not found" });
	}

	const data = parsde.data;

	const appliance = await prisma.appliance.create({
		data: {
			name: data.name,
			slug: data.slug,
			categoryId: category.id,
			typicalPowerW: data.typicalPowerW,
			minPowerW: data.minPowerW,
			maxPowerW: data.maxPowerW,
		},
	});

	return res.status(201).json({ data: appliance });
}
