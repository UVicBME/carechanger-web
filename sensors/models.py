from django.db import models
from django.contrib.auth.models import User

# https://docs.djangoproject.com/en/2.1/ref/models/fields/
# Create your models here.
# Create your models here.
class Sensor():
    patient = models.TextField()
    history = models.TextField()
    active = models.BooleanField()

class Patient():
    firstname = models.TextField()
    lastname = models.TextField()
