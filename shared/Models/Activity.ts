/**
 * Experience enum mirrors in DB
 */
export enum Experience {
    beginner,
    intermediate,
    expert
}

export function StrToExperience(exStr: string|Experience): Experience{
    return Experience[exStr as keyof typeof Experience];
}

/**
 * style enum mirrors in DB
 */
export enum Style {
    casual,
    serious
}

export class Activity {
    public activityCategory: ActivityCategory;
    public experience: Experience;
    public style: Style;


    constructor(params: Activity = {} as Activity) {
        // Allows for empty constructor to be passed in
        let { activityCategory = new ActivityCategory(), experience = Experience.beginner, style = Style.casual } = params;

        this.activityCategory = activityCategory;
        this.experience = StrToExperience(experience);
        this.style = style;
    }
}

export class ActivityCategory {
    public type_id: number;
    public name: string;
    public faicon: string
    constructor(params: ActivityCategory = {} as ActivityCategory) {
        let { type_id = -1, name = "", faicon = "" } = params;

        this.type_id = type_id;
        this.name = name;
        this.faicon = faicon;
    }
}