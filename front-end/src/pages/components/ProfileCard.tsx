import React from "react";
import { Data } from "../Data/AccountOwnerData";
import { fadeIn } from "./variants";
import { Link } from "react-router-dom";
import Cover from "../../img/bg33.png";

function ProfileCard() {
  return (
    <div className="transition-all ">
      {Data.map((data) => {
        return (
          <div key={data.id} className="flex flex-col justify-center items-center">
            <div className="relative mt-1 flex h-32 w-full items-end justify-center rounded-xl bg-cover" style={{backgroundImage: `url(${Cover})`}}>
            
            <img
              src={data.src}
              alt="avatar"
              className="flex items-end w-16 h-16 p-1 rounded-full ring-2 ring-gray-300 dark:ring-[#FE754D] -mb-7"
            />
            </div>
            <div className=" font-semibold text-xl mt-9 ">{data.name}</div>
            <div className=" flex justify-between items-center my-6 text-sm px-4">
              <div className="flex flex-col items-center font-semibold mr-4">
                <div className="text-sm text-white">Games Played</div>
                <div className=" text-sm text-gray-500 font-bold">
                  {data.GamesPlayed}
                </div>
              </div>
              <div className="flex flex-col items-center font-semibold mr-4">
                <div className="text-sm text-white">Win</div>
                <div className=" text-sm text-gray-500 font-bold">
                  {data.Win}
                </div>
              </div>
              <div className="flex flex-col items-center font-semibold">
                <div className="text-sm text-white">Loss</div>
                <div className=" text-sm text-gray-500 font-bold">
                  {data.Loss}
                </div>
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
