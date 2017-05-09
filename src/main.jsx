/**
 * App entry point
 */

// Polyfill
import 'babel-polyfill';

// Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import io from 'socket.io-client';

// Routes
import Routes from './routes';

// Base styling
import './common/base.css';

// ID of the DOM element to mount app on
const DOM_APP_EL_ID = 'app';

// Render the router
ReactDOM.render((
    <Router history={browserHistory}>
        {Routes}
    </Router>
), document.getElementById(DOM_APP_EL_ID));

