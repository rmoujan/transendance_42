import React, { useState, useRef } from "react";
import { online } from "../Data/online";
import { Link, useRoutes } from "react-router-dom";
import ProfileCardUser from "./ProfileCardUser";
import { link } from "fs";
import { useNavigate } from "react-router-dom";
import ProfileCardFriend from "./ProfileCardFriend";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";


export function handelProfile(data: any) {
  return data;
  // <ProfileCardUser/>
  console.log("test");
}

interface RightbarDataProps {
  toggle: boolean;
}

const RightbarData: React.FC<RightbarDataProps> = ({ toggle }) => {
  const [selectedFriend, setSelectedFriend] = useState<any | null>(null);
  const navigate = useNavigate();
  // Handle click event
  const handleProfileClick = (friend: any) => {
    // Update selectedFriend with the clicked friend's information
    navigate(`/profileFriend/${friend.id}`);
    setSelectedFriend(friend);
    handelProfile(selectedFriend);
  };


  return (
    <div
      className=""
      
    >
      {" "}
      {/* Add a container */}
      <div className="">
        
       
      </div>
      {online.map((data) => (
        <div
          className={`${
            toggle ? "last:w-[3.6rem]" : "last:w-[17rem] pt-2.5"
          } rightbar left-4`}
          onClick={() => handleProfileClick(data)}
          key={data.id}

        >
          <div className="relative group">
            <img className="w-12 h-12 rounded-full pt-0" src={data.src} alt="" />
            <span className="bottom-0 left-8 absolute w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RightbarData;
