import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Calculator from "./Calculator";


const App = () => {
    return (

        <div>
            <Router>
                <Switch>
                    <Route path="/" exact component={Home}/>
                    <Route path="/calculator" exact component={Calculator}/>
                    {/*<Route path="/references" exact component={}/>*/}
                    {/*<Route path="/translator" exact component={}/>*/}
                    {/*<Route path="/dictionary" exact component={}/>*/}
                </Switch>
            </Router>
        </div>
    )

}

export default App;

