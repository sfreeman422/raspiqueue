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

let client;

const mapStateToProps = state => ({
  roomName: state.roomName,
  roomErr: state.roomErr,
  connectedUser: state.connectedUser,
  loggedInState: state.loggedInUser,
});

const mapDispatchToProps = dispatch => ({
  updateRoomName: roomName => dispatch(actions.updateRoomName(roomName)),
  updateQueue: queueArr => dispatch(actions.updateQueue(queueArr)),
  updateHistory: historyArr => dispatch(actions.updateHistory(historyArr)),
  updateRoomId: roomId => dispatch(actions.updateRoomId(roomId)),
  setRoomError: roomErr => dispatch(actions.setRoomErr(roomErr)),
});

class ConnectedApp extends Component {
  constructor(props) {
    super(props);
    this.markPlayed = this.markPlayed.bind(this);
    this.adjustQueue = this.adjustQueue.bind(this);
    this.addToPlaylist = this.addToPlaylist.bind(this);
    this.updateQueue = this.updateQueue.bind(this);
  }
  componentDidMount() {
    this.updateQueue();
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
      client.emit('queueChange', `Played video: ${songObj.title}`);
    });
  }
  updateQueue() {
    // If we have a roomName parameter...
    if (this.props.match.params.roomName !== undefined) {
      // Get the roomName, current queue and history queue from MySQL.
      fetch(`/api/${this.props.match.params.roomName}`)
        .then(response => response.json()).then((json) => {
          if (json.status === 200) {
            // Sets state based on results of query.
            this.props.updateRoomName(json.roomName);
            this.props.updateQueue(json.queue);
            this.props.updateHistory(json.history);
            this.props.updateRoomId(json.roomId);
            // Creates a socket connection for the client.
            client = openSocket();
            // Connects us to the specific name space we are looking for.
            // This needs work.
            // How can our users see messages/queue/video info via this socket?
            client.connect(`/${json.roomName}`);
            // Tells our client to update the queue when a song is added/removed, etc.
            client.on('updateQueue', () => this.updateQueue());
          } else if (json.status === 404) {
            this.props.setRoomErr(json.message);
          }
        });
    } else {
      // Get the roomName, current queue and history queue from MySQL.
      fetch('/api/lobby')
        .then(response => response.json()).then((json) => {
          if (json.status === 200) {
            // Sets state based on results of query.
            // Sets state based on results of query.
            this.props.updateRoomName(json.roomName);
            this.props.updateQueue(json.queue);
            this.props.updateHistory(json.history);
            this.props.updateRoomId(json.roomId);
            // Creates a socket connection for the client.
            client = openSocket();
            // Connects us to the specific name space we are looking for.
            // This needs work.
            // How can our users see messages/queue/video info via this socket?
            client.connect(`/${json.roomName}`);
            // Tells our client to update the queue when a song is added/removed, etc.
            client.on('updateQueue', () => this.updateQueue());
          } else if (json.status === 404) {
            this.props.setRoomErr(json.message);
          }
        });
    }
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
      client.emit('queueChange', `Added video: ${songObj.title}`);
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
              client={client}
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
  setRoomErr: PropTypes.func.isRequired,
};

ConnectedApp.defaultProps = {
  roomName: '',
  roomErr: '',
};
export default App;
