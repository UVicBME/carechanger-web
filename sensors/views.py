from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import login, authenticate
from sensors.forms import PatientCreationForm, CareGroupCreationForm, SignUpForm, DataForm
from django.contrib.auth.password_validation import validate_password
import logging
logger = logging.getLogger(__name__)


def index(request, *args, **kwargs):
    return render(request, "index/index.html", {})


def dashboard(request, *args, **kwargs):
    return render(request, "dashboard/dashboard.html", {})


def add_patient(request, *args, **kwargs):
    # If the form has been submitted
    if request.method == 'POST':
        form = PatientCreationForm(request.POST) # Form bound to POST data
        if form.is_valid(): # If the form passes all validation rules
            form.save()
            return(redirect('dashboard')) # Redirect to the dashboard (TODO: change redirect location?)
    else:
        form = PatientCreationForm() # Unbound form
    return render(request, 'registration/addpatient.html', { 'form': form })


def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('index')
    else:
        form = SignUpForm()
    return render(request, 'registration/signup.html', {'form': form})


def add_care_group(request):
    if request.method == 'POST':
        form = CareGroupCreationForm(request.POST)
        if form.is_valid():
            validate_password(form.cleaned_data.get('password'))  # Ensure password is strong enough
            form.validate()  # Ensure password matches password_confirmation
            form.save()  # Save the form
            return redirect('dashboard')  # Redirect to the dashboard TODO: Add confirmation that group was added
    else:
        form = CareGroupCreationForm()
    return render(request, 'registration/addcaregroup.html', {'form': form})


def receive_data(request):
    if request.method == 'POST':
        form = DataForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponse("We got your data!")
    else:
        form = DataForm()
    print("FLAG!!!")
    print(request)
    logger.debug("FLAG!!!")
    logger.debug(request)
    return render(request, 'data/data.html', {'form': form})
