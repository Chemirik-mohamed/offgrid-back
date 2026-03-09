import { z } from "zod";
export declare const createApplianceSchema: z.ZodObject<{
    slug: z.ZodString;
    name: z.ZodString;
    category: z.ZodEnum<{
        cold: "cold";
        it: "it";
        lighting: "lighting";
        kitchen: "kitchen";
        agriculture: "agriculture";
        misc: "misc";
    }>;
    typicalPowerW: z.ZodNumber;
    minPpowerW: z.ZodOptional<z.ZodNumber>;
    maxPpowerW: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type CreateApplianceInput = z.infer<typeof createApplianceSchema>;
//# sourceMappingURL=createApplianceSchema.d.ts.map