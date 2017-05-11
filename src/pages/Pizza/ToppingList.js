import React, { Component } from 'react';
import './Pizza.css';

class ToppingList extends Component {
    constructor() {
        super();
        this.state={
            name:"",
            toppings:[]
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount(){
        this.fetchToppings();
    }

    fetchToppings(){
        fetch('https://pizzaserver.herokuapp.com/toppings')
            .then(result=>result.json())
            .then(toppings=>this.setState({toppings}))
            .catch(e => console.log(e))
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    handleSubmit(event) {
        event.preventDefault();
        var errors = this._validate();
        if(errors !== "") {
            alert(errors);
            return;
        }
        this._create(this.state.name)
    }

    _create(data) {
        fetch('https://pizzaserver.herokuapp.com/toppings', {
            method: 'POST',
            body: JSON.stringify( { name: data } ),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        })
        .then((response)=>response.json())
        .then((result) => {
            if (result.id >= 0) {
                this.setState( { name: "" } )
                this.fetchToppings();
                alert("Topping created!");
            } else {
                alert("An error occurred");
            }
        })
        .catch(e => console.log(e))
    }

    _validate() {
        var errors = ""
        if(this.state.name === "") {
          errors = "A name is required";
        }
        return errors;
    }

    render() {
        return (
            <form method='POST' action='' onSubmit={this.handleSubmit}>
                <fieldset className='marginTen alignCenter'>
                    <legend>New Topping:</legend>
                    <div className='marginTen alignCenter'>
                        <span className='marginFive'>
                            Name:
                            <input name="name" type="text" value={this.state.name} onChange={this.handleInputChange} />
                        </span>
                        <input type="submit" value="Create" />
                    </div>
                </fieldset>

                <fieldset className='marginTen alignCenter'>
                    <legend>Toppings:</legend>
                    <div className='threeColumns'>
                        <ul>
                        {this.state.toppings.map(
                            topping=><li>{topping.id} - {topping.name}</li>
                        )}
                        </ul>
                    </div>
                </fieldset>
            </form>
        );
    }
}

export default ToppingList;
