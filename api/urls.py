from django.urls import path
from .views import DictionaryAPI, TranslatorAPI

urlpatterns = [
    path('dictionary', DictionaryAPI.as_view()),
    path('translator', TranslatorAPI.as_view())
]