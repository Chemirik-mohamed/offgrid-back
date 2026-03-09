import type { Request, Response } from "express";
import { querySchema } from "../schemas/QuerySchema.js";
import { prisma } from "../lib/prisma.js";
import { createApplianceSchema } from "../schemas/appliances/createApplianceSchema.js";

export async function getAppliance(req: Request, res: Response) {
	const parsde = querySchema.safeParse(req.query);

	if (!parsde.success) {
		return res.status(400).json({ error: "invalid query " });
	}

	const appliance = await prisma.appliance.findMany({
		include: {
			category: {
				select: { name: true },
			},
		},
	});

	return res.json({
		data: appliance,
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
		return res.status(409).json({ error: "invalid category" });
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
