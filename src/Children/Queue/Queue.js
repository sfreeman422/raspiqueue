import React, { Component } from 'react';

class Queue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      linkToAdd: '',
      searchTerm: '',
    };
  }
  render() {
    return (
      <div className="queue">
        <table>
          <tbody>
            <tr>
              <td>
                Search: <input type="text" /> <i className="fas fa-search" />
              </td>
            </tr>
          {this.props.queueArr.map((queueItem, index) => <tr key={`queue-row-item-${index}`}><td>{queueItem.linkName}</td></tr>)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Queue;
