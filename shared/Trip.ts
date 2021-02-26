export class Trip {
    uuid: Number;
    name: string;
    start_date: Date;
    end_date: Date;
    loc_lat: Number;
    loc_long: Number;

    constructor(uuid: Number, name: string, start_date: Date, end_date: Date, loc_lat: Number, loc_long: Number) {
        this.uuid = uuid;
        this.name = name;
        this.start_date = start_date;
        this.end_date = end_date;
        this.loc_lat = loc_lat;
        this.loc_long = loc_long;
    }
}