from django.urls import path
from . import views
from . import services

urlpatterns = [
    path('/', views.index, name='edit_data'),
    path('/check_permission', services.check_permission, name='check_permission')
]