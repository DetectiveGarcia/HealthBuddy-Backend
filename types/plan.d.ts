export type PlanBody = {
    type: PlanCategory;
    plan: {
        [key: string]: any
    }
}

type PlanCategory= 'Diet' | 'Training'