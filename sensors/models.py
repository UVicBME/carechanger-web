from django.db import models
from django.contrib.auth.models import User

# https://docs.djangoproject.com/en/2.1/ref/models/fields/


class Sensor():
    patient = models.TextField()
    history = models.TextField()
    active = models.BooleanField()


class Patient(models.Model):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=40)
    age = models.IntegerField()
    care_group = models.CharField(max_length=50)


class CareGroup(models.Model):
    name = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    user_list = models.ManyToManyField(User)
    admin_email = models.EmailField(max_length=254)


class Data(models.Model):
    temperature = models.FloatField()
    humidity = models.FloatField()
    event = models.PositiveIntegerField(default=0)
    sensor_id = models.IntegerField(default=-1)
