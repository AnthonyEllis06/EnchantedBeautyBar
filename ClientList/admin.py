from django.contrib import admin
from .models import Client, Appointment

# Register your models here.
admin.site.register(Client)
admin.site.register(Appointment)