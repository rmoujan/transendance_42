import React, { useState, useEffect } from "react";
import { topData } from "../Data/TopStreamerData";
import badge from "../../img/badge.png";
import Maskgroup from "../../img/Maskgroupp.png";
import { handelProfile } from "./RightbarData";
import { useNavigate } from "react-router-dom";
import Path from "./Path";
import CircularProgressbar from "react-circular-progressbar";
import { Progress } from "@material-tailwind/react";
import axios from "axios";
interface TopStreamerDataProps {
  toggle: boolean;
}
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
};
const TopStreamer: React.FC<TopStreamerDataProps> = ({ toggle }) => {
  const navigate = useNavigate();
  const [showDivs, setShowDivs] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [TopStreamer, setTopStreamer] = useState<any[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get("http://localhost:3000/auth/get-all-users", {
        withCredentials: true,
      });
      //get top three streamer
      const topThreeStreamer = await axios.get("http://localhost:3000/profile/TopThree", {
        withCredentials: true,
      });
      setTopStreamer(topThreeStreamer.data);
      setUsers(data);
      console.log("============================================???");
      console.log(topThreeStreamer.data);
    }
    fetchUsers();
    // Use a delay (e.g., setTimeout) to gradually show the divs after component mounts.
    const showDelay = setTimeout(() => {
      setShowDivs(true);
    }, 500); // Adjust the delay as needed

    // Clear the timeout when the component unmounts to avoid memory leaks.
    return () => {
      clearTimeout(showDelay);
    };
  }, []);
  const handleProfileClick = (friend: any) => {
    // Update selectedFriend with the clicked friend's information
    // navigate(`/profileFriend/${friend.id}`);
    console.log("friend");
    console.log(users);
  };
  return (
    <div className=" flex flex-row ">
      <div>
      {}
      </div>
      <div>
        {TopStreamer.map((data, index) => {
          return (
            <div
              key={data.id_user}
              className={`${
                toggle ? "last:w-[3.6rem]" : "last:w-[17rem]"
              } my-8 bottom-4 flex flex-col tablet:pl-28 laptop:pl-0 ${
                showDivs ? "show-div" : "hide-div"
              }`}
              style={{ marginLeft: `${-index * 40}px` }}
            >
              <div className="relative flex tablet:flex-row mobile:flex-col bg-gradient-to-tr from-[#1e1b31c4] to-[#1e1b3112] px-5 py-2 rounded-2xl w-[20vw]  items-center tablet:-ml-32 mobile:-ml-48 lg:ml-20">
                <div className=" flex flex-row items-center justify-center">
                  <img
                    className="w-8 h-8  mobile:w-10 mobile:h-10 m-2 -ml-10 lg:-ml-2"
                    src={topData[index].rank}
                    alt=""
                  />
                  <img
                    className="w-14 h-14  rounded-full"
                    src={data.avatar}
                    alt=""
                    // onClick={() => handleProfileClick(data)}
                  />
                </div>
                <div className=" flex flex-row justify-center items-center">
                  <span
                    className="ml-5 font-PalanquinDark"
                    // onClick={() => handleProfileClick(data)}
                  >
                    {data.name}
                  </span>
                  <span className="ml-5">
                    <span className="text-white text-lg tablet:text-3xl font-bold font-PalanquinDark">
                      {data.games_played}
                    </span>{" "}
                    <span className="text-[#A3AED0] text-xs font-normal w-28 ">
                      Games Played
                    </span>
                  </span>
                  <span className="ml-10 w-20">
                    <div className="w-full bg-gradient-to-br from-[#c1c0bf] to-[#90908f] dark:bg-neutral-600 rounded-full ">
                      <div
                        className=" flex items-center justify-center bg-gradient-to-br h-3 from-[#FE754D] to-[#ce502a] p-0.5 text-center text-xs font-PalanquinDark leading-none text-primary-100 rounded-full"
                        style={{ width: `${data.Progress}%` }}//data.progress
                      >
                        <span className="-mt-0.5">{data.Progress}%{" "}</span>
                      </div>
                    </div>
                  </span>
                  {/* <span className="text-[#A3AED0] text-sm font-normal w-24 ">
                    Win
                  </span> */}
                  {/* <p className="flex ml-3 text-sm text-[#7B7987]">
                    xxxxxxxxxxx
                  </p> */}
                </div>
              </div>
              {/* <hr className="text-white w-[100%] mt-16"/> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopStreamer;
