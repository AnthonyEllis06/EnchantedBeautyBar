import ClientListDataStruct from "/static/ClientList/js/ClientListDataStruct.js";
import AppointmentListDataStruct from "/static/ClientList/js/AppointmentListDataStruct.js";
import DoublyLinkedList from "/static/ClientList/js/DoublyLinkedList.js";

const { useState, useEffect} = React;
/**
 *  Scheduler Component
 * @returns {JSX.Element} The rendered Scheduler component.
 */
function Scheduler() {
    const [clients, setClients] = useState(new DoublyLinkedList());
    const [appointments, setAppointments] = useState(new DoublyLinkedList());

    const [selectedAppointment, setSelectedAppointment] = useState();
    const [DailyDate, setDailyDate] = useState(new Date().toISOString().split('T')[0] );

    const [clientForm, setClientForm] = useState({
        first_name: "",
        last_name: "",
        phone_number: "",
        dob: "",
    });

    const [appointmentForm, setAppointmentForm] = useState({
        date: "",
        time: "",
        client_id: "",
        clientName: "",
        notes: "",
    });

    //useEffect to handle rebuilding the doubly linked list
    useEffect(() => {
        fetch('/clientlist/api/clients/')
            .then(res => res.json())
            .then(data => {
                const newClientList = new DoublyLinkedList();
                data.forEach(currClient => {
                    const newClient = new ClientListDataStruct(
                        currClient.first_name,
                        currClient.last_name,
                        currClient.phone_number,
                        currClient.date_of_birth
                    );
                    newClient.id = currClient.id;
                    newClientList.add(newClient);
                });
                setClients(newClientList);
            });

        fetch('/clientlist/api/appointments/')
            .then(res => res.json())
            .then(data => {
                const newAppointmentList = new DoublyLinkedList();
                data.forEach( currAppointment => {
                    const newAppointment = new AppointmentListDataStruct(
                        currAppointment.date,
                        currAppointment.time,
                        currAppointment.client_id,
                        currAppointment.clientName,
                        currAppointment.notes
                    );
                    newAppointment.id = currAppointment.id;
                    newAppointmentList.add(newAppointment);
                });
                setAppointments(newAppointmentList);
            });
    }, []);

    //Handler functions
    // handle clear forms
    const clearForms = () => {
        setClientForm({first_name: "", last_name: "", phone_number: "", dob: ""});
        setAppointmentForm({date: "", time: "", client_id: "", clientName: "", notes: ""});
        setSelectedAppointment(null);
    };
    // handle add client
    const handleAddClient = () => {
        if(!clientForm.first_name || !clientForm.last_name) {
            alert("First name and last name are required.");
            return;
        }
        //form data to return
        const payload = { ...clientForm };
        if(payload.dob === ""){
            payload.dob = null;
        }

        //send back to server
        fetch('/clientlist/api/clients/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            const newClient = new ClientListDataStruct(
                clientForm.first_name,
                clientForm.last_name,
                clientForm.phone_number,
                clientForm.dob
            );
            newClient.id = data.id;
            // DoublyLinked List implementation
            const DoublyLinkedClients = new DoublyLinkedList();
            clients.toArray().forEach(client => DoublyLinkedClients.add(client));
            DoublyLinkedClients.add(newClient);
            setClients(DoublyLinkedClients);
            clearForms();
        })
}; 
    // handle select appointment
    const hangleSelectAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setAppointmentForm({
            date: appointment.date,
            time: appointment.time,
            client_id: appointment.client_id,
            clientName: appointment.clientName,
            notes: appointment.notes,
        });
    }
    // handle add appointment
    const handleAddAppointment = () => {
        if(!appointmentForm.date || !appointmentForm.time || !appointmentForm.client_id) {
            alert("Date, time, and client are required.");
            return;
        }
        //send to api to send to database
        fetch('/clientlist/api/appointments/',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(appointmentForm)
        })
        .then(res => res.json())
        .then(data => {
            const selectedClient = clients.toArray().find(currClient => currClient.id === parseInt(appointmentForm.client_id));
            const clientName = selectedClient ? selectedClient.getFullName() : "";
            const newAppointment = new AppointmentListDataStruct(
                appointmentForm.date,
                appointmentForm.time,
                appointmentForm.client_id,
                clientName,
                appointmentForm.notes
            );
            newAppointment.id = data.id
            // DoublyLinked List reuse for polymorphism
            const DoublyLinkedAppointments = new DoublyLinkedList();
            appointments.toArray().forEach(appt => DoublyLinkedAppointments.add(appt));
            DoublyLinkedAppointments.add(newAppointment);
            setAppointments(DoublyLinkedAppointments);
            clearForms();
        });
        
    };
    // Handle update appointment
    const handleUpdateAppointment = () => {
        if(!selectedAppointment) return;
        const url = `/clientlist/api/appointments/${selectedAppointment.id}/`;
        //updated to update database also
        fetch(url, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(appointmentForm)
        })
        .then(res => res.json())
        .then(data =>{
            const selectedAppointmentClient = clients.toArray().find(c => c.id === parseInt(appointmentForm.client_id));
            const clientName = selectedAppointmentClient ? selectedAppointmentClient.getFullName() : "";
            const doublyUpdatedAppointments = new DoublyLinkedList();
        
            appointments.toArray().forEach(appt => {
            //scans through appointments to find the selected appointment to update while also adding all other unchanged appointments to the new doubly linked list
            if(appt.id === selectedAppointment.id) {
                const updated = new AppointmentListDataStruct(
                    appointmentForm.date,
                    appointmentForm.time,
                    appointmentForm.client_id,
                    clientName,
                    appointmentForm.notes
                );
                updated.id = selectedAppointment.id;
                doublyUpdatedAppointments.add(updated);
            }
            else {
                doublyUpdatedAppointments.add(appt);
            }
        });
        setAppointments(doublyUpdatedAppointments);
        clearForms();
        })
        
    }
    // handle delete appointment
    const handleDeleteAppointment = () => {
        if(!selectedAppointment) return;
        const url = `/clientlist/api/appointments/${selectedAppointment.id}/`;
        fetch(url, {
            method: 'DELETE',
        })
        .then(res => res.json())
        .then(data => {
            const DoublyLinkedAppointments = new DoublyLinkedList();
            appointments.toArray().forEach(appt => {
            DoublyLinkedAppointments.add(appt);
            });

            DoublyLinkedAppointments.remove(selectedAppointment.id);
            setAppointments(DoublyLinkedAppointments);
            clearForms();
        })
        
    };
    
    // RENDER!!!
    return (
        <div className="container">
            {/* Header/Date Picker */}
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <h2>Daily Schedule</h2>
                <div>
                    <input type="date" value={DailyDate}
                    onChange={e => setDailyDate(e.target.value)}/>
                </div>
            </div>
            {/* Appointment Table */}
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Client</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Daily Schedule Table*/}
                    {appointments.toArray()
                        .filter(appt => appt.date === DailyDate)
                        .map((appt) => (
                        <tr key={appt.id}
                            onClick={() => hangleSelectAppointment(appt)}
                            style={{
                                cursor: "pointer",
                                backgroundColor: selectedAppointment && selectedAppointment.id === appt.id ? "#72a7ecff" : "transparent"
                            }}>
                            <td>{appt.time}</td>
                            <td>{appt.clientName}</td>
                            <td>{appt.notes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Client form */}
            <div className="form-selection">
                <h3>Add New Client</h3>
                <div className="input-group">
                    <label>First Name:</label>
                    <input type="text" value={clientForm.first_name}
                    onChange={e => setClientForm({...clientForm, first_name: e.target.value })}/>
                </div>
                <div className="input-group">
                    <label>Last Name:</label>
                    <input type="text" value={clientForm.last_name}
                    onChange={e => setClientForm({...clientForm, last_name: e.target.value })}/>
                </div>
                <div className="input-group">
                    <label>Phone Number:</label>
                    <input type="text" value={clientForm.phone_number}
                    onChange={e => setClientForm({...clientForm, phone_number: e.target.value })}/>
                </div>
                <button onClick={handleAddClient}>Add Client</button>
            </div>
            {/* appointment form */}
            <div className="form-selection">
                <h3>Add, Edit, Delete appointments</h3>
                <div className="input-group">
                    <label> Client: </label>
                    <select value={appointmentForm.client_id}
                    onChange={e => setAppointmentForm({...appointmentForm, client_id: e.target.value })}>
                        <option value="">Select Client</option>
                        {clients.toArray().map(client => (
                            <option key={client.id} value={client.id}>
                                {client.getFullName()}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Appointment Input Groups */}
                <div className="input-group">
                    <label>Date:</label>
                    <input type="date" value={appointmentForm.date}
                    onChange={e => setAppointmentForm({...appointmentForm, date: e.target.value })}/>
                </div> 
                <div className="input-group">
                    <label>Time:</label>
                    <input type="time" value={appointmentForm.time}
                    onChange={e => setAppointmentForm({...appointmentForm, time: e.target.value })}/>
                </div>
                <div className="input-group">
                    <label>Notes:</label>
                    <input type="text" value={appointmentForm.notes}
                    onChange={e => setAppointmentForm({...appointmentForm, notes: e.target.value })}/>
                </div>
                {/* Button render conditions */}
                <div style={{margin: "10px", display:"flex", gap:"10px"}}>
                    {!selectedAppointment && (
                        <button onClick={handleAddAppointment}>Add Appointment</button>
                    )}
                    {selectedAppointment && (
                        <>
                            <button onClick={handleUpdateAppointment}>Update Appointment</button>
                            <button onClick={handleDeleteAppointment}>Delete Appointment</button>
                            <button onClick={clearForms}>Clear Selection</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Scheduler />);