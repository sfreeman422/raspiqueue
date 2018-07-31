import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import SearchResult from './Children/SearchResult';
import './Queue.css';

const mapStateToProps = state => ({
  queue: state.queue,
  history: state.history,
  roomId: state.roomId,
  user: state.user,
});

class ConnectedQueue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenView: 'queue',
      searchTerm: '',
      searchResults: [],
      isSearching: false,
    };
    this.changeView = this.changeView.bind(this);
    this.search = this.search.bind(this);
    this.onSearchTermChange = this.onSearchTermChange.bind(this);
  }

  onSearchTermChange(event) {
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

  search(e) {
    e.preventDefault();
    this.setState({ isSearching: true, chosenView: 'searchResults' });
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
          isSearching: false,
        });
      });
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

  render() {
    return (
      <div className="queue">
        <div className="view-buttons">
          <form onSubmit={this.search}>
            <input type="text" placeholder="Search for a song..." value={this.state.searchTerm} onChange={this.onSearchTermChange} />
            <i className="fas fa-search" />
          </form>
          <button onClick={() => this.changeView('queue')}>Queue</button>
          <button onClick={() => this.changeView('history')}>History</button>
          <button onClick={() => this.changeView('myQueue')}>My Queue</button>
          <button onClick={() => this.changeView('searchResults')}>Search Results</button>
        </div>
        <div className="queue-list">
          <table>
            <tbody>
              {this.state.chosenView === 'queue' ? this.props.queue.map((queueItem, index) => <tr key={`queue-row-item-${index}`}><td>{queueItem.linkName}{index === 0 ? <i className="fas fa-headphones" /> : null}<br /><span id="postedBy">Added by: {queueItem.userName}</span></td></tr>) : null}
              {this.state.chosenView === 'history' ? this.props.history.map((historyItem, index) => <tr key={`history-row-item${index}`}><td>{historyItem.linkName}<br /><span id="postedBy">Added by: {historyItem.userName}</span></td></tr>) : null}
              {this.state.chosenView === 'myQueue' ?
              this.props.queue
                .filter(queueItem => queueItem.userName === this.props.user.userName)
                .map((queueItem, index) =>
                (
                  <tr key={`queue-row-item-${index}`}>
                    <td>{queueItem.linkName}<br />
                      <span id="postedBy">Added by: {queueItem.userName}</span>
                    </td>
                  </tr>
                ))
              :
              null}
              {this.state.chosenView === 'searchResults' ?
              this.state.searchResults
                .map((searchItem, index) => (
                  <tr key={`search-result-item-${index}`}>
                    <SearchResult
                      searchItem={searchItem}
                      addToPlaylist={this.props.addToPlaylist}
                      userId={this.props.user.userId}
                      roomId={this.props.roomId}
                    />
                  </tr>)) : null}
            </tbody>
          </table>
        </div>
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
  user: PropTypes.number,
  roomId: PropTypes.number,
};

ConnectedQueue.defaultProps = {
  queue: [],
  history: [],
  user: 0,
  roomId: 0,
};
