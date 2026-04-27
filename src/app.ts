import express from "express";
import cors from "cors";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { router } from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

export const app = express();
app.use(
	cors({
		origin: "http://localhost:5174",
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.all("/api/auth/{*splat}", toNodeHandler(auth));

app.use(express.json());

app.use("/api", router);
app.use(errorMiddleware);
