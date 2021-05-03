// User details without date of birth so anyone can access
export class PublicUserDetails{
    name: string;
    uuid: string;
    dob: Date;
    constructor({name, uuid, dob}: {name: string, uuid: string, dob: Date}) {
        this.name = name;
        this.uuid = uuid;
        this.dob = dob;
    }
}

// User details with private info such as dob so only user who owns account can access
export class PrivateUserDetails extends PublicUserDetails{
    bio: string;
    constructor({name, uuid, dob, bio}: {name: string, uuid: string, dob: Date, bio: string}) {
        super({name, uuid, dob});
        this.bio = bio;
    }
}

