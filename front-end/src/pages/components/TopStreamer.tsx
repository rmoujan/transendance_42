import React from "react";
import { topData } from "../Data/TopStreamerData";
import badge from "../../img/badge.png";
import Maskgroup from "../../img/Maskgroupp.png";
import { handelProfile } from "./RightbarData";
import { useNavigate } from "react-router-dom";

interface TopStreamerDataProps {
  toggle: boolean;
}

const TopStreamer: React.FC<TopStreamerDataProps> = ({ toggle }) => {
  const navigate = useNavigate();
  const handleProfileClick = (friend: any) => {
    // Update selectedFriend with the clicked friend's information
    navigate(`/profileFriend/${friend.id}`);
  };
  return (
    <div className=" flex flex-row ">
      <div>
        {topData.map((data) => {
          return (
            <div
              className={`${
                toggle ? "last:w-[3.6rem]" : "last:w-[17rem]"
              } rightbar left-4 bottom-4 flex flex-col tablet:pl-28 laptop:pl-0`}
              key={data.id}
            >
              <div className="relative flex tablet:flex-row mobile:flex-col  items-center tablet:-ml-32 mobile:-ml-48 lg:ml-0">
                <div className=" flex flex-row items-center justify-center">
                  {data.id === 1 ? (
                    <img
                      className="w-8 h-8  mobile:w-10 mobile:h-10 m-2 -ml-10 lg:-ml-2"
                      src={data.rank}
                      alt=""
                    />
                  ) : (
                    <span className="m-2 -ml-9 lg:-ml-2 mr-4">{data.rank}</span>
                  )}

                  <img
                    className="w-14 h-14  rounded-full"
                    src={data.src}
                    alt=""
                    onClick={() => handleProfileClick(data)}
                  />
                </div>
                <div className=" flex flex-col justify-center items-center">
                  <span
                    className="ml-3 mt-2"
                    onClick={() => handleProfileClick(data)}
                  >
                    {data.name}
                  </span>
                  <p className="flex ml-3 text-sm text-[#7B7987]">
                    xxxxxxxxxxx
                  </p>
                </div>
              </div>
              {/* <hr className="text-white w-[100%] mt-16"/> */}
            </div>
          );
        })}
      </div>
        {/* <img className=" flex top-0 h-80 " src={Maskgroup} alt="" /> */}
      {/* <img src="http://www.w3.org/2000/svg" 
           className="text-yellow-400  h-16 w-16" 
           /> */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21
                 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </div>
  );
};

export default TopStreamer;
