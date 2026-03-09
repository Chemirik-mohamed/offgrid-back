import type { Request, Response } from "express";
import { querySchema } from "../schemas/QuerySchema.js";
import { prisma } from "../lib/prisma.js";
import { createCategory } from "../schemas/category/category.schema.js";

export async function getcategory(req: Request, res: Response) {
	const parsde = querySchema.safeParse(req.query);

	if (!parsde.success) {
		return res.status(400).json({ error: "invalid query " });
	}

	const category = await prisma.category.findMany();

	return res.json({
		data: category,
	});
}

export async function create(req: Request, res: Response) {
	const parsde = createCategory.safeParse(req.body);

	if (!parsde.success) {
		return res.status(401).json({ error: "invalid parsde" });
	}

	const data = parsde.data;

	const category = await prisma.category.create({
		data: {
			name: data.name,
			slug: data.slug,
		},
	});

	return res.status(201).json({ message: "create", data: category });
}
