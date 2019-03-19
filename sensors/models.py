from django.db import models
from django.contrib.auth.models import User

# https://docs.djangoproject.com/en/2.1/ref/models/fields/
# Create your models here.
# Create your models here.
class Sensor():
    patient = models.TextField()
    history = models.TextField()
    active = models.BooleanField()

class Patient(models.Model):
    firstname = models.CharField(max_length=20)
    lastname = models.CharField(max_length=40)
    age = models.IntegerField()