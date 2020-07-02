import { combineReducers } from "redux"
import { JOIN_ROOM } from "./actions"

const RoomsReducer = (rooms, action) => {
  switch (action.type) {
    case JOIN_ROOM:
      return rooms.map(r => (r.ID === action.roomID ? {...r, users: [...r.users, action.username]} : r))
  }
  return rooms
}

const RootReducer = combineReducers({
  rooms: RoomsReducer
})

export { RootReducer }
