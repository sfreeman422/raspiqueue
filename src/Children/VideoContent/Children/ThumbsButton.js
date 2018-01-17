import React from 'react';
import PropTypes from 'prop-types';

// Renders a thumbsUp or thumbsDown button based on the props passed in.
const ThumbsButton = props => (
  <div
    className="thumbsDown"
    role="button"
    tabIndex="0"
    onClick={() => props.action()}
    onKeyUp={event => props.handleKeyUp(event)}
  >
    <i
      className={props.type}
    />
  </div>
);

export default ThumbsButton;

ThumbsButton.propTypes = {
  type: PropTypes.string.isRequired,
  songId: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  handleKeyUp: PropTypes.func.isRequired,
};
