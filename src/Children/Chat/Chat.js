import React, { Component } from 'react';

// Will render an array of messages from the server/
// At the present time, this is merely a dummy component.
// This component will likely not be made functional until the end of the alpha phase.
class Chat extends Component {
  render() {
    return (
      <div className="chat">
        <table>
          <tbody>
            {this.props.messageArr.map((message, index) => <tr key={`message-row-${index}`}><td>{message.userId}: {message.data}</td></tr>)}
            <tr>
              <td><input type="text" placeholder="Enter text message here..." /><i className="fas fa-share" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Chat;
