import React, { useRef, useState } from "react";
import MathJax from "react-mathjax";

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

  const renderData = () => {
    if (Object.keys(solutionData).length === 0) return <div />;

    if (solutionData.error !== undefined)
      return <h2 className="error-message">{solutionData.error}</h2>;

    return (
      <MathJax.Provider>
        <div>
          {solutionData.solution.map((p) => (
            <div>
              <h2 className="points-info-title">{p.title}</h2>
              {p.steps.map((step) => (
                <div>
                  <h5 className="calculator-step">{step.description}</h5>
                  {step.equations.map((e) => (
                    <div className="equation">
                      <MathJax.Node formula={e} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </MathJax.Provider>
    );
  };

  return (
    <div className="calculator-content">
      <h1 className="tabbed-content-title">Point Information Calculator</h1>
      <div className="calculator-form">
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
      {renderData()}
    </div>
  );
};

export default PointInformation;
