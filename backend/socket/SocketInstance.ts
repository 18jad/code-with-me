import { Socket } from "./socket";
const { Server } = require("socket.io");

class SocketInstance<T extends Socket.Controller> implements Socket.Instance {
  private readonly server: typeof Server;
  private socket: typeof Server;
  private readonly _CORS: object = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  };
  private static users = {} as Array<Object>[];
  private serverStatus = false;

  constructor(server: typeof Server) {
    this.server = server;
  }

  // Initialize socket.io server connection
  init() {
    return new Promise<void>((resolve, reject) => {
      try {
        this.socket = new Server(this.server, {
          cors: this._CORS,
        });
        this.serverStatus = this.socket !== null && this.socket !== undefined;
        if (this.serverStatus) {
          resolve(this.socket);
        } else {
          throw new Error("Error initializing socket server");
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  run() {
    if (this.serverStatus) {
      try {
        this.onConnection();
      } catch (error: any) {
        throw new Error(error);
      }
    } else {
      this.retryConnection();
    }
  }

  onConnection() {
    this.socket.on("connection", (socket: T) => {
      this.onJoin(socket);
      this.onSend(socket);
      this.onTyping(socket);
      this.onCreateFile(socket);
      this.onCodeEdit(socket);
      this.onDisconnect(socket);
    });
  }

  onJoin(socket: T) {
    socket.on("join_room", (data) => {
      socket.join(data.room);
      socket.username = data.username;
      socket.room = data.room;
      SocketInstance.users[data.room] = SocketInstance.users[data.room] || [];
      SocketInstance.users[data.room].filter(
        (e: any) => e.user == data.username && e.room == data.room,
      ).length > 0
        ? null
        : SocketInstance.users[data.room].push({
            id: socket.id,
            room: data.room,
            user: data.username,
          });

      this.socket.to(data.room).emit("user_joined", {
        users: SocketInstance.users,
        user: data.username,
      });
    });
  }

  onSend(socket: T) {
    socket.on("send_message", (data) => {
      this.socket.to(data.room).emit("receive_message", data);
    });
  }

  onTyping(socket: T) {
    socket.on("typing", (data) => {
      socket.broadcast.to(data.room).emit("typing", data);
      socket.on("stop_typing", (stopped_data) => {
        socket.to(data.room).emit("stop_typing", stopped_data);
      });
    });
  }

  onCreateFile(socket: T) {
    socket.on("create_file", (data) => {
      this.socket.to(data.room).emit("create_file", data);
    });
  }

  onCodeEdit(socket: T) {
    socket.on("code_edit", (data) => {
      socket.broadcast.to(data.room).emit("code_edit", data);
    });
  }

  onDisconnect(socket: T) {
    socket.once("disconnect", () => {
      console.log("user disconnected");
      for (const [room, roomUsers] of Object.entries(SocketInstance.users)) {
        if (room === socket.room) {
          SocketInstance.users[room as any] = roomUsers.filter(
            ({ user }: { [user: string]: any }) => user !== socket.username,
          );
          this.socket.to(room).emit("user_disconnected", socket.username);
          break;
        }
      }
    });
  }

  retryConnection() {
    if (!this.serverStatus) {
      this.init().then((io: typeof this.server) => {
        if (io) {
          this.run();
        }
      });
    }
  }
}

module.exports = SocketInstance;
