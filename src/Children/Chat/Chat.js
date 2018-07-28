import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  messages: state.messages,
});

class ConnectedChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    };
    this.handleUserMessage = this.handleUserMessage.bind(this);
  }

  handleUserMessage(event) {
    this.setState({
      message: event.target.value,
    });
  }

  render() {
    return (
      <div className="chat">
        <div className="message-area">
          <table>
            <tbody>
              {this.props.messages.map((message, index) => <tr key={`message-row-${index}`}><td>{message.userName}: {message.message}</td></tr>)}
            </tbody>
          </table>
        </div>
        <div className="message-input-area">
          <table>
            <tbody>
              <tr>
                <td>
                  <input type="text" placeholder="Enter text message here..." value={this.state.message} onChange={this.handleUserMessage} />
                  <button onClick={() => this.props.sendMessage(this.state.message)}>Send</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

ConnectedChat.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object),
  sendMessage: PropTypes.func.isRequired,
};

ConnectedChat.defaultProps = {
  messages: [{}],
};
const Chat = connect(mapStateToProps)(ConnectedChat);

export default Chat;
