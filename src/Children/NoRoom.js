import React from 'react';
import PropTypes from 'prop-types';

// Renders a component to let the user know that a room was not found and why.
const NoRoom = props => (
  <div className="no-room">
    <h1>Sorry, the room you are searching for was not found.</h1>
    <h2>Error: {props.error}</h2>
  </div>
);

export default NoRoom;

NoRoom.propTypes = {
  error: PropTypes.shape({
    status: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
};

