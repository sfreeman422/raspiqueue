import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  messages: state.messages,
});
// Will render an array of messages from the server/
// At the present time, this is merely a dummy component.
// This component will likely not be made functional until the end of the alpha phase.

const ConnectedChat = ({ messages }) => (
  <div className="chat">
    <div className="message-area">
      <table>
        <tbody>
          {messages.map((message, index) => <tr key={`message-row-${index}`}><td>{message.userId}: {message.message}</td></tr>)}
        </tbody>
      </table>
    </div>
    <div className="message-input-area">
      <table>
        <tbody>
          <tr>
            <td>
              <input type="text" placeholder="Enter text message here..." />
              <i className="fas fa-share" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

ConnectedChat.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object),
};

ConnectedChat.defaultProps = {
  messages: [{}],
};
const Chat = connect(mapStateToProps)(ConnectedChat);

export default Chat;
