from django.shortcuts import render

# Create your views here.
def index(request, *args, **kwargs):
    # return HttpResponse('Hello from Python!')
    return render(request, "index/index.html", {})

def db(request):

    greeting = Greeting()
    greeting.save()

    greetings = Greeting.objects.all()

    return render(request, "db.html", {"greetings": greetings})

def dashboard(request, *args, **kwargs):
    # return HttpResponse('Hello from Python!')
    return render(request, "dashboard/dashboard.html", {})
