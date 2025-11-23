export default class ClientListDataStruct {
    constructor(first_name, last_name, phone_number, dob) {
        this.id = Date.now()    ;
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone_number = phone_number;
        this.dob = dob;
    }

    getFullName() {
        return `${this.first_name} ${this.last_name}`;
    }
}
