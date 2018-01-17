import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

/*
Renders a router and a switch
allowing us to take advantage of route parameters
*/
ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/join/:roomName" component={App} />
      <Route path="/" component={App} />
    </Switch>
  </Router>
  , document.getElementById('root'),
);
registerServiceWorker();
