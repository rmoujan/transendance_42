import { io, Socket } from "socket.io-client";

let socket: any;

const connectSocket = (user_id: string) => {
  socket = io("http://localhost:3000/chat", {
    query: {
        user_id: user_id,
      },
  });
} // Add this -- our server will run on port 4000, so we connect to it from here


let socket_user: Socket;

const socketuser = () => {
  socket_user = io("http://localhost:3000/users", {
    transports: ["websocket"],
    withCredentials: true,
  });
};
export { socketuser, socket_user, socket, connectSocket};
// const context = createContext(socket);
