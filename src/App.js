import React, { Component } from "react";
// import { BrowserRouter, Route, Switch } from "react-router-dom";
// import Preferences from "./components/Preferences";
import MapComponent from "./components/Map";
// import Details from "./components/Details";

class App extends Component {
  render() {
    return <MapComponent />;

    // return <Preferences />;
    //
    // return (
    //   <BrowserRouter>
    //     <Switch>
    //       <Route exact path="/" component={Preferences} />
    //       <Route path="/details" component={Details} />
    //     </Switch>
    //   </BrowserRouter>
    // );
  }
}

export default App;
