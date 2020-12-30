from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import requests
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from google_trans_new import google_translator

# Create your views here.
class DictionaryAPI(APIView):
    def get(self, request, format=None):
        word = request.query_params.get('word')
        lang = request.query_params.get('lang')

        info = requests.get(f"https://api.dictionaryapi.dev/api/v2/entries/{lang}/{word}").json()

        if "title" in info:
            info["word"] = "Sorry, that word doesn't exist"
            return Response(info, status=status.HTTP_200_OK)

        if type(info) is list:
            info = info[0]

        if type(info["meanings"]) is dict:
            info["meanings"] = [info["meanings"]]

        return Response(info, status=status.HTTP_200_OK)

class TranslatorAPI(APIView):
    def get(self, request):
        text = request.query_params.get("text")
        dest_lang = request.query_params.get("langtrans")
        src_lang = request.query_params.get("langsrc")
        trans = google_translator()

        if len(src_lang) == 0:
            translation = trans.translate(text, lang_tgt=dest_lang)
            print(translation)
            return Response(translation, status=status.HTTP_200_OK)
        else:
            translation = trans.translate(text, lang_src=src_lang, lang_tgt=dest_lang)
            return Response(translation, status=status.HTTP_200_OK)
