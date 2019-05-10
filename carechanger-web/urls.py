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
    path("adddevice/", sensors.views.add_device, name="adddevice"),
    path("addcaregroup/", sensors.views.add_care_group, name='addcaregroup'),
    path("", include('django.contrib.auth.urls')),
    path("signup/", sensors.views.signup, name='signup'),
    path("data/", sensors.views.receive_data, name='data'),
    path("login/", sensors.views.login, name='login'),
    url(r'^ajax/change_caregroup/$', sensors.views.ajax_change_caregroup, name='ajax_change_caregroup') # uses ajax to change the 'active_caregroup' value of a user in the database
]
