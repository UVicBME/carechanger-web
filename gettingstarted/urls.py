from django.urls import path, include

from django.contrib import admin

admin.autodiscover()

import hello.views
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
    path("db/", sensors.views.db, name="db"),
    path("dashboard/", sensors.views.dashboard, name="db"),
    path("admin/", admin.site.urls),
    path("accounts/", include('django.contrib.auth.urls')),
]
