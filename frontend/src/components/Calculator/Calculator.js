import React, { useState } from "react";
import TabIcon from "../TabIcon";
import QuadraticEquations from "./QuadraticEquations";
import PointInformation from "./PointsInformation";

const Calculator = () => {
  const [displayedCalculator, setDisplayedCalculator] = useState("");

  const renderSwitch = () => {
    switch (displayedCalculator) {
      case "Quadratic Equations":
        return <QuadraticEquations />;
      case "Point Information":
        return <PointInformation />;
      default:
        return <div />;
    }
  };

  return (
    <div className="tabs">
      <div className="tab-labels">
        <TabIcon
          imgSource="./static/assets/math.png"
          name="Quadratic Equations"
          currentDisplay={displayedCalculator}
          setDisplay={setDisplayedCalculator}
        />
        <TabIcon
          imgSource="./static/assets/math.png"
          name="Point Information"
          currentDisplay={displayedCalculator}
          setDisplay={setDisplayedCalculator}
        />
      </div>
      <div className="tabbed-content-display">{renderSwitch()}</div>
    </div>
  );
};

export default Calculator;
