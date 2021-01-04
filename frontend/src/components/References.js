import React, { useState } from "react";

const ReferenceIcon = ({ imgSource, name, setReferenceDisplay }) => {
  const clickHandler = () => {
    setReferenceDisplay(true);
  };

  return (
    <div>
      <button onClick={clickHandler}>
        <img src={imgSource} />
        <h3>{name}</h3>
      </button>
    </div>
  );
};

const MathReferences = ({ displayReference, setDisplayReference }) => {
  const [mathQuery, setMathQuery] = useState("");
  const [mathData, setMathData] = useState({});
  const [displayTopicDefinitions, setDisplayTopicDefinitions] = useState(false);

  if (!displayReference || mathData === {}) {
    return <div />;
  }

  const submitQueryHandler = async () => {
    setDisplayReference(true);
    let data = await (
      await fetch("/api/math_refs?shape=" + mathQuery.toLowerCase())
    ).json();
    console.log(data.error);
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
    console.log(mathData.length);
    if (mathData.error !== undefined) {
      return (
        <h2 id="math-error-message">
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
    <div className="math-reference-content">
      <h1 className="math-reference-title">Math References</h1>
      <div className="math-reference-form">
        <input onChange={(e) => setMathQuery(e.target.value)} type="text" />
        <button onClick={submitQueryHandler}>Search</button>
      </div>
      <Information mathData={mathData} />
    </div>
  );
};

const References = () => {
  const [mathDisplayReference, setMathDisplayReference] = useState(false);

  return (
    <div className="references">
      <div className="reference-labels">
        <ReferenceIcon
          imgSource="./static/assets/math.png"
          name="Math References"
          setReferenceDisplay={setMathDisplayReference}
        />
        <ReferenceIcon
          imgSource="./static/assets/math.png"
          name="Math References"
          setReferenceDisplay={setMathDisplayReference}
        />
      </div>
      <div className="reference-content">
        <div className="math-reference">
          <MathReferences
            displayReference={mathDisplayReference}
            setDisplayReference={setMathDisplayReference}
          />
        </div>
      </div>
    </div>
  );
};

export default References;
