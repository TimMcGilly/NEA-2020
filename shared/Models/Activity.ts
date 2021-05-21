/**
 * Experience enum mirrors in DB
 */
export enum Experience {
    beginner,
    intermediate,
    expert
}

/**
 * style enum mirrors in DB
 */
export enum Style {
    casual,
    serious
}

export class Activity {
    public activityCatergory: ActivityCategory;
    public experience: Experience;
    public style: Style;


    constructor(params: Activity = {} as Activity) {
        // Allows for empty constructor to be passed in
        let { activityCatergory = new ActivityCategory(), experience = Experience.beginner, style = Style.casual } = params;

        this.activityCatergory = activityCatergory;
        this.experience = experience;
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