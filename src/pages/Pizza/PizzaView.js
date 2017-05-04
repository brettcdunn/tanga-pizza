import React, { Component } from 'react';
import './Pizza.css';

class PizzaView extends Component {
    constructor() {
        super();
        this.state = {
            toppings: []
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        this.fetchPizzaToppings();
    }

    fetchPizzaToppings() {
        var request1 =
        fetch(`https://pizzaserver.herokuapp.com/pizzas/${this.props.params.id}/toppings`)
            .then(function(response) {
                if(response.ok) {
                    return response.json()
                } else {
                    return [];
                }
            })
            .catch(function(error) { alert(error); return {} });

        var request2 =
        fetch(`https://pizzaserver.herokuapp.com/toppings`)
            .then(function(response) { return response.json() } );

        Promise.all([request1, request2]).then(([pizzaToppings, allToppings]) => {
            allToppings.forEach(function (topping) {
                topping.checked = "";
                if (pizzaToppings.length !== 0) {
                    pizzaToppings.forEach(function(pizzaTopping) {
                        if (pizzaTopping.topping_id === topping.id) {
                            topping.checked = "checked";
                        }
                    });
                }
            });
            this.setState({toppings: allToppings});
        }).then()
        .catch(e => console.log(e))
    }

    handleInputChange(event) {
        const target = event.target;
        const toppings = this.state.toppings
        toppings.forEach(function (topping) {
            if (topping.id === parseInt(target.value, 10)) {
                topping.checked = "";
                if (target.checked) {
                    topping.checked = "checked";
                }
            }
        });
        this.setState({ [toppings]: toppings });
    }

    handleSubmit(event) {
        event.preventDefault();
        var errors = this._validate();
        if(errors !== "") {
            alert(errors);
            return;
        }
        var checkedToppings = this._getCheckedIds(this.state.toppings);
        this._update(checkedToppings);
    }

    _getCheckedIds(data) {
        var toppings = [];
        data.forEach(function(topping){
            if(topping.checked === "checked") {
                toppings.push(topping.id);
            }
        });
        return toppings;
    }

    _update(data) {
        var toppingPromises = [];
        for (var i = 0; i < data.length; i++) {
            var topping = data[i];
            var toppingPromise = fetch(`https://pizzaserver.herokuapp.com/pizzas/${this.props.params.id}/toppings`,
            {
                method: 'POST',
                body: JSON.stringify( { topping_id: topping } ),
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
            })
            .then((response)=>response.json())
            toppingPromises.push(toppingPromise)
        }
        Promise.all(toppingPromises)
            .then((results) => {
                if(results.length === toppingPromises.length) {
                    alert('Toppings Updated!');
                }
            })
            .catch(e => alert(e));
    }

    _validate() {
        var toppings = this.state.toppings
        for (var i = 0; i < toppings.length; i++) {
            if (toppings[i].checked === "checked") {
                return "";
            }
        }
        return "No toppings selected.";
    }

    render() {
        return (
            <form method='POST' action='' onSubmit={this.handleSubmit}>
                <fieldset className='marginTen alignCenter'>
                    <legend>Pizza:</legend>
                    <div>{this.props.params.id} - {this.props.params.name}</div>
                </fieldset>

                <fieldset className='marginTen alignCenter'>
                    <legend>Toppings:</legend>
                    <input type="submit" value="Update" />
                    <div className='threeColumns'>
                        {this.state.toppings.map(
                            topping=>
                            <div className='marginFive alignLeft'>
                                <label>
                                    <input type="checkbox" name="toppings[]" checked={topping.checked} value={topping.id} onChange={this.handleInputChange} />
                                    <span className='marginFive'>{topping.name}</span>
                                </label>
                            </div>
                        )}
                    </div>
                    <input type="submit" value="Update" />
                </fieldset>
            </form>
        );
    }
}

export default PizzaView;
