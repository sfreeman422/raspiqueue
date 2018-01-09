import React, { Component } from 'react';

class Queue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      linkToAdd: '',
      searchTerm: '',
      chosenView: 'queue',
    };
    this.changeView = this.changeView.bind(this);
  }
  changeView(view) {
    this.setState({
      chosenView: view,
    });
  }
  // Issue: chosenView = 'myQueue' is not functional. Need to determine when to get users queue.
  render() {
    return (
      <div className="queue">
        <button onClick={() => this.changeView('queue')}>Queue</button><button onClick={() => this.changeView('history')}>History</button><button onClick={() => this.changeView('myQueue')}>My Queue</button>
        <table>
          <tbody>
            <tr>
              <td>
                Search: <input type="text" /> <i className="fas fa-search" />
              </td>
            </tr>
            {this.state.chosenView === 'queue' ? this.props.queueArr.map((queueItem, index) => <tr key={`queue-row-item-${index}`}><td>{queueItem.linkName}</td></tr>) : null}
            {this.state.chosenView === 'history' ? this.props.historyArr.map((historyItem, index) => <tr key={`history-row-item${index}`}><td>{historyItem.linkName}</td></tr>) : null}
            {this.state.chosenView === 'myQueue' ? this.props.queueArr.map((queueItem, index) => <tr key={`queue-row-item-${index}`}><td>{queueItem.linkName}</td></tr>) : null}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Queue;
