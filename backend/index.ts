// Imported packages
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// Configuration
require("dotenv").config();

// Variables
const app = express();
const port: string | number = process.env.PORT || 2121;
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const infoRoutes = require("./routes/info.routes");
const projectRoutes = require("./routes/project.routes");
const githubRoutes = require("./routes/github.routes");
const apiVersion: number = 1.0;
const prefix: string = String("/api/v" + apiVersion.toFixed(1));

// Configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use(prefix + "/auth", authRoutes);
app.use(prefix + "/user", userRoutes);
app.use(prefix + "/info", infoRoutes);
app.use(prefix + "/project", projectRoutes);
app.use(prefix + "/github", githubRoutes);

// Server
const server = http.createServer(app);

// Socket io server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

namespace Socket {
  export interface Controller {
    id: any;
    join: (arg1: string | number) => void;
    on: (arg1: string, arg2: (param: any) => void) => void;
    emit: (arg1: string, arg2: (param: any) => void) => void;
    to: (arg1: string | number) => any;
    once: (arg1: string, arg2: (param: any) => void) => void;
    broadcast: any;
    username: string;
    room: string;
  }
}

let users = {} as Array<Object>[];

io.on("connection", (socket: Socket.Controller) => {
  console.log("User connected", socket.id);

  socket.on("join_room", (data) => {
    socket.join(data.room);
    socket.username = data.username;
    socket.room = data.room;
    users[data.room] = users[data.room] || [];
    users[data.room].filter(
      (e: any) => e.user == data.username && e.room == data.room,
    ).length > 0
      ? null
      : users[data.room].push({
          id: socket.id,
          room: data.room,
          user: data.username,
        });
    console.log("users", users);
    io.to(data.room).emit("user_joined", { users, user: data.username });
  });

  socket.on("send_message", (data) => {
    console.log(data);
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("typing", (data) => {
    socket.to(data.room).emit("typing", data);
    socket.on("stop_typing", (stopped_data) => {
      socket.to(data.room).emit("stop_typing", stopped_data);
    });
  });

  socket.on("create_file", (data) => {
    io.to(data.room).emit("create_file", data);
  });

  socket.on("code_edit", (data) => {
    socket.broadcast.to(data.room).emit("code_edit", data);
  });

  socket.once("disconnect", (data) => {
    for (const [room, roomUsers] of Object.entries(users)) {
      if (room === socket.room) {
        users[room as any] = roomUsers.filter(
          ({ user }: { [user: string]: any }) => user !== socket.username,
        );
        io.to(room).emit("user_disconnected", socket.username);
        break;
      }
    }
  });
});

server.listen(port, (error: any) => {
  if (error) {
    console.log("Error log:", error);
    throw new Error(error.message);
  }
  console.log("Server running on port " + port);
});
