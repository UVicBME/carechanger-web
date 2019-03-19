from django import forms
from django.contrib.auth.forms import UserCreationForm
from sensors.models import Patient

# Form for adding a new patient to the database
class PatientCreationForm(forms.ModelForm):
    firstname = forms.CharField(max_length=20)
    lastname = forms.CharField(max_length=40)
    age = forms.IntegerField()

    class Meta:
        model = Patient
        fields = (
            'firstname',
            'lastname',
            'age',
        )