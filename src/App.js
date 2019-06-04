/* eslint class-methods-use-this: 0 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import fetch from "isomorphic-fetch";
import { connect } from "react-redux";
import logo from "./logo.svg";
import "./App.css";
import Queue from "./components/Queue/Queue";
import VideoContent from "./components/VideoContent/VideoContent";
import NoRoom from "./components/NoRoom";
import * as actions from "./actions/actions";
import ClientSocket from "./ClientSocket";

const mapStateToProps = state => ({
  roomName: state.roomName,
  roomErr: state.roomErr,
  user: state.user,
  loggedInState: state.loggedInUser,
  client: state.client,
  queue: state.queue
});

const mapDispatchToProps = dispatch => ({
  updateRoomName: roomName => dispatch(actions.updateRoomName(roomName)),
  updateQueue: queueArr => dispatch(actions.updateQueue(queueArr)),
  updateHistory: historyArr => dispatch(actions.updateHistory(historyArr)),
  updateRoomId: roomId => dispatch(actions.updateRoomId(roomId)),
  updateClient: client => dispatch(actions.updateClient(client)),
  setRoomError: roomErr => dispatch(actions.setRoomErr(roomErr)),
  setUser: user => dispatch(actions.setUser(user)),
  updateMessages: message => dispatch(actions.updateMessages(message)),
  setCurrentSong: song => dispatch(actions.setCurrentSong(song))
});

class ConnectedApp extends Component {
  constructor(props) {
    super(props);
    this.currentSongTimeout = undefined;
    this.markPlayed = this.markPlayed.bind(this);
    this.adjustQueue = this.adjustQueue.bind(this);
    this.addToPlaylist = this.addToPlaylist.bind(this);
    this.initializeApp = this.initializeApp.bind(this);
    this.updateQueue = this.updateQueue.bind(this);
  }

  componentDidMount() {
    this.initializeApp();
  }

  componentWillUnmount() {
    ClientSocket.client.emit("disconnect", this.props.user);
  }

  initializeApp() {
    let { roomName } = this.props.match.params;
    if (!roomName) {
      roomName = "lobby";
    }
    ClientSocket.client.connect();
    ClientSocket.client.on("connected", userObj => {
      this.props.setUser(userObj);
      ClientSocket.client.emit("joinRoom", roomName);
      ClientSocket.isConnected = true;
    });
    ClientSocket.client.on("queueChanged", () => this.updateQueue(roomName));
    this.updateQueue(roomName);
  }

  setCurrentSong(song) {
    window.clearTimeout(this.currentSongTimeout);
    if (this.props.queue.length > 0 && ClientSocket.isConnected) {
      ClientSocket.client.emit("currentSong", this.props.queue[0]);
    } else {
      this.currentSongTimeout = window.setTimeout(
        () => this.setCurrentSong(song),
        1000
      );
    }
  }

  updateQueue(roomName) {
    // Get the roomName, current queue and history queue from MySQL.
    fetch(`/api/${roomName}`)
      .then(response => response.json())
      .then(json => {
        console.debug("Updating queue with", json);
        if (json.status === 200) {
          // Sets state based on results of query.
          this.props.updateRoomName(json.roomName);
          this.props.updateQueue(json.queue);
          this.props.updateHistory(json.history);
          this.props.updateRoomId(json.roomId);
          this.props.setCurrentSong(json.queue[0]);
          this.setCurrentSong(json.queue[0]);
        } else if (json.status === 404) {
          this.props.setRoomError(json.message);
        }
      })
      .catch(e => this.props.setRoomError(e.message));
  }

  // Makes a request to the server to make a song as played.
  // If a song has been played, it will be listed in the historyArr
  // If a song has not yet been played, it will be listed in the queue.
  markPlayed(songObj) {
    fetch("/api/played", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(songObj)
    })
      .then(response => response.json())
      .then(() => {
        ClientSocket.client.emit("markPlayed", songObj);
      });
  }

  removeFromQueue(songObj) {
    fetch("/api/remove", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(songObj)
    })
      .then(response => response.json())
      .then(res => {
        ClientSocket.client.emit("queueChange", this.props.queue);
      });
  }

  addToPlaylist(songObj) {
    fetch("/api/addSong", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(songObj)
    })
      .then(response => response.json())
      .then(() => {
        // Lets our server know that we have added a song.
        ClientSocket.client.emit("addVideo", songObj);
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
    console.log(this.props);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Welcome to Raspiqueue</h1>
          <h2>You are logged in as {this.props.user.userName}</h2>
        </header>
        {this.props.roomErr !== "" ? (
          <div className="container">
            <NoRoom />
          </div>
        ) : (
          <div className="container">
            <VideoContent adjustQueue={this.adjustQueue} />
            <Queue
              addToPlaylist={this.addToPlaylist}
              removeFromQueue={this.removeFromQueue}
            />
          </div>
        )}
      </div>
    );
  }
}

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedApp);

ConnectedApp.propTypes = {
  roomName: PropTypes.string,
  roomErr: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  updateRoomName: PropTypes.func.isRequired,
  updateQueue: PropTypes.func.isRequired,
  updateHistory: PropTypes.func.isRequired,
  updateRoomId: PropTypes.func.isRequired,
  setRoomError: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  updateMessages: PropTypes.func.isRequired
};

ConnectedApp.defaultProps = {
  roomName: "",
  roomErr: ""
};
export default App;
