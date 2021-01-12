import React, { useState } from "react";

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

  const renderData = () => {
    if (Object.keys(elementData).length === 0) return <div />;

    if (elementData.error !== undefined)
      return <h2 className="error-message">{elementData.error}</h2>;

    return (
      <div>
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
            <h6>Discovered By: {elementData.info.discovered_by}</h6>
            <h6>Melting: {elementData.info.melt}</h6>
            <h6>Boiling: {elementData.info.boil}</h6>
            <p>{elementData.info.summary}</p>
          </div>
        </div>
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
      <h1 className="tabbed-content-title">Periodic Table References</h1>
      <div className="reference-form">
        <input
          onChange={(e) => setElementQuery(e.target.value)}
          type="text"
          placeholder="Element"
          onKeyPress={handleKeypress}
        />
        <button onClick={submitQueryHandler}>Search</button>
      </div>
      <div>{renderData()}</div>
    </div>
  );
};

export default PeriodicTable;
