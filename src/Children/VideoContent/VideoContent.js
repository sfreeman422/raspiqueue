import React, { Component } from 'react';
import YouTube from 'react-youtube';

const options = {
  playerVars: {
    autoplay: 1,
  },
};

class VideoContent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="video-content">
        <YouTube
          videoId={this.props.queueArr[0].linkUrl}
          opts={options}
          onEnd={() => this.props.adjustQueue()}
        />
        {/* <iframe title="video" src={`https://www.youtube.com/embed/${this.props.queueArr[0].linkUrl}?enablejsapi=1&autoplay=1&controls=0`} /> */}
        <button className="thumbsDownButton"><i className="far fa-thumbs-down" /></button>
        <button className="thumbsUpButton"><i className="far fa-thumbs-up" /></button>
      </div>
    );
  }
}

export default VideoContent;
