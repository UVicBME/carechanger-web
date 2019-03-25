from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from sensors.forms import PatientCreationForm
from sensors.forms import SignUpForm
from django.views.generic.edit import CreateView
from django.contrib.auth.forms import UserCreationForm

# Create your views here.
def index(request, *args, **kwargs):
    # return HttpResponse('Hello from Python!')
    return render(request, "index/index.html", {})

def dashboard(request, *args, **kwargs):
    # return HttpResponse('Hello from Python!')
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
