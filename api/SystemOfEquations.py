import sympy, re, itertools

class SystemOfEquations:

    @staticmethod
    def parse(equation_set):
        sympy_equations = []
        symbols = SystemOfEquations.symbols(equation_set)

        for equation in equation_set:
            formatted = "Eq(" + re.sub("(\d+)([a-z]+\^?[0-9]?)", r"\1*\2", equation).replace("=", ",")+ ")"
            sympy_equations.append(sympy.sympify(formatted))

        return sympy_equations, symbols

    @staticmethod
    def symbols(equation_set):
        total_symbols = []
        for equation in equation_set:
            total_symbols.append(re.findall(r"[a-zA-Z]", equation))
        return list(dict.fromkeys(itertools.chain.from_iterable(total_symbols)))


    @staticmethod
    def verify_set(equation_set, variables):
        return len(equation_set) == len(variables)

    @staticmethod
    def solve(equation_set):
        return sympy.solve(equation_set)