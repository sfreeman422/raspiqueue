import React, { Component } from 'react';
import YouTube from 'react-youtube';
import PropTypes from 'prop-types';
import ThumbsButton from './Children/ThumbsButton';

// Options to interact with the react-youtube component.
const options = {
  playerVars: {
    autoplay: 1,
  },
};

class VideoContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      upvotes: 0,
      downvotes: 0,
    };
    this.upvote = this.upvote.bind(this);
    this.downvote = this.downvote.bind(this);
    this.cleanUp = this.cleanUp.bind(this);
  }
  // Increments the state of the upvotes for the currently playing song.
  upvote() {
    this.setState({
      upvotes: this.state.upvotes + 1,
    });
  }
  // Increments the state of the downvotes for the currently playing song.
  downvote() {
    this.setState({
      downvotes: this.state.downvotes + 1,
    });
  }
  // Sends the data off to our parent to be sent to the DB and sets local state to 0 for UV and DV.
  cleanUp() {
    this.props.adjustQueue(this.props.queueArr[0], this.state.upvotes, this.state.downvotes);
    this.setState({
      upvotes: 0,
      downvotes: 0,
    });
  }
  // Allows us to invoke upVote/downVote from the keyboard.
  handleKeyUp(event) {
    if (event.keyCode === 87) {
      this.upVote(this.props.queueArr[0].linkUrl);
    } else if (event.keycode === 83) {
      this.downVote(this.props.queueArr[0].linkUrl);
    }
  }
  render() {
    return (
      <div className="video-content-section">
        {this.props.queueArr.length > 0 ?
          <div className="video-content">
            <YouTube
              videoId={this.props.queueArr[0].linkUrl}
              opts={options}
              onEnd={() => this.cleanUp()}
            />
            <ThumbsButton type="far fa-thumbs-down" songId={this.props.queueArr[0].linkUrl} action={() => this.downvote()} handleKeyUp={() => this.handleKeyUp()} votes={this.state.downvotes} />
            <ThumbsButton type="far fa-thumbs-up" songId={this.props.queueArr[0].linkUrl} action={() => this.upvote()} handleKeyUp={() => this.handleKeyUp()} votes={this.state.upvotes} />
          </div>
    :
          <h3>No songs in the queue! Queue something</h3>}
      </div>
    );
  }
}

export default VideoContent;

VideoContent.propTypes = {
  queueArr: PropTypes.arrayOf(PropTypes.object).isRequired,
  adjustQueue: PropTypes.func.isRequired,
};
