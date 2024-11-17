const express = require("express");
const userRoutes = require("./routes/words");
const app = express();
const cors = require("cors"); // for giving frontend permission
const { client } = require("./config/database");
const http = require("http");
const { Server } = require("socket.io");
const setUpSocket = require("./socket/socket")
const server = http.createServer(app);



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
// Setup Socket.IO with the logic from ./socket/socket.js
setUpSocket(io)

// allow front end to use server
app.use(cors(corsOptions));

// Routes
app.use("/words", userRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});


client.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});
