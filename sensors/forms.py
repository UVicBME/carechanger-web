from django import forms
from django.contrib.auth.forms import UserCreationForm
from sensors.models import Patient
from django.contrib.auth.models import User

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

class SignUpForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=False, help_text='Optional.')
    last_name = forms.CharField(max_length=30, required=False, help_text='Optional.')
    email = forms.EmailField(max_length=254, help_text='Required. Inform a valid email address.')

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2', )
