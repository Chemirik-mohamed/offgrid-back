import { prisma } from "../src/lib/prisma";

async function main() {
	console.log("🌱 Seed started");

	// ─── 1. Categories ──────────────────────────────────────────────────
	console.log("  → Seeding categories...");
	const categories = [
		{ slug: "lighting", label: "Éclairage", displayOrder: 1 },
		{ slug: "refrigeration", label: "Froid", displayOrder: 2 },
		{ slug: "kitchen", label: "Cuisine", displayOrder: 3 },
		{ slug: "appliances", label: "Électroménager", displayOrder: 4 },
		{ slug: "computing", label: "Informatique", displayOrder: 5 },
		{ slug: "general", label: "Général", displayOrder: 6 },
		{ slug: "other", label: "Autre", displayOrder: 7 },
	];

	for (const category of categories) {
		await prisma.category.upsert({
			where: { slug: category.slug },
			update: category,
			create: category,
		});
	}

	const allCategories = await prisma.category.findMany();
	const categoryMap = Object.fromEntries(
		allCategories.map((cat) => [cat.slug, cat.id]),
	);

	function getCategoryId(slug: string): string {
		const id = categoryMap[slug];
		if (!id) {
			throw new Error(
				`Category slug "${slug}" not found. Seed categories first.`,
			);
		}
		return id;
	}

	// ─── 2. Appliances catalog ──────────────────────────────────────────
	console.log("  → Seeding appliances...");
	await prisma.appliance.createMany({
		skipDuplicates: true,
		data: [
			// Lighting
			{
				slug: "led-7-5w",
				name: "LED 7,5W",
				typicalPowerW: 7.5,
				categoryId: getCategoryId("lighting"),
			},
			{
				slug: "led-9w",
				name: "LED 9W",
				typicalPowerW: 9,
				categoryId: getCategoryId("lighting"),
			},
			{
				slug: "halogen-50w",
				name: "Halogène 50W",
				typicalPowerW: 50,
				categoryId: getCategoryId("lighting"),
			},
			{
				slug: "neon-tube-18w",
				name: "Tube néon 18W",
				typicalPowerW: 18,
				categoryId: getCategoryId("lighting"),
			},

			// Refrigeration
			{
				slug: "refrigerator",
				name: "Réfrigérateur",
				typicalPowerW: 40,
				minPowerW: 20,
				maxPowerW: 150,
				categoryId: getCategoryId("refrigeration"),
			},
			{
				slug: "freezer",
				name: "Congélateur",
				typicalPowerW: 60,
				minPowerW: 30,
				maxPowerW: 200,
				categoryId: getCategoryId("refrigeration"),
			},

			// Kitchen
			{
				slug: "food-processor",
				name: "Robot",
				typicalPowerW: 500,
				maxPowerW: 1500,
				categoryId: getCategoryId("kitchen"),
			},
			{
				slug: "espresso-machine",
				name: "Cafetière",
				typicalPowerW: 1000,
				categoryId: getCategoryId("kitchen"),
			},
			{
				slug: "induction-hob",
				name: "Plaques induction",
				typicalPowerW: 2500,
				categoryId: getCategoryId("kitchen"),
			},
			{
				slug: "dishwasher",
				name: "Lave-vaisselle",
				typicalPowerW: 1000,
				maxPowerW: 2000,
				categoryId: getCategoryId("kitchen"),
			},

			// Appliances
			{
				slug: "washing-machine",
				name: "Lave-linge",
				typicalPowerW: 1500,
				categoryId: getCategoryId("appliances"),
			},
			{
				slug: "vacuum-cleaner",
				name: "Aspirateur",
				typicalPowerW: 1500,
				categoryId: getCategoryId("appliances"),
			},

			// Computing
			{
				slug: "internet-box",
				name: "Box internet",
				typicalPowerW: 20,
				categoryId: getCategoryId("computing"),
			},
			{
				slug: "tablet",
				name: "Tablette",
				typicalPowerW: 15,
				categoryId: getCategoryId("computing"),
			},
			{
				slug: "printer",
				name: "Imprimante",
				typicalPowerW: 100,
				categoryId: getCategoryId("computing"),
			},
			{
				slug: "phone-charger",
				name: "Chargeur téléphone",
				typicalPowerW: 10,
				categoryId: getCategoryId("computing"),
			},

			// General
			{
				slug: "stereo",
				name: "Chaîne stéréo",
				typicalPowerW: 200,
				categoryId: getCategoryId("general"),
			},
			{
				slug: "bike-charger",
				name: "Recharge vélo",
				typicalPowerW: 300,
				categoryId: getCategoryId("general"),
			},
			{
				slug: "power-tools",
				name: "Outillage élec.",
				typicalPowerW: 100,
				categoryId: getCategoryId("general"),
			},
		],
	});

	// ─── 3. Clients ─────────────────────────────────────────────────────
	console.log("  → Seeding clients...");
	await prisma.client.createMany({
		skipDuplicates: true,
		data: [
			{
				name: "Famille Jansen",
				email: "jansen@email.com",
				phone: "+33 6 11 22 33 44",
				address: "Hameau du Villard",
				city: "Ceillac",
				zipCode: "05600",
			},
			{
				name: "SARL Montagne Verte",
				email: "contact@montagne-verte.fr",
				phone: "+33 4 92 00 11 22",
				address: "12 route des Alpes",
				city: "Briançon",
				zipCode: "05100",
			},
			{
				name: "M. Dupont Pierre",
				email: "pierre.dupont@gmail.com",
				phone: "+33 6 55 66 77 88",
				address: "3 chemin du Soleil",
				city: "Gap",
				zipCode: "05000",
			},
			{
				name: "Nicolas DURAND Énergie",
				email: "n.durand@durand-energie.fr",
				phone: "+33 6 88 22 45 19",
				address: "Route du Col d'Izoard",
				city: "Cervières",
				zipCode: "05100",
			},
			{
				name: "Association Lou Refuge",
				email: "contact@lou-refuge.fr",
				phone: "+33 4 92 45 67 89",
				address: "Chemin des Mélèzes",
				city: "Saint-Véran",
				zipCode: "05350",
			},
		],
	});

	const clients = await prisma.client.findMany();
	const clientMap = Object.fromEntries(
		clients
			.filter((c) => c.email !== null)
			.map((c) => [c.email as string, c.id]),
	);

	// ─── 4. Projects (one per status) ───────────────────────────────────
	const user = await prisma.user.findFirst({
		where: { email: "amine@test.com" },
	});

	if (!user) {
		console.log(
			"  ⚠️  User amine@test.com not found — skipping projects & sites",
		);
		console.log(
			"     Create a user via signup, then re-run: npx prisma db seed",
		);
		console.log("✅ Seed completed (partial)");
		return;
	}

	console.log("  → Seeding projects (one per status)...");

	// Helper: create a project with its site in one transaction
	async function createProjectWithSite(
		project: {
			name: string;
			description: string;
			status:
				| "DRAFT"
				| "CLIENT_PENDING"
				| "CLIENT_FILLED"
				| "IN_PROGRESS"
				| "COMPLETED";
			clientEmail: string;
			isPinned?: boolean;
		},
		site: {
			address: string;
			city: string;
			zipCode: string;
			latitude: number;
			longitude: number;
			altitudeM: number;
			accessType: "ROAD" | "CARRIAGE" | "FOOT";
			requiresFourWheelDrive?: boolean;
			lightningRisk: "LOW" | "MODERATE" | "HIGH";
			usagePeriods: string;
			dcBusVoltageV: number;
			autonomyDays: number;
			panelToBatteryDistanceM: number;
			pvMountingType: string;
			optimizePvInclination?: boolean;
			hasGenerator?: boolean;
			hasWindTurbine?: boolean;
			hasHydro?: boolean;
		},
	) {
		await prisma.project.create({
			data: {
				name: project.name,
				description: project.description,
				status: project.status,
				isPinned: project.isPinned ?? false,
				userId: user!.id,
				clientId: clientMap[project.clientEmail],
				site: {
					create: {
						address: site.address,
						city: site.city,
						zipCode: site.zipCode,
						latitude: site.latitude,
						longitude: site.longitude,
						altitudeM: site.altitudeM,
						accessType: site.accessType,
						requiresFourWheelDrive: site.requiresFourWheelDrive ?? false,
						lightningRisk: site.lightningRisk,
						usagePeriods: site.usagePeriods,
						dcBusVoltageV: site.dcBusVoltageV,
						autonomyDays: site.autonomyDays,
						panelToBatteryDistanceM: site.panelToBatteryDistanceM,
						pvMountingType: site.pvMountingType,
						optimizePvInclination: site.optimizePvInclination ?? false,
						hasGenerator: site.hasGenerator ?? false,
						hasWindTurbine: site.hasWindTurbine ?? false,
						hasHydro: site.hasHydro ?? false,
					},
				},
			},
		});
	}

	// DRAFT — projet tout juste créé, peu d'informations
	await createProjectWithSite(
		{
			name: "Maison Dupont",
			description:
				"Maison individuelle hors réseau. Informations préliminaires.",
			status: "DRAFT",
			clientEmail: "pierre.dupont@gmail.com",
		},
		{
			address: "3 chemin du Soleil",
			city: "Gap",
			zipCode: "05000",
			latitude: 44.5587,
			longitude: 6.0789,
			altitudeM: 735,
			accessType: "ROAD",
			lightningRisk: "LOW",
			usagePeriods: "Utilisation estivale",
			dcBusVoltageV: 24,
			autonomyDays: 2,
			panelToBatteryDistanceM: 10,
			pvMountingType: "ROOF_OVERLAY",
		},
	);

	// CLIENT_PENDING — formulaire envoyé au client, en attente
	await createProjectWithSite(
		{
			name: "Refuge Lou Refuge",
			description: "Formulaire d'étude envoyé au client, en attente de retour.",
			status: "CLIENT_PENDING",
			clientEmail: "contact@lou-refuge.fr",
		},
		{
			address: "Chemin des Mélèzes",
			city: "Saint-Véran",
			zipCode: "05350",
			latitude: 44.7019,
			longitude: 6.8703,
			altitudeM: 2042,
			accessType: "FOOT",
			requiresFourWheelDrive: false,
			lightningRisk: "MODERATE",
			usagePeriods: "Été et week-ends d'hiver",
			dcBusVoltageV: 48,
			autonomyDays: 3,
			panelToBatteryDistanceM: 25,
			pvMountingType: "GROUND_MOUNT",
		},
	);

	// CLIENT_FILLED — client a répondu, prêt à démarrer le dimensionnement
	await createProjectWithSite(
		{
			name: "Refuge Montagne Verte",
			description:
				"Retour client reçu. Prêt pour analyse PVGIS et dimensionnement.",
			status: "CLIENT_FILLED",
			clientEmail: "contact@montagne-verte.fr",
		},
		{
			address: "12 route des Alpes",
			city: "Briançon",
			zipCode: "05100",
			latitude: 44.8989,
			longitude: 6.6358,
			altitudeM: 1326,
			accessType: "CARRIAGE",
			requiresFourWheelDrive: true,
			lightningRisk: "MODERATE",
			usagePeriods: "Toute l'année, saisonnier renforcé l'hiver",
			dcBusVoltageV: 48,
			autonomyDays: 3,
			panelToBatteryDistanceM: 20,
			pvMountingType: "CHASSIS",
			hasGenerator: true,
		},
	);

	// IN_PROGRESS — dimensionnement en cours
	await createProjectWithSite(
		{
			name: "Gîte du Col d'Izoard",
			description:
				"Appliances saisis, calculs PVGIS en cours, choix batteries à valider.",
			status: "IN_PROGRESS",
			clientEmail: "n.durand@durand-energie.fr",
			isPinned: true,
		},
		{
			address: "Route du Col d'Izoard",
			city: "Cervières",
			zipCode: "05100",
			latitude: 44.8583,
			longitude: 6.735,
			altitudeM: 2360,
			accessType: "ROAD",
			requiresFourWheelDrive: true,
			lightningRisk: "HIGH",
			usagePeriods: "Toute l'année, occupation permanente",
			dcBusVoltageV: 48,
			autonomyDays: 4,
			panelToBatteryDistanceM: 15,
			pvMountingType: "GROUND_MOUNT",
			optimizePvInclination: true,
			hasGenerator: true,
			hasWindTurbine: true,
		},
	);

	// COMPLETED — dimensionnement terminé, rapport PDF généré
	await createProjectWithSite(
		{
			name: "Chalet Jansen",
			description:
				"Dimensionnement site isolé pour chalet en altitude à Ceillac. Autonomie 2,7 jours, batteries OPzV 48V. Rapport PDF généré.",
			status: "COMPLETED",
			clientEmail: "jansen@email.com",
		},
		{
			address: "Hameau du Villard",
			city: "Ceillac",
			zipCode: "05600",
			latitude: 44.676,
			longitude: 6.796,
			altitudeM: 1784,
			accessType: "CARRIAGE",
			requiresFourWheelDrive: false,
			lightningRisk: "HIGH",
			usagePeriods:
				"Toute l'année, week-ends prolongés printemps/automne, tous les jours été",
			dcBusVoltageV: 48,
			autonomyDays: 3,
			panelToBatteryDistanceM: 20,
			pvMountingType: "ROOF_INTEGRATED",
			hasGenerator: true,
		},
	);

	console.log("✅ Seed completed");
}

main()
	.catch((error) => {
		console.error("❌ Seed failed:", error);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
