import { FC, useEffect, useRef } from "react";
import MyBotGame from "../../../../game/src/botGame.ts";
import MyMultiplayerGame from "../../../../game/src/multiplayerGame.ts";

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
    <div className="flex justify-center w-full text-white items-center text-6xl">
      {" "}
      <div>
        <canvas
          ref={myCanvas}
          className="bg-pale-blue absolute m-auto inset-0 rounded-main max-w-full max-h-full w-1088 h-644"
          id="canvas"
        ></canvas>
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
  );
}

export default GamePage;
