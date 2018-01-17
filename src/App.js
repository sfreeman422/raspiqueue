import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import openSocket from 'socket.io-client';
import logo from './logo.svg';
import './App.css';
import Queue from './Children/Queue/Queue';
import VideoContent from './Children/VideoContent/VideoContent';
import Chat from './Children/Chat/Chat';
import NoRoom from './Children/NoRoom';
import testData from './testData';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: '',
      roomErr: '',
      users: '',
      loggedInStatus: false,
      loggedInUser: '',
      queueArr: testData.queueArr,
      messageArr: testData.messageArr,
      historyArr: [],
    };
    this.markPlayed = this.markPlayed.bind(this);
  }
  componentWillMount() {
    // If we have a roomName parameter...
    if (this.props.match.params.roomName !== undefined) {
      // Get the roomName, current queue and history queue from MySQL.
      fetch(`/api/${this.props.match.params.roomName}`)
        .then(response => response.json()).then((json) => {
          if (json.status === 200) {
            // Sets state based on results of query.
            this.setState({
              roomName: json.roomName,
              queueArr: json.queue,
              historyArr: json.history,
            });
            // Creates a socket connection for the client.
            const client = openSocket();
            // Connects us to the specific name space we are looking for.
            // This needs work.
            // How can our users see messages/queue/video info via this socket?
            client.connect(`/${json.roomName}`);
          } else if (json.status === 404) {
            this.setState({
              roomErr: json.message,
            });
          }
        });
    }
  }
  // Makes a request to the server to make a song as played. 
  // If a song has been played, it will be listed in the historyArr
  // If a song has not yet been played, it will be listed in the queue.
  markPlayed(songObj) {
    console.log(songObj);
    fetch('/api/played', {
      method: 'post',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(songObj),
    }).then(response => response.json()).then((json) => {
      this.setState({
        queueArr: json.queue,
        historyArr: json.history,
      });
    });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">{this.state.roomName === '' ? 'Welcome to Music Stream' : this.state.roomName}</h1>
        </header>
        {this.state.roomErr !== '' ?
          <div className="container">
            <NoRoom error={this.state.roomErr} />
          </div> :
          <div className="container">
            <Queue
              queueArr={this.state.queueArr}
              historyArr={this.state.historyArr}
            />
            <VideoContent
              queueArr={this.state.queueArr}
              adjustQueue={this.markPlayed}
            />
            <Chat messageArr={this.state.messageArr} />
          </div>}
      </div>
    );
  }
}

export default App;
