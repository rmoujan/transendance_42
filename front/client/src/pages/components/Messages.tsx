import { useEffect } from "react";
import { useAppSelector } from "../../redux/store/store";
import { connectSocket, socket } from "../../socket";
import ChatGeneral from "../Chat/ChatGeneral";
import { fadeIn } from "./variants";
import { motion } from "framer-motion";


function Messages() {
  const { profile, converstation} = useAppSelector(state => state);

  useEffect(() => {
    if (!socket) {
       connectSocket(profile._id.toString());
    }
  }, [profile, socket, converstation]);

  return (
    <motion.div
    variants={fadeIn("down", 0.2)}
    initial="hidden"
    whileInView={"show"}
    viewport={{ once: false, amount: 0.7 }}
    className="flex flex-col w-full justify-end items-center"
    >
      <ChatGeneral />
    </motion.div>
  );
}

export default Messages;
