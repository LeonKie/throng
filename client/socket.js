let socket = io();

const id= location.hash

const initData = undefined;
socket.on('connectToRoom', () => {
    console.log("i want to join!")
    socket.emit("join-room", id);
});

socket.on("hello", () => {
    console.log("C: Hello");
});

socket.on("initData", data=>{
    console.log(data);
    initData= data
})

