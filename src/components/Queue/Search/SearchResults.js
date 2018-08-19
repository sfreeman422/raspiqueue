import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SearchResult from './SearchResult';

const mapStateToProps = state => ({
  user: state.user,
  roomId: state.roomId,
});

const ConnectedSearchResults = ({
  user, roomId, addToPlaylist, searchResults,
}) => (
  <React.Fragment>
    {searchResults ? searchResults
          .map((searchItem, index) => (
            <tr key={`search-result-item-${index}`}>
              <SearchResult
                searchItem={searchItem}
                addToPlaylist={addToPlaylist}
                userId={user.userId}
                roomId={roomId}
              />
            </tr>)) : <tr><td>You haven't search anything yet!</td></tr>}
  </React.Fragment>
);

ConnectedSearchResults.propTypes = {
  searchResults: PropTypes.arrayOf(PropTypes.object).isRequired,
  addToPlaylist: PropTypes.func.isRequired,
};

const SearchResults = connect(mapStateToProps)(ConnectedSearchResults);

export default SearchResults;
