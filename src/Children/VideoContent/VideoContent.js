import React, { Component } from 'react';

let player;

class VideoContent extends Component {
  constructor(props) {
    super(props);
    this.onYouTubeIframeApiReady = this.onYouTubeIframeApiReady.bind(this);
    this.onPlayerReady = this.onPlayerReady.bind(this);
    this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.queueArr[0].linkUrl !== 'youtube.com') {
      this.onYouTubeIframeApiReady();
    }
  }
  onYouTubeIframeApiReady() {
    player = new window.YT.Player('ytplayer', {
      height: '80%',
      width: '100%',
      videoId: this.props.queueArr[0].linkUrl,
      events: {
        onReady: this.onPlayerReady,
        onStateChange: this.onPlayerStateChange,
      },
    });
  }
  onPlayerReady(event) {
    console.log(event);
    event.target.playVideo();
  }
  onPlayerStateChange(event) {
    console.log('state change');
    console.log(event);
  }
  render() {
    console.log(this.props.queueArr[0].linkUrl)
    return (
      <div className="video-content">
        <div id="ytplayer" />
        {/* <iframe title="video" src={`https://www.youtube.com/embed/${this.props.queueArr[0].linkUrl}?enablejsapi=1&autoplay=1&controls=0`} /> */}
        <button className="thumbsDownButton"><i className="far fa-thumbs-down" /></button>
        <button className="thumbsUpButton"><i className="far fa-thumbs-up" /></button>
      </div>
    );
  }
}

export default VideoContent;
