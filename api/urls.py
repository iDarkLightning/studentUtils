from django.urls import path
from .views import DictionaryAPI, TranslatorAPI, MathInformationAPI, PeriodicTableAPI

urlpatterns = [
    path('dictionary', DictionaryAPI.as_view()),
    path('translator', TranslatorAPI.as_view()),
    path('math_refs', MathInformationAPI.as_view()),
    path('periodic', PeriodicTableAPI.as_view())
]