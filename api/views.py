from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import requests
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
import wolframalpha

# Create your views here.
def sci_calc(request):
    app_id = "XY2VPQ-YE7EPX4RLW"
    client = wolframalpha.Client(app_id)
    print(request)
    res = client.query("potato")

    print(next(res.results).text)
    return HttpResponse(next(res.results).text)

class Dictionary(APIView):
    def get(self, request, format=None):
        word = request.query_params.get('word')
        lang = request.query_params.get('lang')
        print(lang)
        info = requests.get(f"https://api.dictionaryapi.dev/api/v2/entries/{lang}/{word}").json()

        if "title" in info:
            info["word"] = "Sorry, that word doesn't exist"
            return Response(info, status=status.HTTP_200_OK)

        if type(info) is list:
            info = info[0]

        if type(info["meanings"]) is dict:
            info["meanings"] = [info["meanings"]]

        return Response(info, status=status.HTTP_200_OK)
