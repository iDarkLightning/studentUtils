import React, { useState } from "react";

const ReferenceIcon = ({
  imgSource,
  name,
  setReferenceDisplay,
  displayedReference,
}) => {
  const clickHandler = () => {
    setReferenceDisplay(name);
  };

  return (
    <div>
      <button
        onClick={clickHandler}
        className={displayedReference === name ? "selected-reference" : ""}
      >
        <img src={imgSource} />
        <h3 className="reference-name">{name}</h3>
      </button>
    </div>
  );
};

const MathReferences = () => {
  const [mathQuery, setMathQuery] = useState("");
  const [mathData, setMathData] = useState({});
  const [displayTopicDefinitions, setDisplayTopicDefinitions] = useState(false);

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
    setDisplayTopicDefinitions(true);
  };

  const PropertyDefinitions = ({ display }) => {
    if (!display) {
      return <div />;
    }

    return (
      <div>
        {mathData.properties.map((definition) => (
          <div>
            <h3>{definition.property}</h3>
            <p>{definition.definition}</p>
          </div>
        ))}
      </div>
    );
  };

  const TopicDefinitions = ({ display }) => {
    if (!display) {
      return <div />;
    }

    return (
      <div>
        {mathData.topic_definitions.map((definition) => (
          <div>
            <h3>{definition[0]}</h3>
            <p>{definition[1]}</p>
          </div>
        ))}
      </div>
    );
  };

  const Information = ({ mathData }) => {
    if (mathData.error !== undefined) {
      return (
        <h2 className="error-message">
          Sorry, we do not have any information on this topic
        </h2>
      );
    } else {
      return (
        <div>
          <p>{mathData.description}</p>
          <PropertyDefinitions display={displayTopicDefinitions} />
          <TopicDefinitions display={displayTopicDefinitions} />
        </div>
      );
    }
  };

  return (
    <div className="reference-content">
      <h1 className="reference-title">Math References</h1>
      <div className="reference-form">
        <input
          onChange={(e) => setMathQuery(e.target.value)}
          type="text"
          placeholder="Mathematical Term"
        />
        <button onClick={submitQueryHandler}>Search</button>
      </div>
      <Information mathData={mathData} />
    </div>
  );
};

const PeriodicTable = () => {
  const [elementQuery, setElementQuery] = useState("");
  const [elementData, setElementData] = useState({});

  const handleKeypress = async (e) => {
    if (e.key === "Enter") {
      await submitQueryHandler();
    }
  };

  const submitQueryHandler = async () => {
    let data = await (
      await fetch("/api/periodic?element=" + elementQuery.replace(" ", ""))
    ).json();
    setElementData(data);
  };

  const ElementBox = () => {
    if (elementData.info === undefined) {
      return <div />;
    }

    return (
      <div className="element-info">
        <a href={elementData.info.source}>
          <button className="element-box">
            <h6>{elementData.info.number}</h6>
            <h1>{elementData.info.symbol}</h1>
            <h4>{elementData.info.name}</h4>
            <h5>{elementData.info.atomic_mass}</h5>
          </button>
        </a>
        <div>
          <h6>State: {elementData.info.phase}</h6>
          <h6>Category: {elementData.info.category}</h6>
          <h6>Discoverd By: {elementData.info.discovered_by}</h6>
          <h6>Melting: {elementData.info.melt}</h6>
          <h6>Boiling: {elementData.info.boil}</h6>
          <p>{elementData.info.summary}</p>
        </div>
      </div>
    );
  };

  const ElementInformation = () => {
    if (elementData.info === undefined) {
      return <div />;
    }

    return (
      <div>
        {elementData.facts.map((e) => (
          <div>
            <h3>{e.fact_header}</h3>
            <p>{e.fact_details}</p>
          </div>
        ))}
        <div>
          <h3>History</h3>
          <p>{elementData.history}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="reference-content">
      <h1 className="reference-title">Periodic Table References</h1>
      <div className="reference-form">
        <input
          onChange={(e) => setElementQuery(e.target.value)}
          type="text"
          placeholder="Element"
          onKeyPress={handleKeypress}
        />
        <button onClick={submitQueryHandler}>Search</button>
      </div>
      <div>
        <ElementBox />
        <ElementInformation />
      </div>
    </div>
  );
};

const References = () => {
  const [displayedReference, setDisplayedReference] = useState("");

  const renderSwitch = () => {
    switch (displayedReference) {
      case "":
        return <div />;
      case "Math References":
        return (
          <div className="math-reference">
            <MathReferences />
          </div>
        );
      case "Periodic Table":
        return (
          <div className="periodic-table-reference">
            <PeriodicTable />
          </div>
        );
    }
  };

  return (
    <div className="references">
      <div className="reference-labels">
        <ReferenceIcon
          imgSource="./static/assets/math.png"
          name="Math References"
          displayedReference={displayedReference}
          setReferenceDisplay={setDisplayedReference}
        />
        <ReferenceIcon
          imgSource="./static/assets/periodic-table.png"
          name="Periodic Table"
          displayedReference={displayedReference}
          setReferenceDisplay={setDisplayedReference}
        />
      </div>
      <div className="reference-display">{renderSwitch()}</div>
    </div>
  );
};

export default References;
