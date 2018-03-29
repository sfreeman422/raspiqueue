import * as types from '../constants/action-types';

export const updateRoomName = roomName => ({
  type: types.UPDATE_ROOM_NAME,
  payload: roomName,
});

export const updateQueue = queueArr => ({
  type: types.UPDATE_QUEUE,
  payload: queueArr,
});

export const updateHistory = historyArr => ({
  type: types.UPDATE_HISTORY,
  payload: historyArr,
});

export const updateRoomId = roomId => ({
  type: types.UPDATE_ROOM_ID,
  payload: roomId,
});

export const setRoomErr = roomErr => ({
  type: types.SET_ROOM_ERROR,
  payload: roomErr,
});
