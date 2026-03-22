import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { createProjectschema } from "../schemas/project/project.schema.js";

export async function getProject(req: Request, res: Response) {
	const projects = await prisma.project.findMany({
		where: { userId: req.user.id },
	});

	return res.json({ data: projects });
}

export async function createProject(req: Request, res: Response) {
	console.log(req.body);
	const parsde = createProjectschema.safeParse(req.body);

	if (!parsde.success) {
		return res.status(401).json({ error: "invalid query " });
	}
	const data = parsde.data;

	const project = await prisma.project.create({
		data: { name: data.name, userId: req.user.id },
	});

	res.status(201).json({ message: "create", data: project });
}
