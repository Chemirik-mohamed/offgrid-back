import { z } from "zod";

export const timeSlotSchema = z
	.object({
		label: z.enum(["morning", "noon", "evening", "night", "continuous"], {
			error: "Période horaire invalide",
		}),
		from: z.iso.time({
			error: "Heure de début invalide (format HH:MM attendu)",
		}),
		to: z.iso.time({ error: "Heure de fin invalide (format HH:MM attendu)" }),
	})
	.refine((data) => data.from !== data.to, {
		error: "L'heure de début et l'heure de fin ne peuvent pas être identiques",
	});

export type TimeSlotSchemaInput = z.infer<typeof timeSlotSchema>;
