const NodeCache = require('node-cache');
const axios = require('axios');
const rooms = new Map()
const privateRooms = new Map();

const roomsTextCache = new Map();
const privateRoomTextMap = new Map(); // will need to do constant searches for seeing if a roomID already exists so set is good as it is O(1) for searching

let lastCreatedPublicRoom = {} // used for adding users to room, should fill this before moving on

const PREGAME_TIMER = 3
const MAX_USERS_PER_GAME = 3

const GAME_MODES = {
  SANDBOX: 0,
  MULTIPLAYER: 1,
  PRIVATE: 2
}


module.exports = (io) => {
  io.on("connection", (socket) => {
    // for initilizations
    socket.on("create_private_room", () => {
      let room;
      do { // constantly loop to generate a code that doesnt already exist in the set
        room = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      } while (privateRooms.has(room))
  
      privateRooms.set(room, {usersCompleted: [], usersData: {}, preGameTimer: PREGAME_TIMER, id: room});
  
      socket.emit("created_room", room) 
  
    })
  
    socket.on("join_room", ([id, mode, userData]) => {
      console.log("JOINED_room")
      let roomID = id; // for public set id to 0 by default
      let room;
  
      if (mode == 2) {
        if (privateRooms.has(roomID)) {
          socket.emit("successfuly_joined_private_room", roomID)
          room = privateRooms.get(roomID)
        } else {
          socket.emit("room_doesnt_exist")
          return
        }
  
      } else if (mode == 1) { 
        const test = lastCreatedPublicRoom
        console.log(test)
        if ((rooms.size > 0 && (Object.keys(lastCreatedPublicRoom.usersData).length > MAX_USERS_PER_GAME || lastCreatedPublicRoom.preGameTimer < 1))) { // this means all rooms are at max capacity (4 is max)
          
          do { // constantly loop to generate a code that doesnt already exist in the set
            roomID = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
          } while (rooms.has(room))

        } else if (rooms.size > 0) {
          roomID = lastCreatedPublicRoom.id; // Use the last room
        }
        
  
  
        socket.emit("get_room_id", roomID) // give roomID to user if in multiplayer mode
        if (!rooms.get(roomID)) { // room doesn't exist so must create room
          rooms.set(roomID, {usersCompleted: [], usersData: {}, preGameTimer: PREGAME_TIMER, id: roomID}); // usersCompleted stores id/username of users that have finished in order
          io.to(roomID).emit("pre_game_timer", rooms.get(roomID).preGameTimer); // tell all clients to set the pregame timer
          socket.emit("user_must_start_game", roomID) // ADD LATER
        }
        room = rooms.get(roomID); // set the room
        lastCreatedPublicRoom = rooms.get(roomID)// update the last created public room
      }
  
  
    
      socket.join(roomID)
      // Add new player to the room
      room.usersData["" + socket.id] = {...userData, username: socket.id, id: socket.id }; // update the data in the backend
      socket.to(roomID).emit("initialize_user_data_for_others", room.usersData); // give new user data of previous users
    
      socket.emit("initialize_user_id", socket.id); // give the client the socketID
      socket.emit("initialize_other_users_data", room.usersData);
  
  
      if (mode !== 2 && Object.keys(rooms.get(roomID).usersData).length == 1) { // this user is first user in public lobby they in the room => must start it
        socket.emit("tell_user_to_start_game", roomID)
      }
  
  
      // if (room.preGameTimer < PREGAME_TIMER) {
      //   socket.emit("initialize_typing_quote", roomsTextCache.get(roomID))
      // }

      socket.emit("pre_game_timer", room.preGameTimer); // give the user the current pre-game-timer
    });
  
  
    socket.on("start_game", ([mode, roomID]) => {
      console.log(mode)
      let room = mode = GAME_MODES.MULTIPLAYER ? rooms.get(roomID) : privateRooms.get(roomID)
      socket.to(roomID).emit("started_game")
  
      io.to(roomID).emit("pre_game_timer", room.preGameTimer); // tell all clients to set the pregame timer
  
  
      const preGameInterval = setInterval(() => { // decrement the pregame timer for 10 seconds when lobby created
        // generate text 
        if (room.preGameTimer == PREGAME_TIMER) {
          axios.get("http://localhost:5000/words/1/10").then((response) => {
            if (mode == 2) { // if private lobby
              privateRoomTextMap.set(roomID, response.data)
            } else { // is a public lobby
              roomsTextCache.set(roomID, response.data)
            }
            io.to(roomID).emit("initialize_typing_quote", response.data) // send everyone in the room teh typing quote
          })
        };
  
        room.preGameTimer -= 1;
  
        if (room.preGameTimer == -1) clearInterval(preGameInterval)
  
        io.to(roomID).emit("pre_game_timer", room.preGameTimer); // decrement the pregame timer for the clients
      }, 1000)
  
    })
  
    socket.on("track_user", ([mode, roomID]) => {
      let room = mode == GAME_MODES.MULTIPLAYER ? rooms.get(roomID) : privateRooms.get(roomID)
  
  
       // update the data for all other clients
       socket.on("update_users_scores", (data) => {
        room.usersData["" + data.id] = data;
        socket.to(roomID).emit("update_users_data", room.usersData);
      });
  
  
      // when user finished test
      socket.on("user_finished_test", (data) => {
        room.usersCompleted.push(socket.id);
        socket.emit("user_finished_position", room.usersCompleted.length)
  
        if (room.usersCompleted.length == Object.keys(room.usersData).length) { // means all users finished
          room.usersCompleted = []
        }
      })
  
      socket.on("back_to_lobby", (roomID) => {
        const room = privateRooms.get(roomID)
        room.preGameTimer = PREGAME_TIMER;
        room.usersCompleted = [];
        privateRoomTextMap.delete(roomID)
  
  
        Object.keys(room.usersData).map((user) => {
          room.usersData[user].wpm = 0;
          room.usersData[user].percentage = 0;
        })
        socket.to(roomID).emit("users_back_to_lobby")
      })

      socket.on("reset_game_values", (roomID) => {
        const room = privateRooms.get(roomID)
        room.preGameTimer = PREGAME_TIMER;
        room.usersCompleted = [];
        privateRoomTextMap.delete(roomID)
  
  
        Object.keys(room.usersData).map((user) => {
          room.usersData[user].wpm = 0;
          room.usersData[user].percentage = 0;
        })

        socket.to(roomID).emit("start_new_private_game")
      })
    })


    socket.on("pre_disconnect", ([mode, roomID]) => { 
      if (mode === GAME_MODES.MULTIPLAYER) {
        const room = rooms.get(roomID);
        if (room === undefined) return;


        delete room.usersData[socket.id]
        socket.to(roomID).emit("initialize_user_data_for_others", room.usersData);
        if (Object.keys(room.usersData).length == 0) {
          rooms.delete(roomID)
          roomsTextCache.delete(roomID)
        }
      }

      else if (mode === GAME_MODES.PRIVATE) {
        console.log("HERE")
        const room = privateRooms.get(roomID)

        if (room === undefined) return;
        delete room.usersData[socket.id];
        socket.to(roomID).emit("initialize_user_data_for_others", room.usersData);
        if (Object.keys(room.usersData).length == 0) {
          privateRooms.delete(roomID)
          privateRoomTextMap.delete(roomID)
        }
      }
    })


    socket.on("disconnect", (reason) => {
      console.log("disconnected")
    })
  
    io.on("disconnect", function () {
      console.log("Client disconnected.");
    });
  });
  
}
