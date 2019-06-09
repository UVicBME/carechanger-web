from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.db.models.signals import post_save

class CareGroup(models.Model):
    name = models.CharField(max_length=254, unique=True)
    password = models.CharField(max_length=254)
    users = models.ManyToManyField(settings.AUTH_USER_MODEL) # many users to many caregroups
    admin_email = models.EmailField(max_length=254)

class User(AbstractUser):
    active_caregroup = models.ForeignKey(CareGroup, related_name='%(class)s_active_caregroup', null=True, on_delete=models.SET_NULL)
    caregroups = models.ManyToManyField(CareGroup, related_name='%(class)s_caregroups')
"""
    say you want to list all users in a caregroup, without a "users" many to many relationship in model.
    then you have to parse through all userprofiles

"""

# https://docs.djangoproject.com/en/2.1/ref/models/fields/
class Device(models.Model):
    history = models.TextField()
    active = models.BooleanField(null=True) # Boolean for if this device currently recording for a patient
    caregroup = models.ForeignKey(CareGroup, on_delete=models.CASCADE) # many devices to one care group; if caregroup deleted cascade delete devices

class Patient(models.Model):
    STATUSES = (
        ('c', 'clean'),
        ('d', 'dirty'),
    )
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=40)
    age = models.IntegerField()
    device = models.OneToOneField(Device, null=True, on_delete=models.SET_NULL) # one patient to one device; if device deleted, set patient device to null
    caregroup = models.ForeignKey(CareGroup, null=True, on_delete=models.CASCADE) # many patients to one care group
    status = models.CharField(max_length=20, choices=STATUSES, default='c')
    last_event = models.DateTimeField(null=True)

class Data(models.Model):
    temperature = models.FloatField()
    humidity = models.FloatField()
    event = models.PositiveIntegerField(default=0)
    time = models.IntegerField()
    #device = models.IntegerField()
    device = models.ForeignKey(Device, on_delete=models.PROTECT)
    patient = models.ForeignKey(Patient, null=True, on_delete=models.PROTECT) # this form, originally
