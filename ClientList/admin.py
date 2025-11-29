from django.contrib import admin
from .models import Client, Appointment

# Register your models here.
#client model
admin.site.register(Client)
#appointment model
admin.site.register(Appointment)