import React from 'react';
import { Router, Route } from 'react-router';

import App from './App';
import ToppingList from './pages/Pizza/ToppingList';
import PizzaList from './pages/Pizza/PizzaList';
import PizzaView from './pages/Pizza/PizzaView';
import NotFound from './pages/NotFound/NotFound';

const Routes = (props) => (
    <Router {...props}>
        <Route path="/" component={App}>
            <Route path="/pizzas" component={PizzaList} />
            <Route path="/pizza/:id/:name" component={PizzaView} />
            <Route path="/toppings" component={ToppingList} />
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
);

export default Routes;
