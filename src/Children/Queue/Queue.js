import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import SearchResult from './Children/SearchResult';

const mapStateToProps = state => ({
  queue: state.queue,
  history: state.history,
  roomId: state.roomId,
  connectedUser: state.connectedUser,
});

class ConnectedQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenView: 'queue',
      searchTerm: '',
      searchResults: [],
    };
    this.changeView = this.changeView.bind(this);
    this.search = this.search.bind(this);
    this.adjustState = this.adjustState.bind(this);
  }
  // Adjusts the view of the component to show queue, history or myQueue.
  // Queue - Shows the current queue of songs. (Functional)
  // History  - Shows the songs that have been played. (Functional)
  // MyQueue - Shows the songs that a user has personally queued. (Not Functional)
  changeView(view) {
    this.setState({
      chosenView: view,
    });
  }
  search(e) {
    e.preventDefault();
    fetch('/api/youtube', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: this.state.searchTerm,
      }),
    })
      .then(res => res.json())
      .then((json) => {
        this.setState({
          searchResults: json,
          chosenView: 'searchResults',
        });
      });
  }
  adjustState(event) {
    this.setState({
      searchTerm: event.target.value,
    });
    if (event.target.value === '') {
      this.setState({
        searchResults: [],
        chosenView: 'queue',
      });
    }
  }
  // Issue: chosenView = 'myQueue' is not functional. Need to determine when to get users queue.
  render() {
    return (
      <div className="queue">
        <button onClick={() => this.changeView('queue')}>Queue</button>
        <button onClick={() => this.changeView('history')}>History</button>
        <button onClick={() => this.changeView('myQueue')}>My Queue</button>
        <button onClick={() => this.changeView('searchResults')}>Search Results</button>
        <table>
          <tbody>
            <tr>
              <td>
                Search: <form onSubmit={this.search}> <input type="text" value={this.state.searchTerm} onChange={this.adjustState} /> <i className="fas fa-search" /> </form>
              </td>
            </tr>
            {this.state.chosenView === 'queue' ? this.props.queue.map((queueItem, index) => <tr key={`queue-row-item-${index}`}><td>{queueItem.linkName}{index === 0 ? <i className="fas fa-headphones" /> : null}<br /><span id="postedBy">Added by: {queueItem.userName}</span></td></tr>) : null}
            {this.state.chosenView === 'history' ? this.props.history.map((historyItem, index) => <tr key={`history-row-item${index}`}><td>{historyItem.linkName}<br /><span id="postedBy">Added by: {historyItem.userName}</span></td></tr>) : null}
            {this.state.chosenView === 'myQueue' ? this.props.queue.map((queueItem, index) => <tr key={`queue-row-item-${index}`}><td>{queueItem.linkName}<br /><span id="postedBy">Added by: {queueItem.userName}</span></td></tr>) : null}
            {this.state.chosenView === 'searchResults' ? this.state.searchResults.map((searchItem, index) => <tr key={`search-result-item-${index}`}><SearchResult searchItem={searchItem} addToPlaylist={this.props.addToPlaylist} userId={this.props.connectedUser} roomId={this.props.roomId} /></tr>) : null}
          </tbody>
        </table>
      </div>
    );
  }
}
const Queue = connect(mapStateToProps)(ConnectedQueue);

export default Queue;

ConnectedQueue.propTypes = {
  queue: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.arrayOf(PropTypes.object),
  addToPlaylist: PropTypes.func.isRequired,
  connectedUser: PropTypes.number,
  roomId: PropTypes.number,
};

ConnectedQueue.defaultProps = {
  queue: [],
  history: [],
  connectedUser: 0,
  roomId: 0,
};
