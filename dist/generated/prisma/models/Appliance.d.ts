import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model Appliance
 *
 */
export type ApplianceModel = runtime.Types.Result.DefaultSelection<Prisma.$AppliancePayload>;
export type AggregateAppliance = {
    _count: ApplianceCountAggregateOutputType | null;
    _avg: ApplianceAvgAggregateOutputType | null;
    _sum: ApplianceSumAggregateOutputType | null;
    _min: ApplianceMinAggregateOutputType | null;
    _max: ApplianceMaxAggregateOutputType | null;
};
export type ApplianceAvgAggregateOutputType = {
    typicalPowerW: number | null;
    minPowerW: number | null;
    maxPowerW: number | null;
};
export type ApplianceSumAggregateOutputType = {
    typicalPowerW: number | null;
    minPowerW: number | null;
    maxPowerW: number | null;
};
export type ApplianceMinAggregateOutputType = {
    id: string | null;
    slug: string | null;
    name: string | null;
    category: $Enums.ApplianceCategory | null;
    typicalPowerW: number | null;
    minPowerW: number | null;
    maxPowerW: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ApplianceMaxAggregateOutputType = {
    id: string | null;
    slug: string | null;
    name: string | null;
    category: $Enums.ApplianceCategory | null;
    typicalPowerW: number | null;
    minPowerW: number | null;
    maxPowerW: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ApplianceCountAggregateOutputType = {
    id: number;
    slug: number;
    name: number;
    category: number;
    typicalPowerW: number;
    minPowerW: number;
    maxPowerW: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ApplianceAvgAggregateInputType = {
    typicalPowerW?: true;
    minPowerW?: true;
    maxPowerW?: true;
};
export type ApplianceSumAggregateInputType = {
    typicalPowerW?: true;
    minPowerW?: true;
    maxPowerW?: true;
};
export type ApplianceMinAggregateInputType = {
    id?: true;
    slug?: true;
    name?: true;
    category?: true;
    typicalPowerW?: true;
    minPowerW?: true;
    maxPowerW?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ApplianceMaxAggregateInputType = {
    id?: true;
    slug?: true;
    name?: true;
    category?: true;
    typicalPowerW?: true;
    minPowerW?: true;
    maxPowerW?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ApplianceCountAggregateInputType = {
    id?: true;
    slug?: true;
    name?: true;
    category?: true;
    typicalPowerW?: true;
    minPowerW?: true;
    maxPowerW?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ApplianceAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Appliance to aggregate.
     */
    where?: Prisma.ApplianceWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Appliances to fetch.
     */
    orderBy?: Prisma.ApplianceOrderByWithRelationInput | Prisma.ApplianceOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.ApplianceWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Appliances from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Appliances.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Appliances
    **/
    _count?: true | ApplianceCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: ApplianceAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: ApplianceSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ApplianceMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ApplianceMaxAggregateInputType;
};
export type GetApplianceAggregateType<T extends ApplianceAggregateArgs> = {
    [P in keyof T & keyof AggregateAppliance]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateAppliance[P]> : Prisma.GetScalarType<T[P], AggregateAppliance[P]>;
};
export type ApplianceGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ApplianceWhereInput;
    orderBy?: Prisma.ApplianceOrderByWithAggregationInput | Prisma.ApplianceOrderByWithAggregationInput[];
    by: Prisma.ApplianceScalarFieldEnum[] | Prisma.ApplianceScalarFieldEnum;
    having?: Prisma.ApplianceScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ApplianceCountAggregateInputType | true;
    _avg?: ApplianceAvgAggregateInputType;
    _sum?: ApplianceSumAggregateInputType;
    _min?: ApplianceMinAggregateInputType;
    _max?: ApplianceMaxAggregateInputType;
};
export type ApplianceGroupByOutputType = {
    id: string;
    slug: string;
    name: string;
    category: $Enums.ApplianceCategory;
    typicalPowerW: number;
    minPowerW: number | null;
    maxPowerW: number | null;
    createdAt: Date;
    updatedAt: Date;
    _count: ApplianceCountAggregateOutputType | null;
    _avg: ApplianceAvgAggregateOutputType | null;
    _sum: ApplianceSumAggregateOutputType | null;
    _min: ApplianceMinAggregateOutputType | null;
    _max: ApplianceMaxAggregateOutputType | null;
};
type GetApplianceGroupByPayload<T extends ApplianceGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ApplianceGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ApplianceGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ApplianceGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ApplianceGroupByOutputType[P]>;
}>>;
export type ApplianceWhereInput = {
    AND?: Prisma.ApplianceWhereInput | Prisma.ApplianceWhereInput[];
    OR?: Prisma.ApplianceWhereInput[];
    NOT?: Prisma.ApplianceWhereInput | Prisma.ApplianceWhereInput[];
    id?: Prisma.StringFilter<"Appliance"> | string;
    slug?: Prisma.StringFilter<"Appliance"> | string;
    name?: Prisma.StringFilter<"Appliance"> | string;
    category?: Prisma.EnumApplianceCategoryFilter<"Appliance"> | $Enums.ApplianceCategory;
    typicalPowerW?: Prisma.IntFilter<"Appliance"> | number;
    minPowerW?: Prisma.IntNullableFilter<"Appliance"> | number | null;
    maxPowerW?: Prisma.IntNullableFilter<"Appliance"> | number | null;
    createdAt?: Prisma.DateTimeFilter<"Appliance"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Appliance"> | Date | string;
};
export type ApplianceOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    typicalPowerW?: Prisma.SortOrder;
    minPowerW?: Prisma.SortOrderInput | Prisma.SortOrder;
    maxPowerW?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ApplianceWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    slug?: string;
    AND?: Prisma.ApplianceWhereInput | Prisma.ApplianceWhereInput[];
    OR?: Prisma.ApplianceWhereInput[];
    NOT?: Prisma.ApplianceWhereInput | Prisma.ApplianceWhereInput[];
    name?: Prisma.StringFilter<"Appliance"> | string;
    category?: Prisma.EnumApplianceCategoryFilter<"Appliance"> | $Enums.ApplianceCategory;
    typicalPowerW?: Prisma.IntFilter<"Appliance"> | number;
    minPowerW?: Prisma.IntNullableFilter<"Appliance"> | number | null;
    maxPowerW?: Prisma.IntNullableFilter<"Appliance"> | number | null;
    createdAt?: Prisma.DateTimeFilter<"Appliance"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Appliance"> | Date | string;
}, "id" | "slug">;
export type ApplianceOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    typicalPowerW?: Prisma.SortOrder;
    minPowerW?: Prisma.SortOrderInput | Prisma.SortOrder;
    maxPowerW?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ApplianceCountOrderByAggregateInput;
    _avg?: Prisma.ApplianceAvgOrderByAggregateInput;
    _max?: Prisma.ApplianceMaxOrderByAggregateInput;
    _min?: Prisma.ApplianceMinOrderByAggregateInput;
    _sum?: Prisma.ApplianceSumOrderByAggregateInput;
};
export type ApplianceScalarWhereWithAggregatesInput = {
    AND?: Prisma.ApplianceScalarWhereWithAggregatesInput | Prisma.ApplianceScalarWhereWithAggregatesInput[];
    OR?: Prisma.ApplianceScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ApplianceScalarWhereWithAggregatesInput | Prisma.ApplianceScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Appliance"> | string;
    slug?: Prisma.StringWithAggregatesFilter<"Appliance"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Appliance"> | string;
    category?: Prisma.EnumApplianceCategoryWithAggregatesFilter<"Appliance"> | $Enums.ApplianceCategory;
    typicalPowerW?: Prisma.IntWithAggregatesFilter<"Appliance"> | number;
    minPowerW?: Prisma.IntNullableWithAggregatesFilter<"Appliance"> | number | null;
    maxPowerW?: Prisma.IntNullableWithAggregatesFilter<"Appliance"> | number | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Appliance"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Appliance"> | Date | string;
};
export type ApplianceCreateInput = {
    id?: string;
    slug: string;
    name: string;
    category: $Enums.ApplianceCategory;
    typicalPowerW: number;
    minPowerW?: number | null;
    maxPowerW?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ApplianceUncheckedCreateInput = {
    id?: string;
    slug: string;
    name: string;
    category: $Enums.ApplianceCategory;
    typicalPowerW: number;
    minPowerW?: number | null;
    maxPowerW?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ApplianceUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumApplianceCategoryFieldUpdateOperationsInput | $Enums.ApplianceCategory;
    typicalPowerW?: Prisma.IntFieldUpdateOperationsInput | number;
    minPowerW?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    maxPowerW?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ApplianceUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumApplianceCategoryFieldUpdateOperationsInput | $Enums.ApplianceCategory;
    typicalPowerW?: Prisma.IntFieldUpdateOperationsInput | number;
    minPowerW?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    maxPowerW?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ApplianceCreateManyInput = {
    id?: string;
    slug: string;
    name: string;
    category: $Enums.ApplianceCategory;
    typicalPowerW: number;
    minPowerW?: number | null;
    maxPowerW?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ApplianceUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumApplianceCategoryFieldUpdateOperationsInput | $Enums.ApplianceCategory;
    typicalPowerW?: Prisma.IntFieldUpdateOperationsInput | number;
    minPowerW?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    maxPowerW?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ApplianceUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumApplianceCategoryFieldUpdateOperationsInput | $Enums.ApplianceCategory;
    typicalPowerW?: Prisma.IntFieldUpdateOperationsInput | number;
    minPowerW?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    maxPowerW?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ApplianceCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    typicalPowerW?: Prisma.SortOrder;
    minPowerW?: Prisma.SortOrder;
    maxPowerW?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ApplianceAvgOrderByAggregateInput = {
    typicalPowerW?: Prisma.SortOrder;
    minPowerW?: Prisma.SortOrder;
    maxPowerW?: Prisma.SortOrder;
};
export type ApplianceMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    typicalPowerW?: Prisma.SortOrder;
    minPowerW?: Prisma.SortOrder;
    maxPowerW?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ApplianceMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    typicalPowerW?: Prisma.SortOrder;
    minPowerW?: Prisma.SortOrder;
    maxPowerW?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ApplianceSumOrderByAggregateInput = {
    typicalPowerW?: Prisma.SortOrder;
    minPowerW?: Prisma.SortOrder;
    maxPowerW?: Prisma.SortOrder;
};
export type EnumApplianceCategoryFieldUpdateOperationsInput = {
    set?: $Enums.ApplianceCategory;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type ApplianceSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    slug?: boolean;
    name?: boolean;
    category?: boolean;
    typicalPowerW?: boolean;
    minPowerW?: boolean;
    maxPowerW?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["appliance"]>;
export type ApplianceSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    slug?: boolean;
    name?: boolean;
    category?: boolean;
    typicalPowerW?: boolean;
    minPowerW?: boolean;
    maxPowerW?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["appliance"]>;
export type ApplianceSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    slug?: boolean;
    name?: boolean;
    category?: boolean;
    typicalPowerW?: boolean;
    minPowerW?: boolean;
    maxPowerW?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["appliance"]>;
export type ApplianceSelectScalar = {
    id?: boolean;
    slug?: boolean;
    name?: boolean;
    category?: boolean;
    typicalPowerW?: boolean;
    minPowerW?: boolean;
    maxPowerW?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ApplianceOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "slug" | "name" | "category" | "typicalPowerW" | "minPowerW" | "maxPowerW" | "createdAt" | "updatedAt", ExtArgs["result"]["appliance"]>;
export type $AppliancePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Appliance";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        slug: string;
        name: string;
        category: $Enums.ApplianceCategory;
        typicalPowerW: number;
        minPowerW: number | null;
        maxPowerW: number | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["appliance"]>;
    composites: {};
};
export type ApplianceGetPayload<S extends boolean | null | undefined | ApplianceDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AppliancePayload, S>;
export type ApplianceCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ApplianceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ApplianceCountAggregateInputType | true;
};
export interface ApplianceDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Appliance'];
        meta: {
            name: 'Appliance';
        };
    };
    /**
     * Find zero or one Appliance that matches the filter.
     * @param {ApplianceFindUniqueArgs} args - Arguments to find a Appliance
     * @example
     * // Get one Appliance
     * const appliance = await prisma.appliance.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApplianceFindUniqueArgs>(args: Prisma.SelectSubset<T, ApplianceFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ApplianceClient<runtime.Types.Result.GetResult<Prisma.$AppliancePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Appliance that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ApplianceFindUniqueOrThrowArgs} args - Arguments to find a Appliance
     * @example
     * // Get one Appliance
     * const appliance = await prisma.appliance.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApplianceFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ApplianceFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ApplianceClient<runtime.Types.Result.GetResult<Prisma.$AppliancePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Appliance that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplianceFindFirstArgs} args - Arguments to find a Appliance
     * @example
     * // Get one Appliance
     * const appliance = await prisma.appliance.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApplianceFindFirstArgs>(args?: Prisma.SelectSubset<T, ApplianceFindFirstArgs<ExtArgs>>): Prisma.Prisma__ApplianceClient<runtime.Types.Result.GetResult<Prisma.$AppliancePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Appliance that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplianceFindFirstOrThrowArgs} args - Arguments to find a Appliance
     * @example
     * // Get one Appliance
     * const appliance = await prisma.appliance.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApplianceFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ApplianceFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ApplianceClient<runtime.Types.Result.GetResult<Prisma.$AppliancePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Appliances that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplianceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Appliances
     * const appliances = await prisma.appliance.findMany()
     *
     * // Get first 10 Appliances
     * const appliances = await prisma.appliance.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const applianceWithIdOnly = await prisma.appliance.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ApplianceFindManyArgs>(args?: Prisma.SelectSubset<T, ApplianceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AppliancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Appliance.
     * @param {ApplianceCreateArgs} args - Arguments to create a Appliance.
     * @example
     * // Create one Appliance
     * const Appliance = await prisma.appliance.create({
     *   data: {
     *     // ... data to create a Appliance
     *   }
     * })
     *
     */
    create<T extends ApplianceCreateArgs>(args: Prisma.SelectSubset<T, ApplianceCreateArgs<ExtArgs>>): Prisma.Prisma__ApplianceClient<runtime.Types.Result.GetResult<Prisma.$AppliancePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Appliances.
     * @param {ApplianceCreateManyArgs} args - Arguments to create many Appliances.
     * @example
     * // Create many Appliances
     * const appliance = await prisma.appliance.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ApplianceCreateManyArgs>(args?: Prisma.SelectSubset<T, ApplianceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Appliances and returns the data saved in the database.
     * @param {ApplianceCreateManyAndReturnArgs} args - Arguments to create many Appliances.
     * @example
     * // Create many Appliances
     * const appliance = await prisma.appliance.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Appliances and only return the `id`
     * const applianceWithIdOnly = await prisma.appliance.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ApplianceCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ApplianceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AppliancePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Appliance.
     * @param {ApplianceDeleteArgs} args - Arguments to delete one Appliance.
     * @example
     * // Delete one Appliance
     * const Appliance = await prisma.appliance.delete({
     *   where: {
     *     // ... filter to delete one Appliance
     *   }
     * })
     *
     */
    delete<T extends ApplianceDeleteArgs>(args: Prisma.SelectSubset<T, ApplianceDeleteArgs<ExtArgs>>): Prisma.Prisma__ApplianceClient<runtime.Types.Result.GetResult<Prisma.$AppliancePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Appliance.
     * @param {ApplianceUpdateArgs} args - Arguments to update one Appliance.
     * @example
     * // Update one Appliance
     * const appliance = await prisma.appliance.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ApplianceUpdateArgs>(args: Prisma.SelectSubset<T, ApplianceUpdateArgs<ExtArgs>>): Prisma.Prisma__ApplianceClient<runtime.Types.Result.GetResult<Prisma.$AppliancePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Appliances.
     * @param {ApplianceDeleteManyArgs} args - Arguments to filter Appliances to delete.
     * @example
     * // Delete a few Appliances
     * const { count } = await prisma.appliance.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ApplianceDeleteManyArgs>(args?: Prisma.SelectSubset<T, ApplianceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Appliances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplianceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Appliances
     * const appliance = await prisma.appliance.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ApplianceUpdateManyArgs>(args: Prisma.SelectSubset<T, ApplianceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Appliances and returns the data updated in the database.
     * @param {ApplianceUpdateManyAndReturnArgs} args - Arguments to update many Appliances.
     * @example
     * // Update many Appliances
     * const appliance = await prisma.appliance.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Appliances and only return the `id`
     * const applianceWithIdOnly = await prisma.appliance.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends ApplianceUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ApplianceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AppliancePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Appliance.
     * @param {ApplianceUpsertArgs} args - Arguments to update or create a Appliance.
     * @example
     * // Update or create a Appliance
     * const appliance = await prisma.appliance.upsert({
     *   create: {
     *     // ... data to create a Appliance
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Appliance we want to update
     *   }
     * })
     */
    upsert<T extends ApplianceUpsertArgs>(args: Prisma.SelectSubset<T, ApplianceUpsertArgs<ExtArgs>>): Prisma.Prisma__ApplianceClient<runtime.Types.Result.GetResult<Prisma.$AppliancePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Appliances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplianceCountArgs} args - Arguments to filter Appliances to count.
     * @example
     * // Count the number of Appliances
     * const count = await prisma.appliance.count({
     *   where: {
     *     // ... the filter for the Appliances we want to count
     *   }
     * })
    **/
    count<T extends ApplianceCountArgs>(args?: Prisma.Subset<T, ApplianceCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ApplianceCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Appliance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplianceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ApplianceAggregateArgs>(args: Prisma.Subset<T, ApplianceAggregateArgs>): Prisma.PrismaPromise<GetApplianceAggregateType<T>>;
    /**
     * Group by Appliance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplianceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends ApplianceGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ApplianceGroupByArgs['orderBy'];
    } : {
        orderBy?: ApplianceGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ApplianceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApplianceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Appliance model
     */
    readonly fields: ApplianceFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Appliance.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ApplianceClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the Appliance model
 */
export interface ApplianceFieldRefs {
    readonly id: Prisma.FieldRef<"Appliance", 'String'>;
    readonly slug: Prisma.FieldRef<"Appliance", 'String'>;
    readonly name: Prisma.FieldRef<"Appliance", 'String'>;
    readonly category: Prisma.FieldRef<"Appliance", 'ApplianceCategory'>;
    readonly typicalPowerW: Prisma.FieldRef<"Appliance", 'Int'>;
    readonly minPowerW: Prisma.FieldRef<"Appliance", 'Int'>;
    readonly maxPowerW: Prisma.FieldRef<"Appliance", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"Appliance", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Appliance", 'DateTime'>;
}
/**
 * Appliance findUnique
 */
export type ApplianceFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appliance
     */
    select?: Prisma.ApplianceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Appliance
     */
    omit?: Prisma.ApplianceOmit<ExtArgs> | null;
    /**
     * Filter, which Appliance to fetch.
     */
    where: Prisma.ApplianceWhereUniqueInput;
};
/**
 * Appliance findUniqueOrThrow
 */
export type ApplianceFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appliance
     */
    select?: Prisma.ApplianceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Appliance
     */
    omit?: Prisma.ApplianceOmit<ExtArgs> | null;
    /**
     * Filter, which Appliance to fetch.
     */
    where: Prisma.ApplianceWhereUniqueInput;
};
/**
 * Appliance findFirst
 */
export type ApplianceFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appliance
     */
    select?: Prisma.ApplianceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Appliance
     */
    omit?: Prisma.ApplianceOmit<ExtArgs> | null;
    /**
     * Filter, which Appliance to fetch.
     */
    where?: Prisma.ApplianceWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Appliances to fetch.
     */
    orderBy?: Prisma.ApplianceOrderByWithRelationInput | Prisma.ApplianceOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Appliances.
     */
    cursor?: Prisma.ApplianceWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Appliances from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Appliances.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Appliances.
     */
    distinct?: Prisma.ApplianceScalarFieldEnum | Prisma.ApplianceScalarFieldEnum[];
};
/**
 * Appliance findFirstOrThrow
 */
export type ApplianceFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appliance
     */
    select?: Prisma.ApplianceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Appliance
     */
    omit?: Prisma.ApplianceOmit<ExtArgs> | null;
    /**
     * Filter, which Appliance to fetch.
     */
    where?: Prisma.ApplianceWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Appliances to fetch.
     */
    orderBy?: Prisma.ApplianceOrderByWithRelationInput | Prisma.ApplianceOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Appliances.
     */
    cursor?: Prisma.ApplianceWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Appliances from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Appliances.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Appliances.
     */
    distinct?: Prisma.ApplianceScalarFieldEnum | Prisma.ApplianceScalarFieldEnum[];
};
/**
 * Appliance findMany
 */
export type ApplianceFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appliance
     */
    select?: Prisma.ApplianceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Appliance
     */
    omit?: Prisma.ApplianceOmit<ExtArgs> | null;
    /**
     * Filter, which Appliances to fetch.
     */
    where?: Prisma.ApplianceWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Appliances to fetch.
     */
    orderBy?: Prisma.ApplianceOrderByWithRelationInput | Prisma.ApplianceOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Appliances.
     */
    cursor?: Prisma.ApplianceWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Appliances from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Appliances.
     */
    skip?: number;
    distinct?: Prisma.ApplianceScalarFieldEnum | Prisma.ApplianceScalarFieldEnum[];
};
/**
 * Appliance create
 */
export type ApplianceCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appliance
     */
    select?: Prisma.ApplianceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Appliance
     */
    omit?: Prisma.ApplianceOmit<ExtArgs> | null;
    /**
     * The data needed to create a Appliance.
     */
    data: Prisma.XOR<Prisma.ApplianceCreateInput, Prisma.ApplianceUncheckedCreateInput>;
};
/**
 * Appliance createMany
 */
export type ApplianceCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Appliances.
     */
    data: Prisma.ApplianceCreateManyInput | Prisma.ApplianceCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Appliance createManyAndReturn
 */
export type ApplianceCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appliance
     */
    select?: Prisma.ApplianceSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Appliance
     */
    omit?: Prisma.ApplianceOmit<ExtArgs> | null;
    /**
     * The data used to create many Appliances.
     */
    data: Prisma.ApplianceCreateManyInput | Prisma.ApplianceCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Appliance update
 */
export type ApplianceUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appliance
     */
    select?: Prisma.ApplianceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Appliance
     */
    omit?: Prisma.ApplianceOmit<ExtArgs> | null;
    /**
     * The data needed to update a Appliance.
     */
    data: Prisma.XOR<Prisma.ApplianceUpdateInput, Prisma.ApplianceUncheckedUpdateInput>;
    /**
     * Choose, which Appliance to update.
     */
    where: Prisma.ApplianceWhereUniqueInput;
};
/**
 * Appliance updateMany
 */
export type ApplianceUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Appliances.
     */
    data: Prisma.XOR<Prisma.ApplianceUpdateManyMutationInput, Prisma.ApplianceUncheckedUpdateManyInput>;
    /**
     * Filter which Appliances to update
     */
    where?: Prisma.ApplianceWhereInput;
    /**
     * Limit how many Appliances to update.
     */
    limit?: number;
};
/**
 * Appliance updateManyAndReturn
 */
export type ApplianceUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appliance
     */
    select?: Prisma.ApplianceSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Appliance
     */
    omit?: Prisma.ApplianceOmit<ExtArgs> | null;
    /**
     * The data used to update Appliances.
     */
    data: Prisma.XOR<Prisma.ApplianceUpdateManyMutationInput, Prisma.ApplianceUncheckedUpdateManyInput>;
    /**
     * Filter which Appliances to update
     */
    where?: Prisma.ApplianceWhereInput;
    /**
     * Limit how many Appliances to update.
     */
    limit?: number;
};
/**
 * Appliance upsert
 */
export type ApplianceUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appliance
     */
    select?: Prisma.ApplianceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Appliance
     */
    omit?: Prisma.ApplianceOmit<ExtArgs> | null;
    /**
     * The filter to search for the Appliance to update in case it exists.
     */
    where: Prisma.ApplianceWhereUniqueInput;
    /**
     * In case the Appliance found by the `where` argument doesn't exist, create a new Appliance with this data.
     */
    create: Prisma.XOR<Prisma.ApplianceCreateInput, Prisma.ApplianceUncheckedCreateInput>;
    /**
     * In case the Appliance was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.ApplianceUpdateInput, Prisma.ApplianceUncheckedUpdateInput>;
};
/**
 * Appliance delete
 */
export type ApplianceDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appliance
     */
    select?: Prisma.ApplianceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Appliance
     */
    omit?: Prisma.ApplianceOmit<ExtArgs> | null;
    /**
     * Filter which Appliance to delete.
     */
    where: Prisma.ApplianceWhereUniqueInput;
};
/**
 * Appliance deleteMany
 */
export type ApplianceDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Appliances to delete
     */
    where?: Prisma.ApplianceWhereInput;
    /**
     * Limit how many Appliances to delete.
     */
    limit?: number;
};
/**
 * Appliance without action
 */
export type ApplianceDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appliance
     */
    select?: Prisma.ApplianceSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Appliance
     */
    omit?: Prisma.ApplianceOmit<ExtArgs> | null;
};
export {};
//# sourceMappingURL=Appliance.d.ts.map