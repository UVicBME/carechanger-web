from django.urls import path, include
from django.conf.urls import url
from django.contrib import admin

admin.autodiscover()

import sensors.views

# To add a new path, first import the app:
# import blog
#
# Then add the new path:
# path('blog/', blog.urls, name="blog")
#
# Learn more here: https://docs.djangoproject.com/en/2.1/topics/http/urls/

urlpatterns = [
    path("", sensors.views.index, name="index"),
    path("dashboard/", sensors.views.dashboard, name="dashboard"),
    path("admin/", admin.site.urls),
    path("addpatient/", sensors.views.add_patient, name="addpatient"),
    path("", include('django.contrib.auth.urls')),
    path("signup/", sensors.views.signup, name='signup'),
]
