// User details without date of birth so anyone can access
export class PublicUserDetails {
    name: string;
    uuid: string;
    bio_description: string;
    avatar: string;
    constructor({ name, uuid, bio_description, avatar }: { name: string, uuid: string, bio_description: string, avatar: string }) {
        this.name = name;
        this.uuid = uuid;
        this.bio_description = bio_description;
        this.avatar = avatar;
    }
}

// User details with private info such as dob so only user who owns account can access
export class PrivateUserDetails extends PublicUserDetails {
    date_of_birth: Date;
    constructor({ name, uuid, date_of_birth, bio_description, avatar }: { name: string, uuid: string, date_of_birth: Date, bio_description: string, avatar: string }) {
        super({ name, uuid, bio_description, avatar });
        this.date_of_birth = date_of_birth;
    }
}

