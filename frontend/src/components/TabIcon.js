import React from "react";

const TabIcon = ({ imgSource, name, setDisplay, currentDisplay }) => {
  return (
    <div>
      <button
        onClick={() => setDisplay(name)}
        className={currentDisplay === name ? "selected-tab" : ""}
      >
        <img src={imgSource} />
        <h3 className="reference-name">{name}</h3>
      </button>
    </div>
  );
};

export default TabIcon;
