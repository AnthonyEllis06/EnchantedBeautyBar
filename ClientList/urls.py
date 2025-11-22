from django.urls import path
from . import views
urlpatterns = [
    path("", views.index, name="index"),
    path("client/<int:client_id>/", views.detail, name="detail"),
    path("client/<int:client_id>/appointments/", views.appointments, name="appointments"),
    path("client/create/", views.create_client, name="create_client"),
    path("client/<int:client_id>/appointment/create/", views.create_appointment, name="create_appointment"),
]