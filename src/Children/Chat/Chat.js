import React, { Component } from 'react';

class Chat extends Component {
  render() {
    return (
      <div className="chat">
        <table>
          <tbody>
            {this.props.messageArr.map((message, index) => <tr key={`message-row-${index}`}><td>{message.userId}: {message.data}</td></tr>)}
            <tr>
              <td><input type="text" placeholder="Enter text message here..." /><i className='fas fa-share' /></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Chat;
