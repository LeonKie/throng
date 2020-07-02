import express from "express"
import { store } from "./store"
import { joinRoomAction } from "./actions"

const app = express()

app.post("/join", (req, res) => {
  const { name, roomID } = JSON.parse(req.body)
  store.dispatch(joinRoomAction(name, roomID))

  return res.send("OK")
})
