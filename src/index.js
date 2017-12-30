import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/join/:roomId" component={App} />
      <Route path="/" component={App} />
    </Switch>
  </Router>
  , document.getElementById('root'),
);
registerServiceWorker();
