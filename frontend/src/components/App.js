import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Calculator from "./Calculator";
import Dictionary from "./Dictionary";
import Translator from "./Translator";
import References from "./References";
import Nav from "./Nav";

const App = () => {
  return (
    <div>
      <Nav />
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/calculator" exact component={Calculator} />
          <Route path="/references" exact component={References} />
          <Route path="/translator" exact component={Translator} />
          <Route path="/dictionary" component={Dictionary} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
