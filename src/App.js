import React, { Component } from 'react';
import logo from './pizza-icon.ico';
import './App.css';
import { Link } from 'react-router';

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to Pizza-a-Tanga!</h2>
                </div>
                <p className="App-intro">
                    <Link to="/">Home</Link> | <Link to="/pizzas">Pizzas</Link> | <Link to="/toppings">Toppings</Link>
                    {this.props.children}
                </p>
            </div>
        );
    }
}

export default App;
