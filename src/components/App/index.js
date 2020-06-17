import React from 'react';
import Messenger from '../Messenger';
import Login from '../Login';
import Register from "../Register";


import {
    useHistory,
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default function App() {


    return (
        <main>
            <Router>
                <Switch>
                    <Route exact path='/' component={Messenger}/>
                    <Route exact path='/register' component={Register}/>
                    <Route path='/login' component={Login}/>
                </Switch>
            </Router>
        </main>
    );
}