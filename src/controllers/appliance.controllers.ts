import type { Request, Response } from "express";
import { querySchema } from "../schemas/QuerySchema.js";
import { prisma } from "../lib/prisma.js";
import { createApplianceSchema } from "../schemas/createApplianceSchema.js";
import { z } from "zod";

export async function getAppliance(req: Request, res: Response) {
	const parsed = querySchema.safeParse(req.query);

	if (!parsed.success) {
		return res.status(400).json({ error: z.treeifyError(parsed.error) });
	}

	const { category, q } = parsed.data;

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
	const parsed = createApplianceSchema.safeParse(req.body);

	if (!parsed.success) {
		return res.status(400).json({ error: z.treeifyError(parsed.error) });
	}

	const category = await prisma.category.findUnique({
		where: { slug: parsed.data.categorySlug },
	});

	if (!category) {
		return res.status(409).json({ error: "Category not found" });
	}

	const data = parsed.data;

	const appliance = await prisma.appliance.create({
		data: {
			name: data.name,
			slug: data.slug,
			categoryId: category.id,
			unitPowerW: data.unitPowerW,
			startupPowerW: data.startupPowerW,
			defaultDiversityFactor: data.defaultDiversityFactor,
			voltageV: data.voltageV,
			currentType: data.currentType,
		},
	});

	return res.status(201).json({ data: appliance });
}
