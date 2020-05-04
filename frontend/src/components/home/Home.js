import React from 'react';
import Main from '../templates/Main';

import './Home.css';

const Home = () => {
  return (
    <Main icon='home' title='"Knowledge is Power"'>
      <h1>I.H. Students & Historians Group</h1>
      <hr />
      <p>
        This project is part of the International History Students & Historians Group. Our main goal is
        to protect the world of heritage and sharing/connecting between students and 
        professionals in the fields of History, Archaeology, Speleology and Anthropology.
        As protection of heritage concern, we will continue to ensure the protection of the entire historical and 
        cultural heritage of any part of the world. 
        This website gives the possibility for any person to report a monument vicinity that is damaged, 
        in bad condition or scheduled for destruction in real time!
      </p>
    </Main>
  )
}

export default Home;
