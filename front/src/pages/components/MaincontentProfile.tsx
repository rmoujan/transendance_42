import React, { useState ,useEffect} from "react";
import TopStreamer from "./TopStreamer";
import logo from "../../img/logo.png";
import AccountOwner from "./AccountOwner";
import Achievements from "./Achievements";
import { motion } from "framer-motion";
import { fadeIn } from "./variants";
import bages from "../../img/bdg.png";
import ProfileCardUser from "./ProfileCardUser";
import axios from "axios";
import AboutMe from "./AboutMe";
import {socket, socketuser} from "../../socket";
import bot from "../../img/bot.png";
// import '../../../';
type User = {
  id_user: number;
  name: string;
  avatar: string;
  TwoFactor: boolean;
  secretKey: string | null;
  About:string;
  status_user: string;
  wins:number;
  losses:number;
  games_played:number;
  Progress:number;
  Wins_percent:number;
  Losses_percent:number;
};
type GameHistory = {
  winner: boolean;
  useravatar:string;
  userscore:number;
  enemyscore:number;
  enemyavatar:string;
  username:string;
  enemyname:string;
  enemyId:number;
};
function MaincontentProfile() {
  const [toggle, setToggle] = useState(false);
  const [user, setUser] = useState<User[]>([]);
  const [GameHistory, setGameHistory] = useState<GameHistory[]>([]);
  useEffect(() => {
    if (socket == undefined){
      socketuser();
    }
    const fetchData = async () => {
      console.log("asfjgaslkfklasfklasdklfklashfgafklsj");
      const { data } = await axios.get("http://localhost:3000/auth/get-user", {
        withCredentials: true,
      });
      if (data == null) {

        window.location.href = "/login";
      }
      const History = await axios.get("http://localhost:3000/profile/History", {
        withCredentials: true,
      });
      console.log("History");
      console.log(History.data);
      setGameHistory(History.data);
      setUser(data);
    };
    fetchData();
  }, []);
  const style = { "--value": 70 } as React.CSSProperties;
  return (
    <main className=" overflow-scroll resultUserContainer flex flex-col w-full  overflow-y-auto mb-14">
      {/* <div className=" flex justify-around items-center mt-10 my-5">
        <div className=" "></div> */}
      {/* <div className=" text-white text-4xl font-PalanquinDark">Profile</div> */}

      {/* <motion.div
          variants={fadeIn("right", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.7 }}
          className="left-[380px] absolute text-white text-4xl font-PalanquinDark leading-[67.50px]"
        >
          Profile
        </motion.div> */}
      {/* <motion.div
          variants={fadeIn("right", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.7 }}
          className="left-[1110px] absolute text-white text-4xl font-PalanquinDark leading-[67.50px]"
        >
          Achievements
        </motion.div> */}
      {/* <div className=" text-white text-4xl font-PalanquinDark">Achievements</div> */}
      {/* </div> */}
      <div className="flex w-full mx-auto pr-5 lg:px-6 py-8 ">
        <div className="flex flex-col w-full h-full text-gray-900 text-xl ">
          <motion.div
            variants={fadeIn("down", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.7 }}
            className="flex md:flex-row flex-col w-full justify-center h-full text-gray-900 text-xl "
          >
            <AccountOwner user={user} />
            {/* <div className="flex w-full max-w-lg h-72 p-12 rounded-[46px] mx-auto bg-gradient-to-tr from-[#3F3B5B] via-[#2A2742] to-[#302c4bc7] shadow-2xl">
              <div className="flex flex-col text-white">
                <div className="flex flex-row">
                  <Achievements />
                </div>
              </div>
            </div> */}
          </motion.div>
          <div className="flex flex-col items-center  w-full ">
          <motion.div 
          variants={fadeIn("left", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.7 }}
          className="w-full flex flex-col items-center justify-center mt-2 mb-10 space-y-10 lg:flex-row lg:space-x-8 lg:justify-center">
            <div className="bg-[#3f3b5b91] rounded-3xl flex flex-col items-center lg:w-3/4 lg-laptop:w-3/5">
              <div className=" text-white text-center mt-5 mobile:text-xl tablet:text-3xl font-bold px-11 tablet:px-52">
                Progress
              </div>
              <div className="  w-full px-4  mt-5">
                <div className=" flex justify-center items-center mb-8 w-full">
                  <div className="bg-light relative flex h-9 w-full  max-w-7xl  rounded-2xl bg-slate-300">
                      {user.map((item) => (
                        <div
                        key={item.id_user}
                         className="bg-[#ce502ad3] absolute top-0 left-0 flex font-PalanquinDark h-full items-center justify-center rounded-2xl text-lg font-semibold text-white" style={{ width: `${item.Progress}%` }}>
                        <p >{item.Progress}%</p>
                    </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="bg-[#3f3b5b91] rounded-3xl flex flex-col items-center lg:mx-10">
              <p className="text-3xl font-bold text-white mt-5">Badges</p>
              <div className="grid justify-items-end grid-cols-2 md:grid-cols-3 gap-1 space-x-10 m-5 justify-center ">
                <img className="w-24 flex" src={bages} alt="" />
                <img className="w-24 flex" src={bages} alt="" />
                <img className="w-24 flex" src={bages} alt="" />
                <img className="w-24 flex" src={bages} alt="" />
                <img className="w-24 flex" src={bages} alt="" />
                <img className="w-24 flex justify-center items-center mb-5" src={bages} alt="" />
              </div>
            </div> */}
          </motion.div>
            <div className="flex lg-laptop:flex-row flex-col space-y-2 justify-center lg:space-x-10 lg:space-y-0 mobile:items-center">
              <motion.div
                variants={fadeIn("right", 0.2)}
                initial="hidden"
                whileInView={"show"}
                viewport={{ once: false, amount: 0.7 }}
                className="flex-1 p-4 tablet:min-w-[60vh] max-w-[20px] lg-laptop:px-2 bg-[#3f3b5b91] rounded-3xl mobile:h-3/4  lg-laptop:mt-9 lg-laptop:min-w-[60%] lg-laptop:h-full tablet:w-2/5 lg-laptop:w-1/5 laptop:mb-10 shadow-2xl justify-center mobile:items-center"
              >
                {/* <div className="flex-1 justify-center items-center p-4 ml-4 laptop:ml-20"> */}
                  <div className="flex justify-center items-center text-white  text-2xl  laptop:text-4xl font-PalanquinDark">
                    About Me
                  </div>
                  {/* <div className="flex w-full max-w-2xl h-72 px-4 md:px-12 rounded-[46px]  mx-auto"> */}
                    <div className=" text-white  flex justify-center px-3 max-w-[400px] bg-black/20 rounded-2xl shadow-2xl mt-8 font-Bad_Script mx-2 text-2xl text-center p-4 overflow-hidden">
                   
                    {/* //if about me display this space */}
                    {
                      user.map((item) => (
                       <p className="whitespace-pre-line"
                       key={item.id_user}
                       >
                        {/* //if no about me display this message  */}
                        {item.About === null ? "You don't have any About Me yet !" : item.About}
                       {/* {item.About} */}
                       </p>
                      ))
                    }
                    {/* Create a Container Element: First, you need to create a container element  */}
                      {/* <div className="flex flex-row -ml-20 -mr-11 mt-5 ">
                          <Achievements />
                        </div> */}
                    </div>
                  {/* </div> */}
                {/* </div> */}
              </motion.div>

              <motion.div
                variants={fadeIn("right", 0.2)}
                initial="hidden"
                whileInView={"show"}
                viewport={{ once: false, amount: 0.7 }}
                className="flex flex-col overflow-scroll resultContainer h-[25rem] max-h-[25rem] p-4 rounded-3xl tablet:min-w-[60vh] tablet:w-4/5 tablet:mt-10 tablet:mb-10 lg-laptop:w-[17rem] bg-[#3f3b5b91] laptop:mb-20  shadow-2xl mx-2 lg-laptop:min-w-[80%]  md:mx-10 "
                // className=" flex flex-col overflow-scroll resultContainer mx-h-[10rem] flex-1 p-4  rounded-3xl tablet:min-w-[60vh] tablet:w-4/5 tablet:mt-10 tablet:mb-10 lg-laptop:w-1/2 bg-[#3f3b5b91] laptop:mb-20  shadow-2xl mx-2 lg-laptop:min-w-[80%]  md:mx-10 justify-center "
              >
                <div className="text-white flex text-center justify-center font-PalanquinDark text-2xl  tablet:text-4xl mb-5">
                  Game History
                </div>
                <div className="my-1 flex flex-col max-w-[20]  mx-h-[50rem]  ">
                  {/* //if no game history display this space */}
                  {GameHistory.length === 0 && (
                    <div className="flex justify-center items-center mt-4">
                      <p className="mt-20 text-center text-gray-300 text-2xl opacity-50">
                        You don't have any game history yet !
                      </p>
                    </div>
                  )}
                  {/* //if game history display this space */}
                  {GameHistory.map((item) => (
                    <div
                      key={item}
                      className=" bg-black/20 rounded-2xl shadow-2xl flex justify-center items-center p-4 w-[30rem] -mr-10 my-3"
                    >
                      {
                        item.winner ? (
                          <span className=" px-3 font-bold text-emerald-400 ml-2 ">Win</span>
                        ) : (
                          <span className=" font-bold text-red-400  px-3  ml-2">Loss</span>
                        )
                      }
                      <span className=" text-white font-bold px-3">{item.username}</span>
                      <img src={item.useravatar} alt="" className="rounded-full w-12 h-12 mr-5 border-2" />
                      <span className=" text-white text-2xl font-bold">{item.userscore}</span>
                      <span className=" text-white font-bold">:</span>
                      <span className=" text-white text-2xl font-bold">{item.enemyscore}</span>
                      
                       {
                        (item.enemyId === 9) ? (
                          <>
                            <img src={bot} alt="" className="rounded-full w-12 h-12 ml-5 -mt-1 border-2" />
                            <span className=" text-white px-3 font-bold">Bot</span>
                          </>
                        ) : (
                          <>
                            <img src={item.enemyavatar} alt="" className="rounded-full w-12 h-12 ml-5 border-2" />
                            <span className=" text-white px-3 font-bold">{item.enemyname}</span>
                          </>
                        )
                      }
                      {/* <img src={item.enemyavatar} alt="" className="rounded-full w-10 h-10 ml-5" />
                      <span className=" text-white">{item.enemyname}</span> */}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={fadeIn("right", 0.2)}
                initial="hidden"
                whileInView={"show"}
                viewport={{ once: false, amount: 0.7 }}
                className="flex-1 overflow-scroll resultContainer p-4 bg-[#3f3b5b91] h-[25rem] rounded-3xl tablet:min-w-[60vh]  tablet:w-4/5 lg-laptop:w-1/2 shadow-2xl mx-2 md:mx-10 md:mb-9 laptop:mt-20 lg-laptop:mt-0 lg:mb-0 justify-center items-center lg-laptop:min-w-[80%]"
              >
                  <div className=" text-white flex justify-center items-center  text-2xl  tablet:text-4xl font-PalanquinDark">
                    Achievements
                  </div>
                {/* <div className="flex-1 p-4 ml-4 md:ml-20">
                  <div className="flex w-full max-w-2xl h-72 px-4 md:px-12 rounded-[46px]  mx-auto"> */}
                    {/* <div className="flex flex-col text-white "> */}
                      <div className="my-1 flex flex-col max-w-[30rem] mx-auto text-white">
                        <Achievements />
                      </div>
                    {/* </div> */}
                  {/* </div>
                </div> */}
              </motion.div>
              {/* </div> */}
            </div>

            {/* <motion.div
              variants={fadeIn("right", 0.2)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.7 }}
              className="left-[1110px] absolute text-white text-4xl font-PalanquinDark leading-[67.50px]"
            >
              Achievements
              <div className="flex w-full max-w-lg h-72 p-12 rounded-[46px] mx-auto bg-gradient-to-tr from-[#3F3B5B] via-[#2A2742] to-[#302c4bc7] shadow-2xl">
                <div className="flex flex-col text-white">
                  <div className="flex flex-row">
                    <Achievements />
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              variants={fadeIn("right", 0.2)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.7 }}
              className="text-white flex flex-col font-PalanquinDark text-4xl my-5"
            >
              Game History
            </motion.div>
            <motion.div
              variants={fadeIn("up", 0.2)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.7 }}
              className="flex flex-col w-full  h-60 items-center justify-center  my-4"
            >
              <div className="flex w-full my-3 mx-auto px-6 py-8 rounded-[20px] bg-black/30 shadow-2xl"></div>
              <div className="flex w-full my-3 mx-auto px-6 py-8 rounded-[46px] bg-gradient-to-tr from-[#3F3B5B] via-[#2A2742] to-[#302c4bc7] shadow-2xl"></div>
              <div className="flex w-full my-3 mx-auto px-6 py-8 rounded-[46px] bg-gradient-to-tr from-[#3F3B5B] via-[#2A2742] to-[#302c4bc7] shadow-2xl"></div>
            </motion.div> */}
          </div>
          {/* <progress className="progress progress-warning w-56 m-1 rounded-full" value={0} max="100"></progress>
          <progress className="progress progress-warning w-56 m-1 rounded-full" value="10" max="100"></progress>
          <progress className="progress progress-warning w-56 m-1 rounded-full" value="40" max="100"></progress>
          <progress className="progress progress-warning w-56 m-1 rounded-full" value="70" max="100"></progress>
          <progress className="progress progress-warning w-56 m-1 rounded-full" value="100" max="100"></progress> */}
          {/* <motion.div 
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.7 }}
          className="w-full flex flex-col items-center justify-center mt-2 space-y-10 lg:flex-row lg:space-x-8 lg:justify-center">
            <div className="bg-[#3f3b5b91] rounded-3xl flex flex-col items-center lg:w-1/2">
              <div className="text-white text-center mt-5 text-3xl font-bold">
                Progress
              </div>
              <div className="w-full px-4  mt-5">
                <div className="mb-8 w-full">
                  <div className="bg-light relative flex h-7 w-full  max-w-3xl rounded-2xl bg-slate-300">
                    <div className="bg-[#ce502ad3] absolute top-0 left-0 flex h-full w-[90%] items-center justify-center rounded-2xl text-xs font-semibold text-white">
                      90%
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            {/* <div className="bg-[#3f3b5b91] rounded-3xl flex flex-col items-center lg:mx-10">
              <p className="text-3xl font-bold text-white mt-5">Badges</p>
              <div className="grid justify-items-end grid-cols-2 md:grid-cols-3 gap-1 space-x-10 m-5 justify-center ">
                <img className="w-24 flex" src={bages} alt="" />
                <img className="w-24 flex" src={bages} alt="" />
                <img className="w-24 flex" src={bages} alt="" />
                <img className="w-24 flex" src={bages} alt="" />
                <img className="w-24 flex" src={bages} alt="" />
                <img className="w-24 flex justify-center items-center mb-5" src={bages} alt="" />
              </div>
            </div> */}
          {/* </motion.div> */}
        </div>
      </div>
      
    </main>
  );
}

export default MaincontentProfile;
