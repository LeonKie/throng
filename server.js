let express = require('express');
let app = express();
let http = require('http').Server(app);
let SocketIO = require('socket.io')
let io = SocketIO(http);

app.use(express.static(__dirname + '/client'));


let created_rooms= [
    {   
        "id": "1234",
        "player": [],
        "question" : ["What restaurant is the best?"],
        "answers": ["Indian","Mexican","German","Chinese","Italy"]
    }
];
app.get("/rooms", (req, res) => {
        res.sendFile(__dirname+"/client/swarm.html");
        // Verify the id and return the clientside code
     });


io.on('connection', function(socket) {
   
   
   //if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) roomno++;
   socket.on("create-room",(data)=>{

        const roomID=Math.random().toString(36).substring(2, 15);
        created_rooms.push({"id":roomID,
                            "player":[],
                            "question":data.question,
                            "answers":data.answers
                        });
        //socket.join(roomID);
        console.log(created_rooms)
        socket.emit("/rooms", roomID)
        //socket.emit("setKey",1)
        console.log("you are in room: ", roomID )
        //Send this event to everyone in the room.
        //io.sockets.in(roomID).emit('connectToRoom', "You are in room no. "+namespace);
        
   })


    socket.on("join-room", data => {
        const roomID = data.roomID;
        //const playerKey = data.playerKey;
        
        console.log(roomID)
        
        if (created_rooms.some(e => e.id==roomID)){
            
            myRoom=created_rooms.find(e => e.id==roomID)
            
            const myRoom_ind=created_rooms.findIndex(e => e.id==roomID)
            if (myRoom.player.length>0){
                console.log(myRoom.player)
                room_ids=myRoom.player.map(d=>{
                    return d.id
                })
                console.log(room_ids)
                myID=Math.max.apply(null,room_ids)+1;
            }else{
                myID=1;
            }

            created_rooms[myRoom_ind].player.push({
                "id": myID,
                "ang": Math.floor(Math.random()*360)
            });
            
            socket.join(roomID);
            let initD = created_rooms[myRoom_ind]
            initD.playerKey=myID;
            console.log("InitD:" ,initD);
            socket.emit("initData",initD);
            socket.on("initData_finished",()=>{
                const myRoom_ind =created_rooms.findIndex(e => e.id==roomID);
                io.sockets.in(roomID).emit('updatePositon',created_rooms[myRoom_ind].player);
                console.log("key send:",myID)
                console.log("Someone joint room: ", roomID)
                console.log("Created Roomes:\n ",created_rooms[myRoom_ind].player)
                console.log("join-done")
            })
            
            //console.log(created_rooms.some(e => e.id==id))
        }else{
            console.log("room does not exist!");
            socket.emit("initData",undefined);

        }
    });

    socket.emit("connectToRoom");

    socket.on("requestKey",key=>{
        console.log("Key requested")
        //socket.emit("setKey",myID)

    })

    socket.on("updateAng",data=>{
        //console.log(data)
        //const {roomID,playerKey, ang } = data;
        const roomID= data.roomID;
        const playerKey= data.playerKey;
        if (typeof(playerKey)!="undefined"){
                const angle = data.angle;
                const roomIndex=created_rooms.findIndex(e=>e.id==roomID);
                const playerIndex=created_rooms[roomIndex].player.findIndex(e=>e.id==playerKey);
                //console.log(created_rooms[roomIndex].player, "id: ", playerIndex)
                if (playerIndex!=-1){
                created_rooms[roomIndex].player[playerIndex]["ang"]=angle;
                //console.log(created_rooms[roomIndex]);
                
                //emit
                if (io.sockets.adapter.rooms[roomID].length>0){
                    //console.log("position emmited",created_rooms[roomIndex].player)
                    io.sockets.in(roomID).emit('updatePositon',created_rooms[roomIndex].player);
                }
            }
        }
        
    })

    socket.on("start",roomID=>{
        io.sockets.in(roomID).emit('start');
    })
    /*function emitPPositon(){
        created_rooms.forEach(e => {
            const roomID = e.id;
            console.log("Emit to everyone in room", io.sockets.adapter.rooms[roomID])
            if (io.sockets.adapter.rooms[roomID].length>0){
                console.log("position emmited",e.player)
                io.sockets.in(roomID).emit('updatePositon',e.player);
            }

    })

   }*/
   //setInterval(emitPPositon,1000)
  
})

http.listen(3000, "192.168.2.149", function() {
   console.log('listening on localhost:3000 \n and 192.168.2.149:3000');
});