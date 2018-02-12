import React from 'react';

const SearchResult = ({ searchItem, addToPlaylist, roomId, userId }) => {
  const addObject = {
    video_id: searchItem.id.videoId,
    title: searchItem.snippet.title,
    thumbnail: searchItem.snippet.thumbnails.default.url,
    roomId,
    userId,
  };

  return (
    <td>
      <div className="videoResult">
        <div className="thumbnail-section">
          <img src={searchItem.snippet.thumbnails.default.url} id="thumbnail" />
        </div>
        <div className="video-title">
          {searchItem.snippet.title}
        </div>
      </div>
      <div className="resultButtons">
        <button onClick={() => addToPlaylist(addObject)}>Add</button>
        <button onClick={() => console.log('should preview')}>Preview</button>
      </div>
    </td>
  );
};

export default SearchResult;
