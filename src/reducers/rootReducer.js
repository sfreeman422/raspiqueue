const initialState = {
  roomName: '',
  roomId: '',
  roomErr: '',
  connectedUser: 1, // Placeholder! Will need to be determined once auth is included.
  loggedInState: false,
  queue: [],
  messages: [],
  history: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_ROOM_NAME':
      return {
        ...state,
        roomName: action.payload,
      };
    case 'UPDATE_QUEUE':
      return {
        ...state,
        queue: action.payload,
      };
    case 'UPDATE_HISTORY':
      return {
        ...state,
        history: action.payload,
      };
    case 'UPDATE_ROOM_ID':
      return {
        ...state,
        roomId: action.payload,
      };
    case 'SET_ROOM_ERROR':
      return {
        ...state,
        userLoc: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;
