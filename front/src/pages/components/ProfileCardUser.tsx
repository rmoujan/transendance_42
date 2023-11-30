import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "tailwindcss/tailwind.css";
import Cover from "../../img/bg33.png";
import bot from "../../img/bot.png";
import { AchievementsData } from "../Data/AchievementsData";
import { fadeIn } from "./variants";
type Achievments = {
  msg: string;
  userId: number;
  achieve: string;
};
type History = {
  winner: boolean;
  useravatar: string;
  userscore: number;
  enemyscore: number;
  enemyavatar: string;
  username: string;
  enemyname: string;
  enemyId: number;
  userId: number;
};
type User = {
  id_user: number;
  name: string;
  avatar: string;
  TwoFactor: boolean;
  secretKey: string | null;
  About: string;
  status_user: string;
  wins: number;
  losses: number;
  games_played: number;
  Progress: number;
  Wins_percent: number;
  Losses_percent: number;
  achievments: Achievments[];
  history: History[];
};
const ProfileCardUser: React.FC = () => {
  const { friendId } = useParams<{ friendId: string }>();
  const friendIdNumber = friendId ? parseInt(friendId, 10) : undefined;
  const [user, setUser] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("http://localhost:3000/auth/friends", {
        withCredentials: true,
      });
       setUser(data);
    };
    fetchData();
  }, []);

 

  const friendInfo = user.find((friend) => friend.id_user === friendIdNumber);
  const history: History[] | undefined = friendInfo?.history;
  const achievments: Achievments[] | undefined = friendInfo?.achievments;
  return (
    <main className=" overflow-scroll resultUserContainer flex justify-center items-center flex-col w-[90%]  overflow-y-auto -mb-10 ">
      <div className="flex text-white text-7xl font-PalanquinDark">
        Profile {friendInfo?.name}
      </div>
      <div className="flex  items-center justify-center w-full mx-auto pr-5 lg:px-6 py-8 ">
        <div className="flex flex-col w-[65vw] h-full text-gray-900 shadow-2xl bg-[#3f3b5b91] py-16 text-xl rounded-3xl">
          <motion.div
            variants={fadeIn("down", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.7 }}
            className="flex md:flex-row flex-col w-full justify-center h-full text-gray-900 text-xl "
          >
            <div className="dark:!bg-navy-800 shadow-shadow-500 mb-5 shadow-3xl flex justify-center rounded-primary relative mx-auto  h-full w-full max-w-[90rem] flex-col items-center bg-cover bg-clip-border p-[16px] dark:text-white dark:shadow-none">
              <div
                className="relative flex h-60 w-full md:w-[35rem] lg-laptop:w-[86rem] justify-center items-end rounded-3xl bg-cover -mt-3 shadow-lg"
                title="object-center"
                style={{
                  backgroundImage: `url(${Cover})`,
                }}
              >
               <div className="flex h-[115px] w-[115px] items-center -m-11 justify-center rounded-full border-[10px] border-[#353151] bg-slate-400">
                <div className=" flex h-[98px] w-[98px] items-center -m-11 justify-center rounded-full border-[4px] border-white bg-slate-400">
                    <img
                    className="h-full w-full rounded-full "
                    src={friendInfo?.avatar}
                    alt=""
                  />
                  </div>
                </div>
              </div>
              <div
                className=" flex  w-full lg-laptop:flex-row  mt-10  justify-between 
             flex-col-reverse "
              >
                <div className=" mt-4 flex flex-col md:!gap-14 justify-center tablet:flex-row ">
                  <div className="flex flex-col items-center justify-center ">
                    <h3 className="text-white text-lg tablet:text-3xl font-bold font-PalanquinDark">
                      {friendInfo?.games_played}
                    </h3>
                    <p className="text-[#A3AED0] text-sm font-normal w-24 ">
                      Games Played
                    </p>
                  </div>
                  <div className="w-px h-10 bg-[#A3AED0] rotate-180 transform origin-center"></div>
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="text-white text-lg tablet:text-3xl font-bold font-PalanquinDark">
                      {" "}
                      {friendInfo?.Wins_percent} %
                    </h3>
                    <p className="text-[#A3AED0] text-sm font-normal">Win</p>
                  </div>
                  <div className="w-px h-10 bg-[#A3AED0] rotate-180 transform origin-center"></div>
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="text-white text-lg tablet:text-3xl font-bold font-PalanquinDark">
                      {friendInfo?.Losses_percent} %
                    </h3>
                    <p className="text-[#A3AED0] text-sm font-normal">Loss</p>
                  </div>
                </div>
                <div className="flex flex-row justify-center items-center ">
                  <h4 className="text-white mobile:text-2xl tablet:text-4xl flex-row font-bold lg:mt-4 mt-0 lg-laptop:-ml-80">
                    {friendInfo?.name}
                  </h4>

                </div>
                <div className="flex justify-center mt-4 md:mt-4">
                  <div className=" font-semibold rounded-2xl px-3 w-20 text-white hidden lg-laptop:block mr-5"></div>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="flex flex-col items-center  w-full ">
            <motion.div
              variants={fadeIn("left", 0.2)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.7 }}
              className="w-full flex flex-col items-center justify-center mt-2 mb-10 space-y-10 lg:flex-row lg:space-x-8 lg:justify-center"
            >
              <div className="bg-[#3f3b5b91] rounded-3xl flex flex-col items-center lg:w-3/4 lg-laptop:w-3/5">
                <div className=" text-white text-center mt-5 mobile:text-xl tablet:text-3xl font-bold px-11 tablet:px-52">
                  Progress
                </div>
                <div className="  w-full px-4  mt-5">
                  <div className=" flex justify-center items-center mb-8 w-full">
                    <div className="bg-light relative flex h-7 w-full  max-w-3xl rounded-2xl bg-slate-300">
                      <div
                        className="bg-[#ce502ad3] absolute top-0 left-0 flex h-full items-center justify-center rounded-2xl text-xs font-semibold text-white"
                        style={{ width: `${friendInfo?.Progress}%` }}
                      >
                        {friendInfo?.Progress}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="flex lg:flex-row flex-col space-y-2 justify-center lg:space-x-3 lg:space-y-0 mobile:items-center">
              <motion.div
                variants={fadeIn("right", 0.2)}
                initial="hidden"
                whileInView={"show"}
                viewport={{ once: false, amount: 0.7 }}
                className="flex-1 p-4 tablet:min-w-[60vh] max-w-[20px] lg-laptop:px-2 bg-[#3f3b5b91] rounded-3xl mobile:h-3/4  lg-laptop:mt-9 lg-laptop:min-w-[60%] lg-laptop:h-full tablet:w-2/5 lg-laptop:w-1/5 laptop:mb-10 shadow-2xl justify-center mobile:items-center"
              >
                <div className="flex justify-center items-center text-white  text-2xl  laptop:text-4xl font-PalanquinDark">
                  About Me
                </div>
                <div className=" text-white  flex justify-center px-3 max-w-[400px] bg-black/20 rounded-2xl shadow-2xl mt-8 font-Bad_Script mx-2 text-2xl text-center p-4 overflow-hidden">
                  {
                    <p
                      className="whitespace-pre-line"
                    >
                      {friendInfo?.About === null
                        ? "You don't have any About Me yet !"
                        : friendInfo?.About}
                    </p>
                  }
                
                </div>
              </motion.div>
              <motion.div
                variants={fadeIn("right", 0.2)}
                initial="hidden"
                whileInView={"show"}
                viewport={{ once: false, amount: 0.7 }}
                className="flex flex-col overflow-scroll resultContainer h-[25rem] max-h-[25rem] p-4 rounded-3xl tablet:min-w-[60vh] tablet:w-4/5 tablet:mt-10 tablet:mb-10 lg-laptop:w-[21rem] bg-[#3f3b5b91] laptop:mb-20  shadow-2xl mx-2 lg-laptop:min-w-[80%]  md:mx-10 "
              >
                <div className="text-white flex text-center justify-center font-PalanquinDark text-2xl  tablet:text-4xl mb-5">
                  Game History
                </div>
                <div className="my-1 flex flex-col max-w-[20]  mx-h-[50rem]  ">
                  {history?.length === 0 && (
                    <div className="flex justify-center items-center mt-4">
                      <p className="mt-20 text-center text-gray-300 text-2xl opacity-50">
                        You don't have any game history yet !
                      </p>
                    </div>
                  )}
                  {history?.map((item,index) => (
                    <div
                      key={index}
                      className=" bg-black/20 rounded-2xl shadow-2xl flex justify-center items-center p-4 w-[30rem] -mr-10 my-3"
                    >
                      {item.winner ? (
                        <span className=" px-3 font-bold text-emerald-400 ml-2 ">
                          Win
                        </span>
                      ) : (
                        <span className=" font-bold text-red-400  px-3  ml-2">
                          Loss
                        </span>
                      )}
                      <span className=" text-white font-bold px-3">
                        {item.username}
                      </span>
                      <img
                        src={item.useravatar}
                        alt=""
                        className="rounded-full w-12 h-12 mr-5 border-2"
                      />
                      <span className=" text-white text-2xl font-bold">
                        {item.userscore}
                      </span>
                      <span className=" text-white font-bold">:</span>
                      <span className=" text-white text-2xl font-bold">
                        {item.enemyscore}
                      </span>

                      {item.enemyId === 9 ? (
                        <>
                          <img
                            src={bot}
                            alt=""
                            className="rounded-full w-12 h-12 ml-5 -mt-1 border-2"
                          />
                          <span className=" text-white px-3 font-bold">
                            Bot
                          </span>
                        </>
                      ) : (
                        <>
                          <img
                            src={item.enemyavatar}
                            alt=""
                            className="rounded-full w-12 h-12 ml-5 border-2"
                          />
                          <span className=" text-white px-3 font-bold">
                            {item.enemyname}
                          </span>
                        </>
                      )}</div>
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
                <div className="my-1 flex flex-col max-w-[30rem] mx-auto text-white">
                  <div>
                    {achievments?.length == 0 && (
                      <div className="flex justify-center items-center mt-4">
                        <p className=" mt-20 text-center text-gray-300 text-2xl opacity-50">
                          No Achievements yet !
                        </p>
                      </div>
                    )}
                    {achievments?.map((data) => {
                      return (
                        <div
                          key={data?.userId}
                          className=" bg-black/20 rounded-2xl shadow-2xl flex items-center justify-center p-3   my-5"
                        >
                          <div className=" flex flex-row justify-between items-center">
                            {data.msg == "Tbarkellah 3lik" && (
                              <img
                                className="w-12 h-12"
                                src={AchievementsData[0].src}
                                alt=""
                              />
                            )}
                            {data.msg == "Wa Rak Nad...Khomasiya" && (
                              <img
                                className="w-12 h-12"
                                src={AchievementsData[1].src}
                                alt=""
                              />
                            )}
                            {data.msg == "papapapapa...3Ashra" && (
                              <img
                                className="w-12 h-12"
                                src={AchievementsData[2].src}
                                alt=""
                              />
                            )}
                            <div>
                              <p className="text-white text-2xl font-bold">
                                {data.achieve}
                              </p>
                              <p className="text-gray-400 text-lg font-medium">
                                {data.msg}
                              </p>
                            </div>
                          </div>
                         
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileCardUser;
