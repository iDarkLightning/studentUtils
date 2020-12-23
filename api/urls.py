from django.urls import path
from .views import Dictionary

urlpatterns = [
    path('dictionary', Dictionary.as_view())
]