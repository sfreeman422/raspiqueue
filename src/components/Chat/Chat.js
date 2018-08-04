import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './Chat.css';

const mapStateToProps = state => ({
  messages: state.messages,
});

class ConnectedChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isScrolling: false,
      message: '',
    };
    this.handleUserMessage = this.handleUserMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    document.getElementsByClassName('message-area')[0].addEventListener('scroll', this.handleScroll);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.messages !== this.props.messages) {
      this.scrollToBottom();
    }
  }

  componentWillUnmount() {
    document.getElementsByClassName('message-area')[0].removeEventListener('scroll', this.handleScroll);
  }

  handleUserMessage(event) {
    this.setState({
      message: event.target.value,
    });
  }

  scrollToBottom() {
    console.log(this.state.isScrolling);
    if (!this.state.isScrolling) {
      this.setState({ isScrolling: false });
      const chatDiv = document.getElementsByClassName('message-area');
      chatDiv[0].scrollTop = chatDiv[0].scrollHeight;
    }
  }

  handleScroll() {
    let oldScroll;
    const chat = document.getElementsByClassName('message-area')[0];
    console.log(oldScroll < chat.scrollTop);
    if (oldScroll < chat.scrollTop) {
      console.log('user is scrolling up');
      this.setState({ isScrolling: true });
      this.scrollToBottomTimeOut = setTimeout(this.scrollToBottom, 3000);
      this.oldScroll = chat.scrollTop;
    }
  }

  sendMessage(event) {
    event.preventDefault();
    this.props.sendMessage(this.state.message);
    this.setState({
      message: '',
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
                  <form onSubmit={this.sendMessage}>
                    <input
                      type="text"
                      placeholder="Enter text message here..."
                      value={this.state.message}
                      onChange={this.handleUserMessage}
                    />
                    <button type="submit">Send</button>
                  </form>
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
