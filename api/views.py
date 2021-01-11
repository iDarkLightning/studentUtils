import requests
import sympy
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from google_trans_new import google_translator
from bs4 import BeautifulSoup
import json
import math
from ast import literal_eval
from .SystemOfEquations import SystemOfEquations

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
            return Response(translation, status=status.HTTP_200_OK)
        else:
            translation = trans.translate(text, lang_src=src_lang, lang_tgt=dest_lang)
            return Response(translation, status=status.HTTP_200_OK)

class MathInformationAPI(APIView):
    def get(self, request):
        query = request.query_params.get("shape").lower()
        data = requests.get(f"https://www.mathopenref.com/{query}.html")
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
            #if query in topic.get_text().lower():
            ref = topic.get("href")
            topic_data = requests.get(f"https://www.mathopenref.com/{ref}")
            topic_soup = BeautifulSoup(topic_data.content, 'html.parser')

            if topic_soup.find(class_="gDefinition"):
                topic_definition = topic_soup.find(class_="gDefinition").get_text()

                topic_info.append([topic.get_text(), " ".join(topic_definition.split())])

        info["topic_definitions"] = topic_info

        return Response(info, status=status.HTTP_200_OK)

class PeriodicTableAPI(APIView):
    def get(self, request):
        with open("periodic.json", "r", encoding="utf-8") as elements_json:
            elements = json.loads(elements_json.read())

        query = request.query_params.get("element")
        element = {}

        if len(query) <= 2 and all(i.isalpha() for i in query):
            element["info"] = list(filter(lambda e: e["symbol"] == query.capitalize(), elements["elements"]))[0]
        elif len(query) > 2 and all(i.isalpha() for i in query):
            element["info"] = list(filter(lambda e: e["name"] == query.capitalize(), elements["elements"]))[0]
        elif all(i.isdigit() for i in query):
            element["info"] = list(filter(lambda e: e["number"] == int(query), elements["elements"]))[0]

        elem_data = requests.get(f"https://www.rsc.org/periodic-table/element/{element['info']['number']}/{element['info']['name']}")
        elem_page = BeautifulSoup(elem_data.content, "html.parser")

        facts = elem_page.find("div", class_="acc_blk").find_all("div", class_="accordian_block")
        headers = [" ".join(header.get_text().split()) for header in [fact.find(class_="accordian_title") for fact in facts]]
        headers.pop(0)
        description = [" ".join(header.get_text().split()) for header in [fact.find(class_="accordian_details") for fact in facts]]
        description.pop(0)

        element["facts"] = [{"fact_header": headers[i], "fact_details": description[i]} for i in range(len(headers))]

        history = elem_page.find(class_="accordian_block_his").find("div", "accordian_details").get_text()
        element["history"] = " ".join(history.split())

        return Response(element, status=status.HTTP_200_OK)


def simplify_fraction(x, y):
    if x % y == 0:
        return str(x/y)
    else:
        return "\\frac{" + str(x) + "}{" + str(y) + "}"

class QuadraticEquationAPI(APIView):
    def get(self, request):
        def is_integer(n):
            v = literal_eval(n)
            return isinstance(v, int) or (isinstance(v, float) and v.is_integer())

        a = int(request.query_params.get("a")) if is_integer(request.query_params.get("a")) else float(request.query_params.get("a"))
        b = int(request.query_params.get("b")) if is_integer(request.query_params.get("b")) else float(request.query_params.get("b"))
        c = int(request.query_params.get("c")) if is_integer(request.query_params.get("c")) else float(request.query_params.get("c"))

        discriminant = (b**2) - (4 * a * c)

        solution = {}

        if discriminant < 0:
            discriminant_message = "The equation has imaginary roots"
        elif discriminant == 0:
            discriminant_message = "The equation has one real solution"
        else:
            discriminant_message = "The equation has two real solutions"

        if (4 * a * c) < 0:
            symbol = "+"
        else:
            symbol = "-"

        def simplify_radical(num):
            trial = math.floor(abs(num) ** 0.5)
            coeff = 1

            while trial > 1:
                if num % (trial ** 2) == 0:
                    coeff = trial
                    break
                trial -=1

            remainder = abs(num) // coeff ** 2

            if num < 0:
                if coeff == 1:
                    return "\\frac{\\sqrt{" + str(remainder) + "i}}" + "{" + str(2 * a) + "}"
                else:
                    return "\\frac{" + str(coeff) + "\\sqrt{" + str(remainder) + "i}}" + "{" + str(2 * a) + "}"
            else:
                if coeff == 1:
                    return "\\frac{\\sqrt{" + str(remainder) + "}}" + "{" + str(2 * a) + "}"
                else:
                    return "\\frac{" + str(coeff) + "\\sqrt{" + str(remainder) + "}}" + "{" + str(2 * a) + "}"

        def calculate_solution_step():
            if discriminant < 0:
                if abs((b ** 2) - (4 * a *c)) % math.sqrt(abs((b ** 2) - (4 * a *c))) == 0:
                    return [
                        f"x = {simplify_fraction((-b + math.sqrt(abs((b ** 2) - (4 * a * c)))), (2 * a))}i",
                        f"x = {simplify_fraction((-b - math.sqrt(abs((b ** 2) - (4 * a * c)))), (2 * a))}i"
                    ]
                else:
                    return "x = " + simplify_fraction(-b, (2 * a)) + "\\pm" + "\\frac{\\sqrt{" + str(
                            str(abs((b ** 2) - (4 * a * c)))) + "}i}{" + str(2 * a) + "}"
            else:
                if abs((b ** 2) - (4 * a *c)) % math.sqrt(abs((b ** 2) - (4 * a *c))) == 0:
                    return [
                        f"x = {simplify_fraction((-b + math.sqrt(abs((b ** 2) - (4 * a * c)))), (2 * a))}",
                        f"x = {simplify_fraction((-b - math.sqrt(abs((b ** 2) - (4 * a * c)))), (2 * a))}"
                    ]
                else:
                    return "x = " + simplify_fraction(-b, (2 * a)) + "\\pm" + simplify_radical((b ** 2) - (4 * a * c))

        quadratic_steps = [
            {
                "description": f"Input the values a={a}, b={b}, and c={c} into the Quadratic Formula",
                "equations": [
                    "x = \\frac{-" + str(b) + "\\pm\\sqrt{" + str(b) + "^2 - 4(" + str(a) + ")(" + str(c) + ")}}{2(" + str(a) + ")}"
                ]
            },
            {
                "description": "Simplify the equation",
                "equations": [
                    "x = \\frac{" + str(-b) + "\\pm\\sqrt{" + str(b ** 2) + symbol + str(4 * a * c) + "}}{" + str(
                        2 * a) + "}",
                    "x = \\frac{" + str(-b) + "\\pm\\sqrt{" + str((b ** 2) - (4 * a * c)) + "}}{" + str(2 * a) + "}"
                ]
            },
            {
                "description": discriminant_message,
                "equations": [
                    "d = b^2 - 4ac",
                    str(b ** 2 - 4 * a * c) + "=" + str(b) + f"^2{symbol}" + str(4 * a * c)
                ]
            },

        ]

        if discriminant < 0:
            quadratic_steps.append({
                    "description": "Solution",
                    "equations": [
                        calculate_solution_step()
                    ]
                }
            )
            solution["result"] = [
                f"x = {-b / (2 * a)} + {math.sqrt(abs(discriminant)) / (2 * a)}i",
                f"x = {-b / (2 * a)} - {math.sqrt(abs(discriminant)) / (2 * a)}i"
            ]
        elif discriminant == 0:
            quadratic_steps.append({
                    "description": "Solution",
                    "equations": [
                        "x = \\frac{" + str(-b) + "}" + "{" + str(2 * a) + "}"
                    ]
                }
            )
            solution["result"] = [
                str(-b / (2 * a))
            ]
        else:
            quadratic_steps.append({
                    "description": "Solution",
                    "equations": [
                        calculate_solution_step()
                    ]
                }
            )
            solution["result"] = [
                f"x = {-b / (2 * a) + math.sqrt(discriminant) / (2 * a)}",
                f"x = {-b / (2 * a) - math.sqrt(discriminant) / (2 * a)}"
            ]

        solution["quadratic_steps"] = quadratic_steps

        return Response(solution, status=status.HTTP_200_OK)

class PointsCalculatorAPI(APIView):
    def get(self, request):
        x1 = float(request.query_params.get("x1"))
        y1 = float(request.query_params.get("y1"))
        x2 = float(request.query_params.get("x2"))
        y2 = float(request.query_params.get("y2"))

        if x1 == x2 and y2 == y2:
            return Response({"error": "The two points are the same"}, status=status.HTTP_200_OK)

        solution = {}

        def simplify_radical(num):
            if math.sqrt(num).is_integer():
                return str(math.sqrt(num))

            trial = math.floor(abs(num) ** 0.5)
            coeff = 1

            while trial > 1:
                if num % (trial ** 2) == 0:
                    coeff = trial
                    break
                trial -=1

            remainder = abs(num) // coeff ** 2

            if coeff == 1:
                return "\\sqrt{" + str(remainder) + "}"
            else:
                return str(coeff) + "\\sqrt{" + str(remainder) + "}"

        solution["midpoint"] = {
            "result": f"({(x1 + x2) / 2}, {(y1 + y2) / 2})",
            "steps": [
                {
                    "description": f"Input the values x1={x1}, y1={y1}, x2={x2}, y2={y2} into the midpoint formula",
                    "equations": [
                        "(\\frac{" + str(x1) + "+" + str(x2) + "}{2}, \\frac{" + str(y1) + "+" + str(y2) + "}{2})"
                    ]
                },
                {
                    "description": "Solve",
                    "equations": [
                        f"({simplify_fraction((x1 + x2), 2)}, {simplify_fraction((y1 + y2), 2)})"
                    ]
                }
            ]
        }

        solution["slope"] = {
            "result": f"{(y2 - y1) / (x2 - x1)}",
            "steps": [
                {
                    "description": f"Input the values x1={x1}, y1={y1}, x2={x2}, y2={y2} into the slope formula",
                    "equations": [
                         "\\frac{" + str(y2) + "-" + str(y1) + "}{" + str(x2) + "-" + str(x1) + "}"
                    ]
                },
                {
                    "description": "Solve",
                    "equations": [
                        simplify_fraction((y2 - y1), (x2 - x1))
                    ]
                }
            ]
        }

        solution["distance"] = {
            "result": f"{math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2))}",
            "steps": [
                {
                    "description": f"Input the values x1={x1}, y1={y1}, x2={x2}, y2={y2} into the slope formula",
                    "equations": [
                        "\\sqrt{(" + str(x2) + "-" + str(x1) + ")^2 + (" + str(y2) + "-" + str(y1) + ")^2}"
                    ]
                },
                {
                    "description": "Solve",
                    "equations": [
                        "\\sqrt{(" + str(x2 - x1) + ")^2 + (" + str(y2 - y1) + ")^2}",
                        "\\sqrt{(" + str((x2 - x1) ** 2) + " + " + str((y2- y1) ** 2) + "}",
                        simplify_radical(((x2 - x1) ** 2) + ((y2 - y1) ** 2))
                    ]
                }
            ]
        }

        return Response(solution, status=status.HTTP_200_OK)

class SystemOfEquationsAPI(APIView):
    def get(self, request):
        equation = request.headers["equation"].split(",")
        equations, symbols = SystemOfEquations.parse(equation)

        if SystemOfEquations.verify_set(equations, symbols):
            data = SystemOfEquations.solve(equations)
            result = [f"{key} = {sympy.latex(value)}" for key, value in data.items()]

            solution = {"result": result}

            return Response(solution, status=status.HTTP_200_OK)

        else:
            return Response({"error": "You have entered more variables then equations"})

