import React, { useState } from "react";

const MathReferences = () => {
  const [mathQuery, setMathQuery] = useState("");
  const [mathData, setMathData] = useState({});

  if (mathData === {}) {
    return <div />;
  } else if (mathData.search !== undefined) {
    return <h2 className="error-message">Searching...</h2>;
  }

  const submitQueryHandler = async () => {
    setMathData({ search: "" });
    let data = await (
      await fetch("/api/math_refs?shape=" + mathQuery.replace(" ", ""))
    ).json();
    setMathData(data);
  };

  const renderData = () => {
    if (Object.keys(mathData).length === 0) return <div />;

    if (mathData.error !== undefined) {
      return <h2 className="error-message">{mathData.error}</h2>;
    }

    return (
      <div>
        {mathData.description}
        {mathData.properties.map((definition) => (
          <div>
            <h3>{definition.property}</h3>
            <p>{definition.definition}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="reference-content">
      <h1 className="tabbed-content-title">Math References</h1>
      <div className="reference-form">
        <input
          onChange={(e) => setMathQuery(e.target.value)}
          type="text"
          placeholder="Mathematical Term"
        />
        <button onClick={submitQueryHandler}>Search</button>
      </div>
      {renderData()}
    </div>
  );
};

export default MathReferences;
