from django.urls import path
from .views import DictionaryAPI, TranslatorAPI, MathInformationAPI, PeriodicTableAPI, QuadraticEquationAPI, PointsCalculatorAPI, SystemOfEquationsAPI

urlpatterns = [
    path('dictionary', DictionaryAPI.as_view()),
    path('translator', TranslatorAPI.as_view()),
    path('math_refs', MathInformationAPI.as_view()),
    path('periodic', PeriodicTableAPI.as_view()),
    path('quadratic', QuadraticEquationAPI.as_view()),
    path('points', PointsCalculatorAPI.as_view()),
    path('system_equations', SystemOfEquationsAPI.as_view()),
]