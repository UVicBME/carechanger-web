from django.shortcuts import render

# Create your views here.
def index(request, *args, **kwargs):
    # return HttpResponse('Hello from Python!')
    return render(request, "index/index.html", {})

def dashboard(request, *args, **kwargs):
    # return HttpResponse('Hello from Python!')
    return render(request, "dashboard/dashboard.html", {})
