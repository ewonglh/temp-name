import { createFileRoute } from '@tanstack/react-router'



export const Route = createFileRoute('/vid')({
  component: App,
})


// Source - https://stackoverflow.com/a
// Posted by Rahul Ahire, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-17, License - CC BY-SA 4.0

import React, { Component } from 'react'
import video from '/vid.mp4'
import { Button } from '@mui/material';

function App(){

    return (
      <div className="App">
      <p>hello</p>
      <video width="750" height="500" controls autoPlay >
      <source src={video} type="video/mp4"/>
     </video>
     <Button href = "/lostwoods">
      go back
     </Button>
      </div>
    );   
}

export default App;
