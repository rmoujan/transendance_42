import { useEffect, useRef, useState } from "react";
import MyBotGame from "../../../../game/src/botGame.ts";
import MyMultiplayerGame from "../../../../game/src/multiplayerGame.ts";
import { motion } from "framer-motion";
import { fadeIn } from "./variants";
import Arcan from "../../img/Arcane.png";
import axios from "axios";
import { socket, socketuser } from "../../socket";

type User = {
  id_user: number;
  name: string;
  avatar: string;
  TwoFactor: boolean;
  secretKey: string | null;
  status_user: string;
};
function GamePage() {
  const myCanvas = useRef<HTMLCanvasElement>(null);
  const myBotGameInstance = useRef<MyBotGame | null>(null);
  const myMultiplayerGameInstance = useRef<MyMultiplayerGame | null>(null);
  const [Friends, setFriends] = useState<User[]>([]);
  const [UserLeft, setUserLeft] = useState<User[]>([]);
  const [UserRight, setUserRight] = useState<User[]>([]);
  const [player, setPlayer] = useState<boolean>();
  const fetchData = async () => {
    const { data } = await axios.get("http://localhost:3000/auth/get-all-users", {
      withCredentials: true,
    });
    setFriends(data);
  };

  const handleBotGameClick = () => {
    if (myBotGameInstance.current) {
      myBotGameInstance.current.startBotGame();
    }
    setPlayer(false);
  };
    
  const handleMultiplayerGameClick = () => {
    if (myMultiplayerGameInstance.current) {
      myMultiplayerGameInstance.current.startMultiplayerGame();
    }
    fetchData();
    console.log("myMultiplayerGameInstance.current?.userId");
    console.log(myMultiplayerGameInstance.current?.userId);
    console.log("NotFriends");
    console.log(Friends);
    if (myMultiplayerGameInstance.current?.right) {
      const userRight = Friends.filter((user) => user.id_user === myMultiplayerGameInstance.current?.userId);
        console.log("userRight");
        console.log(userRight);
        setUserRight(userRight);
    } else {
      const userLeft = Friends.filter((user) => user.id_user === myMultiplayerGameInstance.current?.userId);
        console.log("userLeft");
        console.log(userLeft);
        setUserLeft(userLeft);
    }
    setPlayer(true);
  };

  useEffect(() => {
    if (socket == undefined){
      socketuser();
    }
    fetchData();
    myBotGameInstance.current = new MyBotGame(myCanvas.current!);
    myMultiplayerGameInstance.current = new MyMultiplayerGame(
      myCanvas.current!
    );
  }, []);

  return (
    <div className="flex flex-col w-full justify-end items-center">
      <motion.div
        id="avatars"
        variants={fadeIn("down", 0.2)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.7 }}
        className="flex flex-row justify-center items-center pt-[6rem] hidden"
      >
        {/* {player ? (
          <>
            <img
              className=" rounded-full  border-2"
              src={UserLeft[0].avatar}
              alt=""
            />
            <span className=" text-5xl text-white mx-4 font-PalanquinDark ">
              {" "}VS{" "}
            </span>
            <img
              className=" rounded-full  border-2"
              src={UserRight[0].avatar}
              alt=""
            />
          </>
        ) : (
          <>
            <img
              className=" rounded-full  border-2"
              src={UserLeft[0].avatar}
              alt=""
            />
            <span className=" text-5xl text-white mx-4 font-PalanquinDark ">
              {" "}VS{" "}
            </span>
            <img className=" rounded-full  border-2" src={Arcan} alt="" />
          </>
        )} */}
        {/* <img className=" rounded-full  border-2" src={Arcan} alt="" />
        <span className=" text-5xl text-white mx-4 font-PalanquinDark ">
          {" "}VS{" "}
        </span>
        <img className=" rounded-full  border-2" src={Arcan} alt="" /> */}
      </motion.div>
      <div className="box-border relative inset-0 flex flex-col justify-center w-full h-full -mt-[10rem] mx-[1rem] text-white items-center text-6x">
        <canvas
          ref={myCanvas}
          className="bg-pale-blue absolute m-auto inset-0 rounded-main max-w-full max-h-full w-1088 h-644"
          id="canvas"
        ></canvas>
        <div className="">
          <p
            className="relative text-bluish-purple inset-0 text-2xl font-roboto font-normal px-4 text-center"
            id="message"
          ></p>
          <button
            className="btn text-bluish-purple bg-reddish-orange block relative text-4xl border-none rounded-main font-zenkaku text-center font-medium tracking-normal w-full my-2 mx-auto pt-1 px-7 pb-2 cursor-pointer"
            id="online-game"
            onClick={handleMultiplayerGameClick}
          >
            Play Online
          </button>
          <button
            className="btn text-pale-blue bg-bluish-purple block relative text-4xl border-none rounded-main font-zenkaku text-center font-medium tracking-normal w-full my-2 mx-auto pt-1 px-7 pb-2 cursor-pointer"
            id="bot-game"
            onClick={handleBotGameClick}
          >
            Play vs Bot
          </button>
        </div>
      </div>
    </div>
  );
}

export default GamePage;

{
  /* <div className="w-full items-center ">
<motion.div
  variants={fadeIn("down", 0.2)}
  initial="hidden"
  whileInView={"show"}
  viewport={{ once: false, amount: 0.7 }}
  className="flex flex-row justify-center items-center"
>
  <img className=" rounded-full  border-2" src={Arcan} alt="" />
  <span className=" text-5xl text-white mx-4"> VS </span>
  <img className=" rounded-full  border-2" src={Arcan} alt="" />
</motion.div>
<div className="box-border inset-0 flex flex-col justify-center  w-full m-[1rem] text-white items-center text-6x">
    <canvas
      ref={myCanvas}
      className="bg-pale-blue absolute m-auto inset-0 rounded-main max-w-full max-h-full w-1088 h-644"
      id="canvas"
    >
    </canvas>
    <div className="">
        <p
          className="relative text-bluish-purple inset-0 text-2xl font-roboto font-normal px-4 text-center"
          id="message"
        ></p>
        <button
          className="btn text-bluish-purple bg-reddish-orange block relative text-4xl border-none rounded-main font-zenkaku text-center font-medium tracking-normal w-full my-2 mx-auto pt-1 px-7 pb-2 cursor-pointer"
          id="online-game"
          onClick={handleMultiplayerGameClick}
        >
          Play Online
        </button>
        <button
          className="btn text-pale-blue bg-bluish-purple block relative text-4xl border-none rounded-main font-zenkaku text-center font-medium tracking-normal w-full my-2 mx-auto pt-1 px-7 pb-2 cursor-pointer"
          id="bot-game"
          onClick={handleBotGameClick}
        >
          Play vs Bot
        </button>
    </div>
</div>
</div> */
}
