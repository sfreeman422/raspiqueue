import React, { Component } from 'react';
import YouTube from 'react-youtube';
import PropTypes from 'prop-types';
import ThumbsButton from './Children/ThumbsButton';

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
  }
  upvote(songId) {
    console.log(`SongID: ${songId} should be upvoted.`);
    console.log(`Currently has ${this.state.upvotes} upvotes`);
    this.setState({
      upvotes: this.state.upvotes + 1,
    });
  }
  downvote(songId) {
    console.log(`SongID: ${songId} should be downvoted.`);
    console.log(`Currently has ${this.state.downvotes} downvotes`);
    this.setState({
      downvotes: this.state.downvotes + 1,
    });
  }
  handleKeyUp(event) {
    if (event.keyCode === 85 || 38) {
      this.upVote(this.props.queueArr[0].linkUrl);
    } else if (event.keycode === 68 || 40) {
      this.downVote(this.props.queueArr[0].linkUrl);
    }
  }
  render() {
    return (
      <div className="video-content">
        {this.props.queueArr.length > 0 ?
          <YouTube
            videoId={this.props.queueArr[0].linkUrl}
            opts={options}
            onEnd={() => this.props.adjustQueue()}
          />
    :
          <h3>No songs in the queue! Queue something</h3>}
        <ThumbsButton type="down" songId={this.props.queueArr[0].linkUrl} downvote={() => this.downvote()} upvote={() => this.upvote()} handleKeyUp={() => this.handleKeyUp()} />
        <ThumbsButton type="up" songId={this.props.queueArr[0].linkUrl} downvote={() => this.downvote()} upvote={() => this.upvote()} handleKeyUp={() => this.handleKeyUp()} />
      </div>
    );
  }
}

export default VideoContent;

VideoContent.propTypes = {
  queueArr: PropTypes.arrayOf(PropTypes.object).isRequired,
  adjustQueue: PropTypes.func.isRequired,
};
