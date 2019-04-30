from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.db.models.signals import post_save

# https://docs.djangoproject.com/en/2.1/ref/models/fields/
class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, related_name='profile', on_delete=models.CASCADE)
    caregroupstate = models.IntegerField(null=True)

"""
    def __unicode__(self):  # __str__
        return unicode(self.userName)
"""

def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
post_save.connect(create_user_profile, sender=User)

class CareGroup(models.Model):
    name = models.CharField(max_length=254)
    password = models.CharField(max_length=254)
    users = models.ManyToManyField(User) # many users to many caregroups
    admin_email = models.EmailField(max_length=254)

# Each device
class Device(models.Model):
    history = models.TextField()
    active = models.BooleanField()
    caregroup = models.ForeignKey(CareGroup, on_delete=models.CASCADE) # many devices to one care group

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
    device = models.ForeignKey(Device, on_delete=models.PROTECT)
    patient = models.ForeignKey(Patient, null=True, on_delete=models.PROTECT) # this form, originally
