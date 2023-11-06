import io, { Socket } from "socket.io-client";
import { createContext } from "vm";
// import io from "socket.io-client"; // Add this

// let socket: any;

// const connectSocket = (user_id: string) => {
//   socket = io("http://localhost:3001", {
//     query: {
//         user_id: user_id,
//       },
//   });
// } // Add this -- our server will run on port 4000, so we connect to it from here

// export {socket, connectSocket};

// const socket : Socket = io("http://localhost:3000", {withCredentials: true});
// const context = createContext(socket);
