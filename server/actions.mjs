const JOIN_ROOM = "JOIN_ROOM"

const joinRoomAction = (username, roomID) => ({
  type: JOIN_ROOM,
  payload: {
    roomID,
    username
  }
})

export { joinRoomAction, JOIN_ROOM }
