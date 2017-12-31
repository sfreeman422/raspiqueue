import React, { Component } from 'react';
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
      currentlyPlayingUrl: testData.currentlyPlayingUrl,
      queueArr: testData.queueArr,
      messageArr: testData.messageArr,
    };
  }
  componentWillMount() {
    if (this.props.match.params.roomName !== undefined) {
      fetch(`/api/${this.props.match.params.roomName}`)
        .then(response => response.json()).then((json) => {
          if (json.status === 200) {
            // This part should add additional information to state based on the SQL queries
            // That we will make on the server.
            this.setState({
              roomName: json.roomName,
            });
            const client = openSocket();
            client.connect(`/${json.roomName}`);
            client.on('connectionResponse', response => console.log(response));
          } else if (json.status === 404) {
            this.setState({
              roomErr: json.message,
            });
          }
        });
    }
  }
  render() {
    console.log(this.state);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Music Stream</h1>
        </header>
        {this.state.roomErr !== '' ?
          <div className="container">
            <NoRoom error={this.state.roomErr} />
          </div> :
          <div className="container">
            <Queue
              queueArr={this.state.queueArr}
            />
            <VideoContent
              url={this.state.currentlyPlayingUrl}
            />
            <Chat messageArr={this.state.messageArr} />
          </div>}
      </div>
    );
  }
}

export default App;
