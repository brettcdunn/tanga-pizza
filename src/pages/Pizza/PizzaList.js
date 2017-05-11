import React, { Component } from 'react';
import { Link } from 'react-router';
import './Pizza.css';

class PizzaList extends Component {
    constructor() {
        super();
        this.state={
            name:"",
            description:"",
            pizzas:[]
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        this.fetchPizzas();
    }

    fetchPizzas(){
        fetch('https://pizzaserver.herokuapp.com/pizzas')
            .then(result=>result.json())
            .then(
                pizzas=>this.setState({pizzas})
            )
            .catch(e => console.log(e))
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        var errors = this._validate();
        if(errors !== "") {
            alert(errors);
            return;
        }

        this._create({
            name: this.state.name,
            description: this.state.description
        })
    }

    _validate() {
        var errors = ""
        if(this.state.name === "") {
          errors += "A name is required.\n";
        }
        if(this.state.description === "") {
          errors += "A description is required.";
        }
        return errors;
    }

    _create(data) {
        fetch('https://pizzaserver.herokuapp.com/pizzas', {
            method: 'POST',
            body: JSON.stringify( { name: data.name, description: data.description } ),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        })
        .then((response)=>response.json())
        .then((result) => {
            if ('id' in result) {
                this.setState( { name: "", description: "" } )
                this.fetchPizzas();
                alert("Pizza created!");
            } else {
                alert("An error occurred");
            }
        })
        .catch(e => console.log(e))
    }

    render() {
        return(
            <form method='POST' action='' onSubmit={this.handleSubmit}>
                <fieldset className='marginTen alignCenter'>
                    <legend>Create a pizza:</legend>
                    <div className='marginTen alignCenter'>
                        <span className='marginFive'>
                            Name:
                            <input name="name" type="text" value={this.state.name} onChange={this.handleInputChange} />
                        </span>
                        <span className='marginFive'>
                            Description:
                            <input name="description" type="text" value={this.state.description} onChange={this.handleInputChange} />
                        </span>
                        <input type="submit" value="Create" />
                    </div>
                </fieldset>
                <fieldset className='marginTen alignCenter'>
                    <legend>Pizzas:</legend>
                    <table className='PizzaTable'>
                        <thead>
                            <tr>
                                <th>Pizza #</th>
                                <th>Name</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.pizzas.map(
                                    pizza=>
                                    <tr>
                                        <td><Link to={'/pizza/' + pizza.id + '/' + pizza.name}>{pizza.id}</Link></td>
                                        <td><Link to={'/pizza/' + pizza.id + '/' + pizza.name}>{pizza.name}</Link></td>
                                        <td>{pizza.description}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </fieldset>
            </form>
        )
    }
}

export default PizzaList;
