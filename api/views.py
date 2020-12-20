from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def sci_calc(request):
    return HttpResponse("<h1>Hello</h1>")
