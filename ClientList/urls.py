from django.urls import path
from . import views
urlpatterns = [
    path("", views.index, name="index"),
    
    #client add api path
    path("api/clients/", views.client_api, name="client_api"),
    #appointment add api path
    path("api/appointments/",views.appointment_api, name="appointment_api"),
    #appointment update, delete api path
    path("api/appointments/<int:id>/", views.update_delete_AppointmentAPI, name="appointment_update_delete"),
]