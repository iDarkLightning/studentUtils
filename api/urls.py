from django.urls import path
from .views import DictionaryAPI, TranslatorAPI, ShapeInformationAPI

urlpatterns = [
    path('dictionary', DictionaryAPI.as_view()),
    path('translator', TranslatorAPI.as_view()),
    path('math_refs', ShapeInformationAPI.as_view())
]