import React, { useState } from "react";
import TabIcon from "../TabIcon";
import MathReferences from "./MathReferences";
import PeriodicTable from "./PeriodicTable";

const References = () => {
  const [displayedReference, setDisplayedReference] = useState("");

  const renderSwitch = () => {
    switch (displayedReference) {
      case "Math References":
        return <MathReferences />;
      case "Periodic Table":
        return <PeriodicTable />;
      default:
        return <div />;
    }
  };

  return (
    <div className="tabs">
      <div className="tab-labels">
        <TabIcon
          imgSource="./static/assets/math.png"
          name="Math References"
          currentDisplay={displayedReference}
          setDisplay={setDisplayedReference}
        />
        <TabIcon
          imgSource="./static/assets/periodic-table.png"
          name="Periodic Table"
          currentDisplay={displayedReference}
          setDisplay={setDisplayedReference}
        />
      </div>
      <div className="tabbed-content-display">{renderSwitch()}</div>
    </div>
  );
};

export default References;
