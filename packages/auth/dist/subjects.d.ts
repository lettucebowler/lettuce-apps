import * as v from "valibot";
export declare const subjects: {
    user: v.ObjectSchema<{
        readonly provider: v.PicklistSchema<["github"], undefined>;
        readonly providerId: v.StringSchema<undefined>;
        readonly username: v.StringSchema<undefined>;
    }, undefined>;
};
