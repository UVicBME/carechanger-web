from django import forms
from django.contrib.auth.forms import UserCreationForm, User
from sensors.models import Patient, CareGroup, Data
from django.contrib.auth.hashers import make_password


# Form for adding a new patient to the database
class PatientCreationForm(forms.ModelForm):
    first_name = forms.CharField(max_length=20)
    last_name = forms.CharField(max_length=40)
    age = forms.IntegerField()

    class Meta:
        model = Patient
        fields = (
            'first_name',
            'last_name',
            'age',
        )


# Form for user creation TODO: Send a confirmation email to the provided address
class SignUpForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=False, help_text='Optional.')
    last_name = forms.CharField(max_length=30, required=False, help_text='Optional.')
    email = forms.EmailField(max_length=254, help_text='Required. Inform a valid email address.')

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2', )


# Form for care group creation TODO: Send a confirmation email to the provided admin address
class CareGroupCreationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput, required=True)
    password_confirmation = forms.CharField(widget=forms.PasswordInput, required=True)

    class Meta:
        model = CareGroup
        fields = (
            'name',
            'password',
            'password_confirmation',
            'admin_email',
        )

    # Overrides the default save method to include password hashing
    def save(self, commit=True):
        instance = super(CareGroupCreationForm, self).save(commit=False)
        instance.password = make_password(self.cleaned_data['password'])  # Make the password hashed before saving
        if commit:
            instance.save()  # Save the form
        return instance

    # Validates that password and password_confirmation match
    def validate(self):
        # Get the cleaned data for password and password_confirmation
        password = self.cleaned_data.get("password")
        password_confirmation = self.cleaned_data.get("password_confirmation")
        # Throws an error if the passwords don't match
        if password and password_confirmation and password_confirmation != password:
            raise forms.ValidationError("Passwords do not match.")
        return password_confirmation


# Form for receiving data
class DataForm(forms.ModelForm):

    class Meta:
        model = Data
        fields = (
            'temperature',
            'humidity',
            'event',
        )
