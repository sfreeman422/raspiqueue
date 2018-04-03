/* eslint class-methods-use-this: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import openSocket from 'socket.io-client';
import { connect } from 'react-redux';
import logo from './logo.svg';
import './App.css';
import Queue from './Children/Queue/Queue';
import VideoContent from './Children/VideoContent/VideoContent';
import Chat from './Children/Chat/Chat';
import NoRoom from './Children/NoRoom';
import * as actions from './actions/actions';

const mapStateToProps = state => ({
  roomName: state.roomName,
  roomErr: state.roomErr,
  connectedUser: state.connectedUser,
  loggedInState: state.loggedInUser,
  client: state.client,
});

const mapDispatchToProps = dispatch => ({
  updateRoomName: roomName => dispatch(actions.updateRoomName(roomName)),
  updateQueue: queueArr => dispatch(actions.updateQueue(queueArr)),
  updateHistory: historyArr => dispatch(actions.updateHistory(historyArr)),
  updateRoomId: roomId => dispatch(actions.updateRoomId(roomId)),
  updateClient: client => dispatch(actions.updateClient(client)),
  setRoomError: roomErr => dispatch(actions.setRoomErr(roomErr)),
});

class ConnectedApp extends Component {
  constructor(props) {
    super(props);
    this.markPlayed = this.markPlayed.bind(this);
    this.adjustQueue = this.adjustQueue.bind(this);
    this.addToPlaylist = this.addToPlaylist.bind(this);
    this.initializeApp = this.initializeApp.bind(this);
    this.updateQueue = this.updateQueue.bind(this);
  }
  componentDidMount() {
    this.initializeApp();
  }
  initializeApp() {
    let { roomName } = this.props.match.params;
    if (!roomName) {
      roomName = 'lobby';
    }
    const client = openSocket();
    client.connect(`/${roomName}`);
    client.on('queueChanged', () => this.updateQueue(roomName));
    client.on('messageReceived', () => this.getMessages());
    this.props.updateClient(client);
    this.updateQueue(roomName);
    // this.getMessages(roomName);
  }
  updateQueue(roomName) {
    // Get the roomName, current queue and history queue from MySQL.
    fetch(`/api/${roomName}`)
      .then(response => response.json()).then((json) => {
        if (json.status === 200) {
          // Sets state based on results of query.
          this.props.updateRoomName(json.roomName);
          this.props.updateQueue(json.queue);
          this.props.updateHistory(json.history);
          this.props.updateRoomId(json.roomId);
        } else if (json.status === 404) {
          this.props.setRoomError(json.message);
        }
      });
  }
  // Makes a request to the server to make a song as played.
  // If a song has been played, it will be listed in the historyArr
  // If a song has not yet been played, it will be listed in the queue.
  markPlayed(songObj) {
    fetch('/api/played', {
      method: 'post',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(songObj),
    }).then(response => response.json()).then((json) => {
      this.props.client.emit('markPlayed', `Played video: ${songObj.linkName}`);
    });
  }
  addToPlaylist(songObj) {
    fetch('/api/addSong', {
      method: 'post',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(songObj),
    }).then(response => response.json()).then((json) => {
      // Lets our server know that we have added a song.
      this.props.client.emit('addVideo', `Added video: ${songObj.title}`);
    });
  }
  adjustQueue(songObj, upvotes, downvotes) {
    const dbObj = Object.assign(songObj, {});
    // The following three values should be sent to
    // a route that will adjust the amount of upvotes/downvotes on a song.
    // This will be stored in the DB so that end users can view the most liked songs in a room etc.
    // Possibility: May want to constantly update the upvotes/downvotes
    // per vote OR communicate the current # via socket?
    dbObj.upvotes += upvotes;
    dbObj.downvotes += downvotes;
    this.markPlayed(dbObj);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">{this.props.roomName === '' ? 'Welcome to Music Stream' : this.props.roomName}</h1>
        </header>
        {this.props.roomErr !== '' ?
          <div className="container">
            <NoRoom />
          </div> :
          <div className="container">
            <Queue addToPlaylist={this.addToPlaylist} />
            <VideoContent
              adjustQueue={this.adjustQueue}
            />
            <Chat />
          </div>}
      </div>
    );
  }
}

const App = connect(mapStateToProps, mapDispatchToProps)(ConnectedApp);

ConnectedApp.propTypes = {
  roomName: PropTypes.string,
  roomErr: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  updateRoomName: PropTypes.func.isRequired,
  updateQueue: PropTypes.func.isRequired,
  updateHistory: PropTypes.func.isRequired,
  updateRoomId: PropTypes.func.isRequired,
  setRoomError: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
};

ConnectedApp.defaultProps = {
  roomName: '',
  roomErr: '',
};
export default App;
