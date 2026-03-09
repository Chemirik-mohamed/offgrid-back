import { z } from "zod";
export declare const CreateApplianceSchema: z.ZodObject<{
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
}, z.core.$strip>;
export type CreateApplianceInput = z.infer<typeof CreateApplianceSchema>;
//# sourceMappingURL=appliances.schema.d.ts.map