import React, { Component } from 'react';
import Menu from './../menu/menu.jsx';
import Video from './../video/reactVideo.jsx';

const Content = (props) => {
  return (
    <div style={ container }>
      <Menu user={ props.user } setCurrentVideo={ props.setCurrentVideo } videoData={ props.videoData } loadVideo={ props.loadVideo } expandLesson={ props.expandLesson } showMenu={ props.showMenu } />
      <Video user={ props.user } toggleMenu={ props.toggleMenu } currentVideo={ props.currentVideo } videoData={ props.videoData }/>
    </div>
  );
};

const container = {
  display: 'flex',
  flexDirection: 'row',
  flex: '2',
}

export default Content;