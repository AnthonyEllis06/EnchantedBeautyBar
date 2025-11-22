from django.db import models

# Create your models here.
class Client(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    last_appointment_date = models.DateField(blank=True, null=True)
   
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Appointment(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    appointment_date = models.DateTimeField()
    service_provided = models.CharField(max_length=100)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Appointment for {self.client} on {self.appointment_date}"