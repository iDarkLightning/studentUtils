from django.urls import path
from .views import sci_calc

urlpatterns = [
    path('scicalc/', sci_calc)
]