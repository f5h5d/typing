const express = require("express");
const userRoutes = require("./routes/words");
const app = express();
const cors = require("cors"); // for giving frontend permission
const { client } = require("./config/database");
const http = require("http");
const { Server } = require("socket.io");
const NodeCache = require('node-cache');
const axios = require('axios');

const server = http.createServer(app);

const rooms = [];
const privateRooms = new Map();

const roomsTextCache = new NodeCache({ stdTTL: 300});
const privateRoomTextMap = new Map(); // will need to do constant searches for seeing if a roomID already exists so set is good as it is O(1) for searching

// options for which origin is allowed to do what
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend URL
  credentials: true,
  methods: "GET,POST,PUT,DELETE", // Specify allowed methods
  optionsSuccessStatus: 200, // Some browsers (e.g., IE11) choke on 204
};

// for socket.io
const io = new Server(server, {
  // give the server and then cors function inside
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET,POST,PUT,DELETE"],
  },
});

io.on("connection", (socket) => {
  // for initilizations
  socket.on("create_private_room", () => {
    let room;
    do { // constantly loop to generate a code that doesnt already exist in the set
      room = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    } while (privateRooms.has(room))

    privateRooms.set(room, {usersCompleted: [], usersData: {}, preGameTimer: 3});

    socket.emit("created_room", room) 

    // // make user that created the room join it
    // socket.join(room)
  })


  socket.on("join_private_room", (roomID) => {
    if (!privateRooms.has(roomID)) { // if user entered room doesnt exist\
      socket.emit("room_doesnt_exist")
      return
    } else {
      socket.emit("successfuly_joined_private_room", roomID)
    }

    socket.join(roomID)
  

    // Add new player to the room
    socket.on("set_user_data", (data) => {
      room.usersData["" + socket.id] = {...data, username: socket.id, id: socket.id }; // update the data in the backend
      socket.to(roomID).emit("initialize_user_data_for_others", room.usersData); // give new user data of previous users
    });
    
    const room = privateRooms.get(roomID)

    socket.emit("initialize_user_id", socket.id); // give the client the socketID
    socket.emit("initialize_other_users_data", room.usersData);
    // if (privateRoomTextMap.has(roomID)) socket.emit("initialize_typing_quote", privateRoomTextMap.get(roomID)) // get typing text

  })


  socket.on("start_game", (roomID) => {
    socket.to(roomID).emit("started_game")
    const room = privateRooms.get(roomID)

    // check if current user is owner of room, only owner should start clock
    if (true) {
      // console.log("last room player numbers: " + room)
      io.to(roomID).emit("pre_game_timer", room.preGameTimer); // tell all clients to set the pregame timer
      io.emit("pre_game_timer", room.preGameTimer)
      const preGameInterval = setInterval(() => { // decrement the pregame timer for 10 seconds when lobby created

        console.log(room.preGameTimer)
        // generate text 
        if (room.preGameTimer == 3) {

          axios.get("http://localhost:5000/words/1/10").then((response) => {
            privateRoomTextMap.set(roomID, response.data)
            io.to(roomID).emit("initialize_typing_quote", response.data)
          })
        };


        room.preGameTimer -= 1;
        if (room.preGameTimer == -1) {
            clearInterval(preGameInterval)
            io.to(roomID).emit("pre_game_timer", room.preGameTimer); // decrement the pregame timer for the clients
        } else {
          io.to(roomID).emit("pre_game_timer", room.preGameTimer); // decrement the pregame timer for the clients
        }
      }, 1000)

    }

  })


  socket.on("track_user", (roomID) => {
    const room = privateRooms.get(roomID)
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
      room.preGameTimer = 3;
      room.usersCompleted = [];
      privateRoomTextMap.delete(roomID)


      Object.keys(room.usersData).map((user) => {
        room.usersData[user].wpm = 0;
        room.usersData[user].percentage = 0;
      })
      socket.to(roomID).emit("users_back_to_lobby")
    })
  })


  socket.on("join_room", () => {
    let room;
    if (rooms.length == 0) { // no curent rooms
      room = 0
    } else if (Object.keys(rooms[rooms.length-1].usersData).length > 3  || rooms[rooms.length-1].preGameTimer < 1) { // this means all rooms are at max capacity (4 is max)
      room = rooms.length;
    } else {
      room = rooms.length -1
    }

    socket.join(room)

    // Initialize room if it doesn't exist
    if (!rooms[room]) {
      rooms[room] = {usersCompleted: [], usersData: {}, preGameTimer: 3}; // usersCompleted stores id/username of users that have finished in order
      io.to(room).emit("pre_game_timer", rooms[room].preGameTimer); // tell all clients to set the pregame timer

      const preGameInterval = setInterval(() => { // decrement the pregame timer for 10 seconds when lobby created
        // generate text 
        if (rooms[room].preGameTimer == 3) {

          axios.get("http://localhost:5000/words/1/10").then((response) => {
            roomsTextCache.set(room, response.data)
            io.to(room).emit("initialize_typing_quote", response.data)
          })
        };


        rooms[room].preGameTimer -= 1;
        if (rooms[room].preGameTimer == -1) {
            clearInterval(preGameInterval)
            io.to(room).emit("pre_game_timer", rooms[room].preGameTimer); // decrement the pregame timer for the clients
        } else {
          io.to(room).emit("pre_game_timer", rooms[room].preGameTimer); // decrement the pregame timer for the clients
        }
      }, 1000)

    } else {
      socket.emit("pre_game_timer", rooms[room].preGameTimer); // if room is created, still give the current timer for the user
      socket.emit("initialize_typing_quote", roomsTextCache.get(room))
    }
    socket.emit("initialize_user_id", socket.id); // give the client the socketID
    socket.emit("initialize_other_users_data", rooms[room].usersData);
    if (roomsTextCache.has(room)) socket.emit("initialize_typing_quote", roomsTextCache.get(room)) // get typing text


    // Add new player to the room
    socket.on("set_user_data", (data) => {
      rooms[room].usersData["" + socket.id] = {...data, username: socket.id, id: socket.id }; // update the data in the backend
      socket.to(room).emit("initialize_user_data_for_others", rooms[room].usersData); // give new user data of previous users
    });

     // update the data for all other clients
    socket.on("update_users_scores", (data) => {
      rooms[room].usersData["" + data.id] = data;
      socket.to(room).emit("update_users_data", rooms[room].usersData);
    });

    // when user finished test
    socket.on("user_finished_test", (data) => {
      rooms[room].usersCompleted.push(socket.id);
      socket.emit("user_finished_position", rooms[room].usersCompleted.length)
    })

  })

  io.on("disconnect", function () {
    console.log("Client disconnected.");
  });
});

client.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

// allow front end to use server
app.use(cors(corsOptions));

// Routes
app.use("/words", userRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
