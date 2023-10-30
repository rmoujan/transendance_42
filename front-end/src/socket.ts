import io from "socket.io-client"; // Add this

let socket: any;

const connectSocket = (user_id: string) => {
    socket = io("http://localhost:3000", {
        query: {
            user_id: user_id,
        },
    });
} // Add this -- our server will run on port 4000, so we connect to it from here

export { socket, connectSocket };
