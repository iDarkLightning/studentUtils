import requests
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from google_trans_new import google_translator
from bs4 import BeautifulSoup

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

class ShapeInformationAPI(APIView):
    def get(self, request):
        shape = request.query_params.get("shape")
        data = requests.get(f"https://www.mathopenref.com/{shape}.html")
        if data.status_code == 404:
            return Response({"error": "This shape does not exist"}, status=status.HTTP_200_OK)

        soup = BeautifulSoup(data.content, 'html.parser')
        info = {}
        if soup.find("p"):
            info["description"] = " ".join(soup.find("p").get_text().split())

        props = soup.find_all("tr")
        attrs = []

        for attr in props:
            attrs.append(attr.find_all("td"))

        properties = []
        definitions = []

        for el in attrs:
            for e in el:
                if e.get("class") is None:
                    ...
                elif "gPropName" in e.get("class"):
                    properties.append(e.get_text())
                elif "gPropDef" in e.get("class"):
                    definition = " ".join(e.get_text().split()).split(".")
                    for line in definition:
                        if "see" in line.lower():
                            definition.remove(line)

                    definitions.append(".".join(definition))

        info["properties"] = [{"property": properties[i], "definition": definitions[i]} for i in range(len(properties))]

        topics = soup.find_all(class_="gSeeAlso")
        topic_info = []
        for topic in topics:
            if shape in topic.get_text().lower():
                ref = topic.get("href")
                topic_data = requests.get(f"https://www.mathopenref.com/{ref}")
                topic_soup = BeautifulSoup(topic_data.content, 'html.parser')

                if topic_soup.find(class_="gDefinition"):
                    topic_definition = topic_soup.find(class_="gDefinition").get_text()

                    topic_info.append([topic.get_text(), " ".join(topic_definition.split())])

        info["topic_definitions"] = topic_info

        return Response(info, status=status.HTTP_200_OK)
