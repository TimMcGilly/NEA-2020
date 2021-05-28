import { Activity } from "./Activity";

//Partial trip object which doesn't contain uuid for cases where no generated yet.
export class PartialTrip {
    name: string;
    start_date: Date;
    end_date: Date;
    lat: number;
    lng: number;
    text_loc: string;
    activites: Activity[];

    constructor({ name, start_date, end_date, lat, lng, text_loc, activites }:
        { name: string; start_date: Date; end_date: Date; lat: number; lng: number; text_loc: string; activites: Activity[] }) {
        this.name = name;
        this.start_date = new Date(start_date);
        this.end_date = new Date(end_date);
        this.lat = lat;
        this.lng = lng;
        this.text_loc = text_loc;
        this.activites = [];
        activites.forEach(a => this.activites.push(new Activity(a)));
    }
}

export class Trip extends PartialTrip {
    uuid: string;
    constructor({ uuid, name, start_date, end_date, lat, lng, text_loc, activites }:
        { uuid: string; name: string; start_date: Date; end_date: Date; lat: number; lng: number; text_loc: string; activites: Activity[] }) {
        super({ name, start_date, end_date, lat, lng, text_loc, activites })
        this.uuid = uuid;
    }
}