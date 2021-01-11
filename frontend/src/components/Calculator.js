import React, { useState, useRef } from "react";
import MathJax from "react-mathjax";
import { Fraction, toTex } from "algebra.js";

const CalculatorIcon = ({
  imgSource,
  name,
  setCalculatorDisplay,
  displayedCalculator,
}) => {
  const clickHandler = () => {
    setCalculatorDisplay(name);
  };

  return (
    <div>
      <button
        onClick={clickHandler}
        className={displayedCalculator === name ? "selected-reference" : ""}
      >
        <img src={imgSource} />
        <h3 className="reference-name">{name}</h3>
      </button>
    </div>
  );
};

const QuadraticEquations = () => {
  const aObject = useRef(null);
  const bObject = useRef(null);
  const cObject = useRef(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [solutionData, setSolutionData] = useState({});

  const submitQueryHandler = async () => {
    let data = await (
      await fetch(
        `/api/quadratic?a=${aObject.current.value}&b=${bObject.current.value}&c=${cObject.current.value}`
      )
    ).json();
    setSolutionData(data);
  };

  const inputValidator = () => {
    const inputArray = [
      aObject.current.value,
      bObject.current.value,
      cObject.current.value,
    ];

    for (let input of inputArray) {
      if (input.length === 0) {
        setButtonDisabled(true);
        return;
      }
    }

    setButtonDisabled(parseFloat(inputArray[0]) === 0);
  };

  const SolutionDisplay = () => {
    if (solutionData.result === undefined) {
      return <div />;
    }

    return (
      <MathJax.Provider>
        <div>
          {solutionData.quadratic_steps.map((step) => (
            <div>
              <h3 className="quadratic-step">{step.description}</h3>
              {step.equations.map((e) => (
                <div className="equation">
                  <MathJax.Node formula={e} />
                </div>
              ))}
            </div>
          ))}
          <div className="results">
            <h2 className="quadratic-step">Result:</h2>
            {solutionData.result.map((e) => (
              <div className="equation">
                <MathJax.Node inline formula={e} />
              </div>
            ))}
          </div>
        </div>
      </MathJax.Provider>
    );
  };

  return (
    <div className="quadratic-calc">
      <h1 className="reference-title">Quadratic Equations Calculator</h1>
      <div className="quadratic-form">
        <div className="quadratic-coeffs">
          <input
            type="text"
            placeholder="a"
            ref={aObject}
            onChange={inputValidator}
          />
          <input
            type="text"
            placeholder="b"
            ref={bObject}
            onChange={inputValidator}
          />
          <input
            type="text"
            placeholder="c"
            ref={cObject}
            onChange={inputValidator}
          />
        </div>
        <button onClick={submitQueryHandler} disabled={buttonDisabled}>
          Calculate
        </button>
      </div>
      <SolutionDisplay />
    </div>
  );
};

const PointInformation = () => {
  const x1 = useRef(null);
  const y1 = useRef(null);
  const x2 = useRef(null);
  const y2 = useRef(null);
  const [solutionData, setSolutionData] = useState({});

  const submitQueryHandler = async () => {
    let data = await (
      await fetch(
        `/api/points?x1=${x1.current.value}&y1=${y1.current.value}&x2=${x2.current.value}&y2=${y2.current.value}`
      )
    ).json();
    setSolutionData(data);
  };

  const SolutionDisplay = () => {
    if (Object.keys(solutionData).length === 0) {
      return <div />;
    }

    console.log(solutionData.error);
    if (solutionData.error !== undefined) {
      return (
        <div>
          <h2 className="error-message">The points are equal</h2>
        </div>
      );
    }

    return (
      <MathJax.Provider>
        <div>
          <div className="points-midpoint">
            <h2 className="points-info-title">Midpoint</h2>
            {solutionData.midpoint.steps.map((step) => (
              <div>
                <h5 className="quadratic-step">{step.description}</h5>
                {step.equations.map((e) => (
                  <div className="equation">
                    <MathJax.Node formula={e} />
                  </div>
                ))}
              </div>
            ))}
            <div className="results">
              <h5 className="quadratic-step">Result:</h5>
              <MathJax.Node inline formula={solutionData.midpoint.result} />
            </div>
          </div>
          <div className="points-slope">
            <h2 className="points-info-title">Slope</h2>
            {solutionData.slope.steps.map((step) => (
              <div>
                <h5 className="quadratic-step">{step.description}</h5>
                {step.equations.map((e) => (
                  <div className="equation">
                    <MathJax.Node formula={e} />
                  </div>
                ))}
              </div>
            ))}
            <div className="results">
              <h5 className="quadratic-step">Result:</h5>
              <MathJax.Node inline formula={solutionData.slope.result} />
            </div>
          </div>
          <div className="points-distance">
            <h2 className="points-info-title">Distance</h2>
            {solutionData.distance.steps.map((step) => (
              <div>
                <h5 className="quadratic-step">{step.description}</h5>
                {step.equations.map((e) => (
                  <div className="equation">
                    <MathJax.Node formula={e} />
                  </div>
                ))}
              </div>
            ))}
            <div className="results">
              <h5 className="quadratic-step">Result:</h5>
              <MathJax.Node inline formula={solutionData.distance.result} />
            </div>
          </div>
        </div>
      </MathJax.Provider>
    );
  };

  return (
    <div className="quadratic-calc">
      <h1 className="reference-title">Point Information Calculator</h1>
      <div className="quadratic-form">
        <div>
          <input type="text" placeholder="x1" ref={x1} />
          <input type="text" placeholder="x2" ref={x2} />
        </div>
        <div>
          <input type="text" placeholder="y1" ref={y1} />
          <input type="text" placeholder="y2" ref={y2} />
        </div>
        <button onClick={submitQueryHandler}>Calculate</button>
      </div>
      <SolutionDisplay />
    </div>
  );
};

const SystemOfEquations = () => {
  const [solutionData, setSolutionData] = useState({});
  const [equationInputs, setEquationInputs] = useState([1, 1]);
  const equationInputRef = useRef(null);

  const submitQueryHandler = async (e) => {
    e.preventDefault();
    let eqs = [];
    for (let input of e.target) {
      if (input.value !== "") eqs.push(input.value);
    }

    let data = await (
      await fetch("/api/system_equations", {
        headers: { equation: eqs },
      })
    ).json();
    console.log(data);
    setSolutionData(data);
  };

  const SolutionDisplay = () => {
    if (Object.keys(solutionData).length === 0) {
      return <div />;
    }

    console.log(solutionData.error);
    if (solutionData.error !== undefined) {
      return (
        <div>
          <h2 className="error-message">The points are equal</h2>
        </div>
      );
    }

    return (
      <MathJax.Provider>
        <div>
          <h2 className="quadratic-step">Result</h2>
          {solutionData.result.map((r) => (
            <div className="equation">
              <MathJax.Node formula={r} />
            </div>
          ))}
        </div>
      </MathJax.Provider>
    );
  };

  return (
    <div className="quadratic-calc">
      <form className="quadratic-form" onSubmit={submitQueryHandler}>
        <div className="equation-inputs">
          {equationInputs.map((e) => (
            <input
              type="text"
              placeholder="equation"
              className="equation-input"
              ref={equationInputRef}
            />
          ))}
        </div>
        <button
          className="add-equation"
          type="button"
          onClick={() => setEquationInputs([...equationInputs, 1])}
        >
          Add Equation
        </button>
        <button
          className="remove-equation"
          type="clear"
          onClick={() => setEquationInputs([1, 1])}
        >
          Clear
        </button>
        <button type="submit">Calculate</button>
      </form>
      <SolutionDisplay />
    </div>
  );
};

const Calculator = () => {
  const [displayedCalculator, setDisplayedCalculator] = useState("");

  const renderSwitch = () => {
    switch (displayedCalculator) {
      case "":
        return <div />;
      case "Quadratic Equations":
        return (
          <div>
            <QuadraticEquations />
          </div>
        );
      case "Point Information":
        return (
          <div>
            <PointInformation />
          </div>
        );
      case "System of Equations":
        return (
          <div>
            <SystemOfEquations />
          </div>
        );
    }
  };

  return (
    <div className="references">
      <div className="reference-labels">
        <CalculatorIcon
          imgSource="./static/assets/math.png"
          name="Quadratic Equations"
          displayedCalculator={displayedCalculator}
          setCalculatorDisplay={setDisplayedCalculator}
        />
        <CalculatorIcon
          imgSource="./static/assets/math.png"
          name="Point Information"
          displayedCalculator={displayedCalculator}
          setCalculatorDisplay={setDisplayedCalculator}
        />{" "}
        <CalculatorIcon
          imgSource="./static/assets/math.png"
          name="System of Equations"
          displayedCalculator={displayedCalculator}
          setCalculatorDisplay={setDisplayedCalculator}
        />
      </div>
      <div className="reference-display">{renderSwitch()}</div>
    </div>
  );
};

export default Calculator;
