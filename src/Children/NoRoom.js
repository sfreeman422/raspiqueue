import React from 'react';

const NoRoom = props => (
  <div className="no-room">
    <h1>Sorry, the room you are searching for was not found.</h1>
    <h2>Error: {props.error}</h2>
  </div>
);

export default NoRoom;
