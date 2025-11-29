export default class ClientListDataStruct {
    //define object model in database
    constructor(first_name, last_name, phone_number, dob) {
        this.id = Date.now()    ;
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone_number = phone_number;
        this.dob = dob;
    }
    //simple return to get name
    getFullName() {
        return `${this.first_name} ${this.last_name}`;
    }
}
