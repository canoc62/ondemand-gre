import React, { Component } from 'react';



const Video = (props) => {
  return (

    <div style={ video }>
      <video id="example_video_1" className="video-js vjs-default-skin" controls preload="auto" width="100%" height="auto" data-setup='{"example_option":true}'>
      <source src="https://gre-on-demand.veritasprep.com/gre_1_5.mp4" type="video/mp4" />
      <p className="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>
      </video>
    </div>
  );
};

const video = {
  backgroundColor: '#FFF',
  width: '100%'
}

export default Video;