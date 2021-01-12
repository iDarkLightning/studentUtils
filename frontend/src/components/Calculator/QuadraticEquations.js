import React, { useRef, useState } from "react";
import MathJax from "react-mathjax";

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

  const renderData = () => {
    if (Object.keys(solutionData).length === 0) return <div />;

    return (
      <MathJax.Provider>
        <div>
          {solutionData.quadratic_steps.map((step) => (
            <div>
              <h3 className="calculator-step">{step.description}</h3>
              {step.equations.map((e) => (
                <div className="equation">
                  <MathJax.Node formula={e} />
                </div>
              ))}
            </div>
          ))}
          <div className="results">
            <h2 className="calculator-step">Result:</h2>
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
    <div className="calculator-content">
      <h1 className="tabbed-content-title">Quadratic Equations Calculator</h1>
      <div className="calculator-form">
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
      {renderData()}
    </div>
  );
};

export default QuadraticEquations;
