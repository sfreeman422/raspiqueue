import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import SearchResults from './Children/SearchResult';

class Queue extends Component {
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
    console.log(this.state.searchTerm);
    return (
      <div className="queue">
        <button onClick={() => this.changeView('queue')}>Queue</button>
        <button onClick={() => this.changeView('history')}>History</button>
        <button onClick={() => this.changeView('myQueue')}>My Queue</button>
        <table>
          <tbody>
            <tr>
              <td>
                Search: <form onSubmit={this.search}> <input type="text" value={this.state.searchTerm} onChange={this.adjustState} /> <i className="fas fa-search" /> </form>
              </td>
            </tr>
            {this.state.chosenView === 'queue' ? this.props.queueArr.map((queueItem, index) => <tr key={`queue-row-item-${index}`}><td>{queueItem.linkName}{index === 0 ? <i className="fas fa-headphones" /> : null}</td></tr>) : null}
            {this.state.chosenView === 'history' ? this.props.historyArr.map((historyItem, index) => <tr key={`history-row-item${index}`}><td>{historyItem.linkName}</td></tr>) : null}
            {this.state.chosenView === 'myQueue' ? this.props.queueArr.map((queueItem, index) => <tr key={`queue-row-item-${index}`}><td>{queueItem.linkName}</td></tr>) : null}
            {this.state.chosenView === 'searchResults' ? this.state.searchResults.map((searchItem, index) => <SearchResults index={index} searchItem={searchItem} addToPlaylist={this.props.addToPlaylist} />) : null}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Queue;

Queue.propTypes = {
  queueArr: PropTypes.arrayOf(PropTypes.object).isRequired,
  historyArr: PropTypes.arrayOf(PropTypes.object).isRequired,
};
