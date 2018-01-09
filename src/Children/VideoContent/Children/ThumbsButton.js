import React from 'react';
import PropTypes from 'prop-types';

const ThumbsButton = ({
  type, songId, upvote, downvote, handleKeyUp,
}) => {
  if (type === 'up') {
    return (
      <div className="thumbsUp" role="button" tabIndex="0" onClick={() => upvote(songId)} onKeyUp={event => handleKeyUp(event)}>
        <i
          className="far fa-thumbs-up"
        />
      </div>
    );
  }
  return (
    <div className="thumbsDown" role="button" tabIndex="0" onClick={() => downvote(songId)} onKeyUp={event => handleKeyUp(event)}>
      <i
        className="far fa-thumbs-down"
      />
    </div>
  );
};

export default ThumbsButton;

ThumbsButton.propTypes = {
  type: PropTypes.string.isRequired,
  songId: PropTypes.string.isRequired,
  upvote: PropTypes.func.isRequired,
  downvote: PropTypes.func.isRequired,
  handleKeyUp: PropTypes.func.isRequired,
};
