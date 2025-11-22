from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

from .models import Client, Appointment

# Create your views here.
def index(request):
    clientList = Client.objects.all()
    appointmentsList = Appointment.objects.all()
    template = loader.get_template('ClientList/index.html')
    context = {
        'clientList': clientList,
        'appointmentList': appointmentsList,
    }
    return HttpResponse(template.render(context, request))

def detail(request, client_id):
    return HttpResponse(f"Details for client with ID: {client_id}")
def appointments(request, client_id):
    return HttpResponse(f"Appointments for client with ID: {client_id}")
def create_client(request):
    return HttpResponse("Create a new client page.")
def create_appointment(request, client_id):
    return HttpResponse(f"Create a new appointment for client with ID: {client_id}")


