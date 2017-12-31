import React, { Component } from 'react';

class VideoContent extends Component {
  render() {
    return (
      <div className="video-content">
        <iframe title="video" src={`https://www.youtube.com/embed/${this.props.queueArr[0].linkUrl}`} />
        <button className="thumbsDownButton"><i className="far fa-thumbs-down" /></button>
        <button className="thumbsUpButton"><i className="far fa-thumbs-up" /></button>
      </div>
    );
  }
}

export default VideoContent;
