import React, { Component } from "react";
import logo from "./logo.svg";
import "./Example.css";

// Stateless component
const ExampleStateless = ({ name }) => <h1> Hello {name} !</h1>;

// Stateful component
class Example extends Component {
  state = {
    open: true,
    loading: false,
    data: []
  };

  multBy2 = num => num * 2;

  toggleOpenClose = () =>
    this.setState(prevState => ({
      open: !prevState.open
    }));

  componentDidMount() {
    this.setState({ loading: true });

    fetch("https://api.github.com/users")
      .then(data => data.json())
      .then(data => this.setState({ data, loading: false }));
  }

  render() {
    return (
      <div className="App">
        {this.state.loading ? (
          <h1>...loading</h1>
        ) : (
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <ExampleStateless name={"Juan"} />
            <p> 3 * 2 = {this.multBy2(3)} </p>
            <p>Estado {this.state.open ? "abierto" : "cerrado"}</p>
            <button onClick={this.toggleOpenClose}>Cambiar</button>
          </header>
        )}
        {this.state.data.map(user => (
          <p>{user.login}</p>
        ))}
      </div>
    );
  }
}

export default Example;
