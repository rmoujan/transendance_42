import { useEffect, useRef, useState } from "react";
import MyBotGame from "../../../../game/src/botGame.ts";
import MyMultiplayerGame from "../../../../game/src/multiplayerGame.ts";
import { motion } from "framer-motion";
import { fadeIn } from "./variants";
import Arcan from "../../img/Arcane.png";
import axios from "axios";
import { socket , socketuser} from "../../socket";

if (socket == undefined){
    socketuser();
  }


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
    const [Avatar, setAvatar] = useState<boolean>();
    const fetchData = async () => {
        const { data } = await axios.get(
            "http://localhost:3000/auth/get-all-users",
            {
                withCredentials: true,
            }
        );
        setFriends(data);
    };

    const handleExitButton = () => {
        if (myMultiplayerGameInstance.current) {
            window.location.href = "http://localhost:5173/home";
        }
    };

    const handleBotGameClick = () => {
        if (myBotGameInstance.current) {
            myBotGameInstance.current.startBotGame();
        }
        setPlayer(false);
    };

    const handleMultiplayerGameClick = async () => {
        if (myMultiplayerGameInstance.current) {
            myMultiplayerGameInstance.current.startMultiplayerGame();

            const { data } = await axios.get(
                "http://localhost:3000/profile/avatar",
                {
                    withCredentials: true,
                }
            );
            setAvatar(data);
            console.log(data);
        }
    };

    useEffect(() => {
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
                className="flex-row justify-center items-center pt-[6rem] hidden"
            >
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
                        className="btn text-bluish-purple bg-reddish-orange block relative text-4xl border-none rounded-main font-zenkaku text-center font-medium tracking-normal my-2 mx-auto pt-1 px-7 pb-2 cursor-pointer"
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
                    <button
                        className="btn text-pale-blue bg-red-500 block relative text-4xl border-none rounded-main font-zenkaku text-center font-medium tracking-normal my-2 mx-auto pt-1 px-7 pb-2 cursor-pointer"
                        id="exit-btn"
                        onClick={handleExitButton}
                    >
                        Back Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GamePage;
