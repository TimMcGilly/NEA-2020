/**
 * Experience enum mirrors in DB
 */
export enum Experience {
    beginner,
    intermediate,
    expert
}

export function StrToExperience(exStr: string|Experience): Experience{
    return Experience[exStr.toString().toLowerCase() as keyof typeof Experience];
}

/**
 * style enum mirrors in DB
 */
export enum Style {
    casual,
    serious
}

export function StrToStyle(styleStr: string|Style): Style{
    return Style[styleStr.toString().toLowerCase() as keyof typeof Style];
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
        this.style = StrToStyle(style);
    }

    
    
    public get ExperienceStr() : string {
        return Experience[this.experience];
    }

    public set ExperienceStr(ex: string){
        this.experience = StrToExperience(ex);
        console.log(StrToExperience(ex));
        console.log(ex);
    }
    
    public get StyleStr() : string {
        return Style[this.style];
    }

    public set StyleStr(stylestr: string) {
        this.style = StrToStyle(stylestr);
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