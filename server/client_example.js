const connection = new RTCPeerConnection()
connection.onicecandidate = (event) => {
  console.log("got candidate", event.candidate)
}
