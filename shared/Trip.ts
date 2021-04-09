//Partial trip object which doesn't contain uuid for cases where no generated yet.
export class PartialTrip {
    name: string;
    start_date: Date;
    end_date: Date;
    lat: number;
    lng: number;
    text_loc: string;

    constructor({ name, start_date, end_date, lat, lng, text_loc }: { name: string; start_date: Date; end_date: Date; lat: number; lng: number; text_loc: string; }) {
        this.name = name;
        this.start_date = start_date;
        this.end_date = end_date;
        this.lat = lat;
        this.lng = lng;
        this.text_loc = text_loc;
    }
}

export class Trip extends PartialTrip{
    uuid: number;
    constructor({ uuid, name, start_date, end_date, lat, lng, text_loc }: { uuid: number; name: string; start_date: Date; end_date: Date; lat: number; lng: number; text_loc: string; }) {
        super({ name, start_date, end_date, lat, lng, text_loc });
        this.uuid=uuid;
    }
}