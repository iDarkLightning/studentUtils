from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('calculator', index),
    path('dictionary', index),
    path('translator', index)
]