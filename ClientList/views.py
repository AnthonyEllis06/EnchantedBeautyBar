from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Client, Appointment
import json
# Contains API for connecting to DB
# View for the client list index page
def index(request):
    return render(request, 'ClientList/index.html')
#client api connection
@csrf_exempt
def client_api(request):
    """Client list api connection
    
    Args:
        request (HttpRequest): The HTTP request can only be made to get a client or create a new client.

    Returns:
        JsonResponse: The JSON response containing client data.
    """
    #GET
    if request.method == 'GET':
        clients = Client.objects.all().values()
        #RESPONSE
        return JsonResponse(list(clients), safe=False)
    #POST
    elif request.method == 'POST':
        data = json.loads(request.body)
        client = Client.objects.create(
            first_name=data['first_name'],
            last_name=data['last_name'],
            date_of_birth=data['dob'],
            phone_number=data['phone_number']
        )
        #RESPONSE
        return JsonResponse({'id': client.id, 'first_name': client.first_name, 'last_name': client.last_name, 'phone_number': client.phone_number, 'date_of_birth': client.date_of_birth})
    
#appointment api connection    
@csrf_exempt
def appointment_api(request):
    """Appointment list api connection

    Args:
        request (HttpRequest): The HTTP request can only be made to get an appointment or create a new appointment.

    Returns:
        JsonResponse: The JSON response containing appointment data.
    """
    #GET
    if request.method == 'GET':
        appointments = Appointment.objects.all()
        data = [{
            'id': appointment.id, 
            'client_id': appointment.client_id, 
            'clientName': f"{appointment.client.first_name} {appointment.client.last_name}", 
            "date": appointment.appointment_date.strftime('%Y-%m-%d'), 
            "time": appointment.appointment_date.strftime('%H:%M'),
            "notes": appointment.notes
        } for appointment in appointments]
        #RESPONSE
        return JsonResponse(data, safe=False)
    #POST
    elif request.method == 'POST':
        data = json.loads(request.body)
        appointment = Appointment.objects.create(
            client_id=data['client_id'],
            appointment_date=f"{data['date']} {data['time']}",
            notes=data.get('notes')
        )
        #RESPONSE
        return JsonResponse({
            'id': appointment.id, 
            'client_id': appointment.client_id, 
            'message': 'Appointment created successfully'
        })
@csrf_exempt
def update_delete_AppointmentAPI(request, id):
    """Update and delete appointment list connection

    Args:
        request (HttpRequest): The HTTP request object.
        id (int): The ID of the appointment to update or delete.

    Returns:
        JsonResponse: The JSON response containing the result of the operation.
    """
    appointment = Appointment.objects.get(id = id)
    #update
    if request.method == 'PUT':
        data = json.loads(request.body)
        appointment.appointment_date = f"{data['date']} {data['time']}"
        appointment.notes = data.get('notes')
        appointment.save()
        return JsonResponse({'message':'Appointment Updated'})
    #delete
    elif request.method == 'DELETE':
        appointment.delete()
        return JsonResponse({'message': 'Appointment Deleted'})
        
    
    
    