import React, { Component } from 'react';

class VideoContent extends Component {
  componentWillUpdate() {
    
  }
  render() {
    return (
      <div className="video-content">
        <iframe src={this.props.url} />
        <button className="thumbsDownButton"><i className="far fa-thumbs-down" /></button>
        <button className="thumbsUpButton"><i className="far fa-thumbs-up" /></button>
      </div>
    );
  }
}

export default VideoContent;
