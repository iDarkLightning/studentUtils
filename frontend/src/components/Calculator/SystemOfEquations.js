// import React, { useRef, useState } from "react";
// import MathJax from "react-mathjax";
//
// const SystemOfEquations = () => {
//   const [solutionData, setSolutionData] = useState({});
//   const [equationInputs, setEquationInputs] = useState([1, 1]);
//   const equationInputRef = useRef(null);
//
//   const submitQueryHandler = async (e) => {
//     e.preventDefault();
//     let eqs = [];
//     for (let input of e.target) {
//       if (input.value !== "") eqs.push(input.value);
//     }
//
//     let data = await (
//       await fetch("/api/system_equations", {
//         headers: { equation: eqs },
//       })
//     ).json();
//     console.log(data);
//     setSolutionData(data);
//   };
//
//   const SolutionDisplay = () => {
//     if (Object.keys(solutionData).length === 0) {
//       return <div />;
//     }
//
//     console.log(solutionData.error);
//     if (solutionData.error !== undefined) {
//       return (
//         <div>
//           <h2 className="error-message">The points are equal</h2>
//         </div>
//       );
//     }
//
//     return (
//       <MathJax.Provider>
//         <div>
//           <h2 className="quadratic-step">Result</h2>
//           {solutionData.result.map((r) => (
//             <div className="equation">
//               <MathJax.Node formula={r} />
//             </div>
//           ))}
//         </div>
//       </MathJax.Provider>
//     );
//   };
//
//   return (
//     <div className="quadratic-calc">
//       <form className="quadratic-form" onSubmit={submitQueryHandler}>
//         <div className="equation-inputs">
//           {equationInputs.map((e) => (
//             <input
//               type="text"
//               placeholder="equation"
//               className="equation-input"
//               ref={equationInputRef}
//             />
//           ))}
//         </div>
//         <button
//           className="add-equation"
//           type="button"
//           onClick={() => setEquationInputs([...equationInputs, 1])}
//         >
//           Add Equation
//         </button>
//         <button
//           className="remove-equation"
//           type="clear"
//           onClick={() => setEquationInputs([1, 1])}
//         >
//           Clear
//         </button>
//         <button type="submit">Calculate</button>
//       </form>
//       <SolutionDisplay />
//     </div>
//   );
// };
//
// export default SystemOfEquations;
