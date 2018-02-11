import React from 'react';

const SearchResult = ({ index, searchItem, addToPlaylist }) => (
  <tr key={`search-result-item-${index}`}>
    <td>
      {searchItem.snippet.title}<br />
      <button onClick={() => addToPlaylist(searchItem.snippet.title)}>Add</button>
      <button onClick={() => console.log('should preview')}>Preview</button>
    </td>
  </tr>
);

export default SearchResult;
