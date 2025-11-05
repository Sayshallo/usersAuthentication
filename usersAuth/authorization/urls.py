from django.urls import path
from . import views
from . import services

urlpatterns = [
    path('', views.start_page, name='home'),
    path('auth/', views.authorization_view, name='authorization'),
    path('lk/', views.lk_view, name='lk'),
    path('register/', services.add_user, name='register'),
    path('login/', services.log_in, name='login'),
    path('logout/', services.logout, name='logout'),
    path('update/', services.update_data, name='update'),
    path('delete/', services.soft_delete, name='soft_delete'),
]