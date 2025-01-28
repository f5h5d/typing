const NodeCache = require("node-cache");
const axios = require("axios");
const rooms = new Map();
const privateRooms = new Map();

const roomsTextCache = new Map();
const privateRoomTextMap = new Map(); // will need to do constant searches for seeing if a roomID already exists so set is good as it is O(1) for searching

let lastCreatedPublicRoom = {}; // used for adding users to room, should fill this before moving on

const PREGAME_TIMER = 3;
const MAX_USERS_PER_GAME = 3;
const USER_JOIN_TIMER_LIMIT = 1;
const MAX_UPPER_LOWER_WPM_RANGE = 20;
const BOT_WPM_INTERVAL = 10
const BOT_NAME = "Bot"

const GAME_MODES = {
  SANDBOX: 0,
  MULTIPLAYER: 1,
  PRIVATE: 2,
};


const findWordFromCharacter = (index, text) => {
  const textArr = text.split(" ");
  let count = 0;
  for (let word of textArr) {
    count += word.length + 1; // plus one for space
    if (count > index) {
      return word
    }
  }
}

module.exports = (io) => {
  io.on("connection", (socket) => {
    // for initilizations
    socket.on("create_private_room", () => {
      let room;

      do {
        // constantly loop to generate a code that doesnt already exist in the set
        room = Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, "0");
      } while (privateRooms.has(room));

      privateRooms.set(room, {
        usersCompleted: [],
        usersData: {},
        preGameTimer: PREGAME_TIMER,
        id: room,
      });

      socket.emit("created_room", room);
    });

    socket.on("join_room", ([id, mode, userData]) => {
      let roomID = id; // for public set id to 0 by default which = false for the case  where new room is created
      let room;

      if (mode == GAME_MODES.PRIVATE) {
        // private room
        if (privateRooms.has(roomID)) {
          socket.emit("successfuly_joined_private_room", roomID);
          room = privateRooms.get(roomID);
        } else {
          socket.emit("room_doesnt_exist");
          return;
        }
      } else if (mode == GAME_MODES.MULTIPLAYER) {
        for (let [key, value] of rooms) {
          if (
            value.preGameTimer > USER_JOIN_TIMER_LIMIT && // make sure the time is not too low
            Math.abs(userData.averageWPM - value.roomAverageWPM) < MAX_UPPER_LOWER_WPM_RANGE && // make sure user is in the "skill" range for the lobby
            Object.keys(value.usersData).length < MAX_USERS_PER_GAME // number of players less than the max 
          ) {
            roomID = key;
          }
        }

        if (!roomID) {
          do {
            // constantly loop to generate a code that doesnt already exist in the set
            roomID = Math.floor(Math.random() * 1000000)
              .toString()
              .padStart(6, "0");
          } while (rooms.has(room));
        }

        socket.emit("get_room_id", roomID); // give roomID to user if in multiplayer mode

        if (!rooms.get(roomID)) {
          // room doesn't exist so must create room
          rooms.set(roomID, {
            usersCompleted: [],
            usersData: {},
            preGameTimer: PREGAME_TIMER,
            id: roomID,
            roomAverageWPM: 0,
          }); // usersCompleted stores id/username of users that have finished in order
          io.to(roomID).emit("pre_game_timer", rooms.get(roomID).preGameTimer); // tell all clients to set the pregame timer
          socket.emit("user_must_start_game", roomID); // ADD LATER
        }
        room = rooms.get(roomID); // set the room
        lastCreatedPublicRoom = rooms.get(roomID); // update the last created public room
      }

      socket.join(roomID);

      // console.log(io.sockets.adapter.rooms.get(roomID))
      console.log(io.sockets.adapter.rooms)
      // Add new player to the room

      room.usersData["" + socket.id] = { ...userData, id: socket.id }; // update the data in the backend
      room.roomAverageWPM = Math.round(
        (room.roomAverageWPM * (Object.keys(room.usersData).length - 1) +
          userData.averageWPM) /
          Object.keys(room.usersData).length
      );
      socket.to(roomID).emit("initialize_user_data_for_others", room.usersData); // give new user data of previous users

      socket.emit("initialize_user_id", socket.id); // give the client the socketID
      socket.emit("initialize_other_users_data", room.usersData);

      if (mode !== 2 && Object.keys(rooms.get(roomID).usersData).length == 1) {
        // this user is first user in public lobby they in the room => must start it
        socket.emit("tell_user_to_start_game", roomID);
      }

      socket.emit("pre_game_timer", room.preGameTimer); // give the user the current pre-game-timer
    });

    socket.on("start_game", (mode, roomID) => {
      let totalBots = 0;
      let room = (mode == GAME_MODES.MULTIPLAYER
        ? rooms.get(roomID)
        : privateRooms.get(roomID));
      io.to(roomID).emit("started_game");

      io.to(roomID).emit("pre_game_timer", room.preGameTimer); // tell all clients to set the pregame timer

      const preGameInterval = setInterval(() => {
        // decrement the pregame timer for 10 seconds when lobby created
        // generate text
        if (room.preGameTimer == USER_JOIN_TIMER_LIMIT) {
          axios.get("http://localhost:5000/words/1/10").then((response) => {
            // response.data.words = "This is a test"; // for testing purposes

            if (mode == 2) {
              // if private lobby
              privateRoomTextMap.set(roomID, response.data);
            } else {
              // is a public lobby
              roomsTextCache.set(roomID, response.data);
            }
            io.to(roomID).emit("initialize_typing_quote", response.data); // send everyone in the room teh typing quote
          });
        }

        room.preGameTimer -= 1;

        if (
          room.preGameTimer == USER_JOIN_TIMER_LIMIT &&
          Object.keys(room.usersData).length < MAX_USERS_PER_GAME
        ) {
          const numberOfBotsNeeded = mode == GAME_MODES.MULTIPLAYER ? MAX_USERS_PER_GAME - Object.keys(room.usersData).length : 0
          totalBots = numberOfBotsNeeded
          const wpmIntervals = [0, -10, 10]
          for (let i = 0; i < numberOfBotsNeeded; i++) {
            room.usersData["" + i] = {
              username: BOT_NAME,
              wpm: 0,
              currentWord: "",
              percentage: 0,
              id: i,
              averageWPM: room.roomAverageWPM + wpmIntervals[i]
            }
          }

          socket.emit("initialize_other_users_data", room.usersData);
        }

        if (room.preGameTimer == -1) {
          clearInterval(preGameInterval);

          if (mode == GAME_MODES.MULTIPLAYER) { // should not be bots in private lobby
            simulateBots()
          }
        }

        io.to(roomID).emit("pre_game_timer", room.preGameTimer); // decrement the pregame timer for the clients
      }, 1000);



      const simulateBots = () => { // doesnt work for guests yet
        let botsCompleted = 0;

        let elapsedTime = 0;
        const simulateBotsInterval = setInterval(() => {
          for (let id in room.usersData) {
            const user = room.usersData[id]
            if (user.username == BOT_NAME && user.percentage < 100) {

              charactersWritten = Math.round((user.averageWPM * 5 * elapsedTime) / 60)
              const text = roomsTextCache.get(roomID).words // CHANGE TO TEXT LATER (roomsTextCache.get(roomID).text)


              // check if bot is finished, if it is not then does regular things
              if (charactersWritten >= text.length) {
                room.usersCompleted.push(id);
                user.percentage = 100;
                botsCompleted += 1;

                if (botsCompleted >= totalBots) {
                  io.to(roomID).emit("update_users_data", room.usersData); 
                  clearInterval(simulateBotsInterval)
                }

              } else {


                const currentWord = findWordFromCharacter(charactersWritten, text)
                const percentage = (charactersWritten / text.length) * 100
  
                user.currentWord = currentWord;
                user.percentage = percentage
  
                user.wpm = Math.round((charactersWritten / 5) / (elapsedTime/60)); // change back later aka make it just equal to averageWPM this is just for testing
                

              }
            
            }
          }

          elapsedTime += 1;

          io.to(roomID).emit("update_users_data", room.usersData); // decrement the pregame timer for the clients
        }, 1000)


      }
    
    });

    // update the data for all other clients
    socket.on("update_users_scores", (mode, roomID, data) => {
      let room =
      mode == GAME_MODES.MULTIPLAYER
        ? rooms.get(roomID)
        : privateRooms.get(roomID);

      room.usersData["" + data.id] = data;
      socket.to(roomID).emit("update_users_data", room.usersData);
    });

    // when user finished test
    socket.on("user_finished_test", (mode, roomID, data) => {
      let room =
      mode == GAME_MODES.MULTIPLAYER
        ? rooms.get(roomID)
        : privateRooms.get(roomID);
        
      room.usersCompleted.push(socket.id);
      socket.emit("user_finished_position", room.usersCompleted.length);

      if (room.usersCompleted.length == Object.keys(room.usersData).length) {
        // means all users finished
        room.usersCompleted = [];
        if (mode == GAME_MODES.MULTIPLAYER) { // once all users are done then it deletes the room
          rooms.delete(roomID)
        }
      }

      if (mode == GAME_MODES.MULTIPLAYER ) {
        socket.leave(roomID)
      }
    });

    socket.on("back_to_lobby", (roomID) => {
      const room = privateRooms.get(roomID);
      room.preGameTimer = PREGAME_TIMER;
      room.usersCompleted = [];
      privateRoomTextMap.delete(roomID);

      Object.keys(room.usersData).map((user) => {
        room.usersData[user].wpm = 0;
        room.usersData[user].percentage = 0;
      });
      socket.to(roomID).emit("users_back_to_lobby");
    });

    socket.on("reset_game_values", (roomID) => {
      // const test = io.sockets.adapter.rooms;
      // console.log(test)

      // console.log(io.sockets.adapter.rooms.get(roomID))
      console.log(io.sockets.adapter.rooms)


      const room = privateRooms.get(roomID);
      room.preGameTimer = PREGAME_TIMER;
      room.usersCompleted = [];
      privateRoomTextMap.delete(roomID);

      Object.keys(room.usersData).map((user) => {
        room.usersData[user].wpm = 0;
        room.usersData[user].percentage = 0;
      });

      io.to(roomID).emit("start_new_private_game");
    });

    socket.on("pre_disconnect", ([mode, roomID]) => {
      console.log("pre disconnecting")
      if (mode === GAME_MODES.MULTIPLAYER) {
        const room = rooms.get(roomID);
        if (room === undefined) return;

        delete room.usersData[socket.id];
        socket
          .to(roomID)
          .emit("initialize_user_data_for_others", room.usersData);
        if (Object.keys(room.usersData).length == 0) {
          rooms.delete(roomID);
          roomsTextCache.delete(roomID);
        }
      } else if (mode === GAME_MODES.PRIVATE) {
        const room = privateRooms.get(roomID);

        if (room === undefined) return;
        delete room.usersData[socket.id];
        socket
          .to(roomID)
          .emit("initialize_user_data_for_others", room.usersData);
        if (Object.keys(room.usersData).length == 0) {
          privateRooms.delete(roomID);
          privateRoomTextMap.delete(roomID);
        }
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("disconnected");
    });

    io.on("disconnect", function () {
      console.log("Client disconnected.");
    });
  });
};
