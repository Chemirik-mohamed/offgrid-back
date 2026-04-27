import type { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client.js";

export function errorMiddleware(
	error: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		if (error.code === "P2002") {
			// Essayer meta.target d'abord (Rust engine / versions récentes corrigées)
			const target =
				(error.meta?.target as string[]) ??
				(error.meta as any)?.driverAdapterError?.cause?.constraint?.fields;

			if (Array.isArray(target) && target.includes("email")) {
				return res.status(409).json({ message: "Cet email est déjà utilisé." });
			}

			if (Array.isArray(target) && target.includes("name")) {
				return res
					.status(409)
					.json({ message: "Ce nom de projet existe déjà." });
			}

			return res.status(409).json({ message: "Cette ressource existe déjà." });
		}

		if (error.code === "P2025") {
			return res.status(404).json({ message: "Ressource introuvable" });
		}
	}

	if (error instanceof Prisma.PrismaClientValidationError) {
		return res.status(400).json({ message: "Données invalides." });
	}
	console.error(error);
	return res.status(500).json({ message: "Erreur serveur " });
}
