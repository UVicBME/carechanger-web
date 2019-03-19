from django.shortcuts import render, redirect
from accounts.forms import SignUpForm

def SignUp(request):
    # If the form has been submitted
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            return(redirect('login'))
    else:
        form = SignUpForm()
    return render(request, 'registration/signup.html', { 'form': form })