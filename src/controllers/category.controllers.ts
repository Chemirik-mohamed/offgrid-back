import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { createCategorySchemas } from "../schemas/category/category.schema.js";

export async function getCategories(_req: Request, res: Response) {
	const categories = await prisma.category.findMany({
		orderBy: { displayOrder: "asc" },
	});

	return res.json({
		data: categories,
	});
}

export async function createCategory(req: Request, res: Response) {
	const parsed = createCategorySchemas.safeParse(req.body);

	if (!parsed.success) {
		return res.status(400).json({ error: "invalid parsde" });
	}

	const data = parsed.data;

	const category = await prisma.category.create({
		data: {
			label: data.label,
			slug: data.slug,
		},
	});

	return res.status(201).json({ message: "create", data: category });
}
