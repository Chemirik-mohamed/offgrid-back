import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";

export async function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const session = await auth.api.getSession({
		headers: new Headers(req.headers as Record<string, string>),
	});

	if (!session) {
		return res.status(401).json({ error: "unauthorized" });
	}

	req.user = session.user;

	next();
}
