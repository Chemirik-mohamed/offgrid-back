import { getApplianceQuerySchema } from "../schemas/appliances/getAppliancesQuerySchema.js";
import { prisma } from "../lib/prisma.js";
import { createApplianceSchema, } from "../schemas/appliances/createApplianceSchema.js";
import { ApplianceCategory } from "../generated/prisma/enums.js";
export async function getAppliance(req, res) {
    const parsde = getApplianceQuerySchema.safeParse(req.query);
    if (!parsde.success) {
        return res.status(400).json({ error: "invalid query " });
    }
    const appliance = await prisma.appliance.findMany();
    return res.json({
        data: appliance,
    });
}
export async function createAppliance(req, res) {
    const parsde = createApplianceSchema.safeParse(req.body);
    if (!parsde.success) {
        return res.status(400).json({ error: "invalid body" });
    }
    const applianceData = parsde.data;
    const existing = await prisma.appliance.findUnique({
        where: { slug: applianceData.slug },
    });
    if (existing) {
        return res.status(400).json({ error: "appliance already exists" });
    }
    const categoryMap = {
        cold: ApplianceCategory.COLD,
        it: ApplianceCategory.IT,
        lighting: ApplianceCategory.LIGHTING,
        kitchen: ApplianceCategory.KITCHEN,
        agriculture: ApplianceCategory.AGRICULTURE,
        misc: ApplianceCategory.MISC,
    };
    const data = {
        slug: applianceData.slug,
        name: applianceData.name,
        category: categoryMap[applianceData.category],
        typicalPowerW: applianceData.typicalPowerW,
        ...(applianceData.minPpowerW !== undefined
            ? { minPowerW: applianceData.minPpowerW }
            : {}),
        ...(applianceData.maxPpowerW !== undefined
            ? { maxPowerW: applianceData.maxPpowerW }
            : {}),
    };
    const appliance = await prisma.appliance.create({
        data,
    });
    return res.status(201).json({
        data: appliance,
    });
}
//# sourceMappingURL=appliance.controllers.js.map