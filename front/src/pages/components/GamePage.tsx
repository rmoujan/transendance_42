import { FC, useEffect, useRef } from "react";
import MyBotGame from "../../../../ping_pong_game/src/botGame.ts";
import MyMultiplayerGame from "../../../../ping_pong_game/src/multiplayerGame.ts";
import { motion } from "framer-motion";
import { fadeIn } from "./variants";
import Arcan from "../../img/Arcane.png";
function GamePage() {
  const myCanvas = useRef<HTMLCanvasElement>(null);
  const myBotGameInstance = useRef<MyBotGame | null>(null);
  const myMultiplayerGameInstance = useRef<MyMultiplayerGame | null>(null);

  const handleBotGameClick = () => {
    if (myBotGameInstance.current) {
      myBotGameInstance.current.startBotGame();
    }
  };

  const handleMultiplayerGameClick = () => {
    if (myMultiplayerGameInstance.current) {
      myMultiplayerGameInstance.current.startMultiplayerGame();
    }
  };

  useEffect(() => {
    myBotGameInstance.current = new MyBotGame(myCanvas.current!);
    myMultiplayerGameInstance.current = new MyMultiplayerGame(
      myCanvas.current!
    );
  }, []);
  return (
    <div className="mx-auto container grid grid-cols-5">
      {/* Scoreboard */}
      <header className="col-span-5 pt-5 text-center  mt-20">
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
      </header>

      <main className="col-span-5  h-96 p-10 ">
        <h1 className="text-center text-2xl">Main Content</h1>
        <canvas
          ref={myCanvas}
          className="bg-pale-blue absolute m-auto inset-0 rounded-main max-w-full max-h-full w-1088 h-644"
          id="canvas"
        ></canvas>
         <p
          className="relative text-bluish-purple inset-0 text-2xl font-roboto font-light px-4 text-center"
          id="message"
        ></p>
        <div className=" flex flex-col justify-center items-center">
                <button
          className="btn text-bluish-purple bg-reddish-orange block relative text-4xl lborder-none rounded-main font-zenkaku text-center font-medium tracking-normal  my-2 mx-auto pt-1 px-7 pb-2 cursor-pointer"
          id="online-game"
          onClick={handleMultiplayerGameClick}
        >
          Play Online
        </button>
        <button
          className="btn text-pale-blue bg-bluish-purple block relative text-4xl border-none rounded-main font-zenkaku text-center font-medium tracking-normal my-2 mx-auto pt-1 px-7 pb-2 cursor-pointer"
          id="bot-game"
          onClick={handleBotGameClick}
        >
          Play vs Bot
        </button>
        {/* <button
          className="hidden text-white bg-exit-red relative text-4xl border-none rounded-main font-zenkaku text-center font-medium tracking-normal my-2 mx-auto pt-1 px-7 pb-2 cursor-pointer"
          id="exit-btn"
        >
          Back Home
        </button> */}
        </div>
      </main>
    </div>
  );
}

export default GamePage;
