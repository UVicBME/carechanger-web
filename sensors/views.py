from django.shortcuts import render, redirect
from sensors.forms import PatientCreationForm
from django.views.generic.edit import CreateView

# Create your views here.
def index(request, *args, **kwargs):
    # return HttpResponse('Hello from Python!')
    return render(request, "index/index.html", {})

def dashboard(request, *args, **kwargs):
    # return HttpResponse('Hello from Python!')
    return render(request, "dashboard/dashboard.html", {})

def AddPatient(request, *args, **kwargs):
    # If the form has been submitted
    if request.method == 'POST':
        form = PatientCreationForm(request.POST) # Form bound to POST data
        if form.is_valid(): # If the form passes all validation rules
            form.save()
            return(redirect('dashboard')) # Redirect to the dashboard (TODO: change redirect location?)
    else:
        form = PatientCreationForm() # Unbound form
    return render(request, 'registration/addpatient.html', { 'form': form })
