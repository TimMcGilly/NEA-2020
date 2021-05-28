import { Activity } from "./Activity";

export class SearchResult {
    public trip_uuid: number;
    public name: string;
    public bio_description: string;
    public avatar: string;
    public start_date: Date;
    public end_date: Date;
    public activites: Activity[];

    constructor(
        { trip_uuid, name, bio_description, avatar, start_date, end_date, activites }:
            {
                trip_uuid: number,
                name: string,
                bio_description: string,
                avatar: string,
                start_date: Date,
                end_date: Date,
                activites: Activity[]
            }) {

        this.trip_uuid = trip_uuid;
        this.name = name;
        this.bio_description = bio_description;
        this.avatar = avatar;
        this.start_date = new Date(start_date);
        this.end_date = new Date(end_date);
        this.activites = [];
        activites.forEach(a => this.activites.push(new Activity(a)));
    }
}