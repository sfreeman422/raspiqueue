import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Queue from './Children/Queue/Queue';
import VideoContent from './Children/VideoContent/VideoContent';
import Chat from './Children/Chat/Chat';
import testData from './testData';

class App extends Component {
  constructor() {
    super();
    this.state = {
      roomId: '',
      users: '',
      loggedInStatus: false,
      loggedInUser: '',
      currentlyPlayingUrl: testData.currentlyPlayingUrl,
      queueArr: testData.queueArr,
      messageArr: testData.messageArr,
    };
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Music Stream</h1>
        </header>
        <div className="container">
          <Queue
            queueArr={this.state.queueArr}
          />
          <VideoContent
            url={this.state.currentlyPlayingUrl}
          />
          <Chat messageArr={this.state.messageArr} />
        </div>
      </div>
    );
  }
}

export default App;
