import { prisma } from "../src/lib/prisma";

async function main() {
	console.log("seed démarré");

	await prisma.category.createMany({
		data: [
			{
				name: "IT",
				slug: "it-office",
			},
			{
				name: "COLD",
				slug: "cold-appliances",
			},
			{
				name: "LIGHTING",
				slug: "lighting",
			},
			{
				name: "KITCHEN",
				slug: "kitchen",
			},
			{
				name: "AGRICULTURE",
				slug: "agriculture",
			},
			{
				name: "MISC",
				slug: "misc",
			},
		],
		skipDuplicates: true,
	});
	const itCategory = await prisma.category.findFirstOrThrow({
		where: { name: "IT" },
	});
	const coldCategory = await prisma.category.findFirstOrThrow({
		where: { name: "COLD" },
	});

	await prisma.appliance.createMany({
		data: [
			{
				slug: "ridge-small",
				name: "Réfrigérateur",
				typicalPowerW: 150,
				categoryId: coldCategory.id,
				minPowerW: 80,
				maxPowerW: 250,
			},
			{
				slug: "laptop",
				name: "ordinateur portable",
				categoryId: itCategory.id,
				typicalPowerW: 65,
				minPowerW: 80,
				maxPowerW: 150,
			},
		],
		skipDuplicates: true,
	});
	await prisma.user.createMany({
		data: {
			name: "ayoub",
			email: "test@test.com",
		},
		skipDuplicates: true,
	});

	const userEmail = await prisma.user.findFirstOrThrow({
		where: { email: "amine@test.com" },
	});

	await prisma.project.createMany({
		data: [
			{
				name: "Projet Alpha",
				userId: userEmail.id,
			},
			{
				name: "Projet Beta",
				userId: userEmail.id,
			},
			{
				name: "Projet Gamma",
				userId: userEmail.id,
			},
		],
	});

	console.log("Seed terminé sans erreur ✅");
}

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
