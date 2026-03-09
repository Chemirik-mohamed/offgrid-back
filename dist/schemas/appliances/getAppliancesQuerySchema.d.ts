import { z } from "zod";
export declare const getApplianceQuerySchema: z.ZodObject<{
    fields: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string[] | undefined, string | undefined>>;
    category: z.ZodOptional<z.ZodString>;
    q: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
//# sourceMappingURL=getAppliancesQuerySchema.d.ts.map