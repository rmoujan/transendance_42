import React , { useState ,useEffect}from "react";
import { Data } from "../Data/AccountOwnerData";
import { fadeIn } from "./variants";
import { Link } from "react-router-dom";
import axios from "axios";
import Cover from "../../img/bg33.png";
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
function ProfileCard() {
  const [user, setUser] = useState<User[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("http://localhost:3000/auth/get-user", {
        withCredentials: true,
      });
      setUser(data);
    };
    fetchData();
  }, []);
  return (
    <div className="transition-all">
      {user.map((data) => {
        return (
          <div key={data.id_user} className="flex flex-col justify-center items-center">
            <div className="relative mt-1 flex h-32 w-full items-end justify-center rounded-xl bg-cover" style={{backgroundImage: `url(${Cover})`}}>
            
            <img
              src={data.avatar}
              alt="avatar"
              className="flex items-end w-16 h-16 p-1 rounded-full ring-2 ring-gray-300 dark:ring-[#FE754D] -mb-7"
            />
            </div>
            <div className=" font-PalanquinDark text-xl mt-9 ">{data.name}</div>
            <div className=" flex justify-between items-center my-6 text-sm px-4 ">
              <div className="flex flex-col items-center font-semibold ">
                <div className=" text-white text-lg  font-bold font-PalanquinDark">
                  {data.games_played}
                </div>
                <div className="text-[#A3AED0] text-xs font-normal w-20 text-center">Games Played</div>
              </div>
              <div className="w-px h-10 bg-[#A3AED0] rotate-180 transform origin-center"></div>
              <div className="flex flex-col items-center font-semibold">
                <div className=" text-white text-lg font-bold font-PalanquinDark">
                  {data.Wins_percent}%
                </div>
                <div className="text-[#A3AED0] text-xs font-normal w-20 text-center">Win</div>
              </div>
              <div className="w-px h-10 bg-[#A3AED0] rotate-180 transform origin-center"></div>
              <div className="flex flex-col items-center font-semibold">
                <div className=" text-white text-lg  font-bold font-PalanquinDark">
                  {data.Losses_percent}%
                </div>
                <div className="text-[#A3AED0] text-xs font-normal w-20 text-center">Loss</div>
              </div>
            </div>
            <div className=" flex-row justify-between space-x-5">
              <Link to={"/login"}>
                <button className=" p-3 cursor-pointer hover:scale-105 duration-500 tra bg-gradient-to-br from-[#FE754D] to-[#ce502a] rounded-[15px] mb-3 -mt-2 shadow-2xl">Logout</button>
              </Link>
              <Link to={"/setting"}>
                <button className=" p-3 cursor-pointer hover:scale-105 duration-500 bg-gradient-to-br from-[#FE754D] to-[#ce502a] rounded-[15px] mb-3 -mt-2 shadow-2xl">Setting</button>
              </Link>
              
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProfileCard;
