export default class ClientListDataStruct {
    constructor(date, time, client_id, clientName, notes) {
        this.id = Date.now();
        this.date = date;
        this.time = time;
        this.client_id = client_id;
        this.clientName = clientName;
        this.notes = notes;
    }
    getAppointmentInfo() {
        return `Appointment for ${this.clientName} on ${this.date} at ${this.time}`;
    }
}