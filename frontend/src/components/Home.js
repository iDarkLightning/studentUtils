import React, { Component } from "react";
import Util from "./Utils";


const Home = () => {
    return (
        <div className="home">
            <h1 id="title">Student Utilities</h1>
            <div className="items">
                <Util className="util" name="Calculators" image="./static/assets/calculator.png" route="/calculator"/>
                <Util className="util" name="References" image="./static/assets/reference.png" route="/references"/>
                <Util className="util" name="Translator" image="./static/assets/translation.png" route="/translator"/>
                <Util className="util" name="Dictionary" image="./static/assets/dictionary.png" route="/dictionary"/>
            </div>
        </div>
    )

}

export default Home;