from django.db import models
from django.contrib.auth.models import User

# https://docs.djangoproject.com/en/2.1/ref/models/fields/

class CareGroup(models.Model):
    name = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    users = models.ManyToManyField(User) # many users to many caregroups
    admin_email = models.EmailField(max_length=254)

# Each device
class Device(models.Model):
    history = models.TextField()
    active = models.BooleanField()
    caregroup = models.ForeignKey(CareGroup, on_delete=models.CASCADE) # many devices to one care group

class Patient(models.Model):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=40)
    age = models.IntegerField()
    device = models.OneToOneField(Device, on_delete=models.PROTECT) # one patient to one device
    caregroup = models.ForeignKey(CareGroup, on_delete=models.CASCADE) # many patients to one care group

class Data(models.Model):
    temperature = models.FloatField()
    humidity = models.FloatField()
    event = models.PositiveIntegerField(default=0)
    time = models.DateTimeField()
    device = models.ForeignKey(Device, on_delete=models.PROTECT)
    patient = models.ForeignKey(Patient, on_delete=models.PROTECT) # this form, originally
