import React from "react";
import { online } from "../Data/online";
import { fadeIn } from "./variants";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Cover from "../../img/bg33.png";
function ProfileCardFriend() {
    const { friendId } = useParams<{ friendId: string }>();
    const friendIdNumber = friendId ? parseInt(friendId, 10) : undefined;
  
    const friendInfo = online.find((friend) => friend.id === friendIdNumber);
  return (
    <div className="transition-all ">
      {/* {online.map((data) => { */}
        {/* return ( */}
            <div className="dark:!bg-navy-800 shadow-shadow-500 shadow-3xl rounded-primary relative mx-auto flex h-full w-full max-w-[550px] flex-col items-center  bg-cover bg-clip-border p-[16px] dark:text-white dark:shadow-none">
            <div className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover" style={{backgroundImage: `url(${Cover})`}}>
              <div className="absolute -bottom-12 flex h-[88px] w-[88px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400">
                  <img className="h-full w-full rounded-full" src={friendInfo?.src} alt="" />
              </div>
            </div>
            <div className="mt-16 flex flex-col items-center">
              <h4 className="text-bluePrimary text-xl font-bold">Adela Parkson</h4>
              <p className="text-lightSecondary text-base font-normal">Product Manager</p>
            </div>
            <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-bluePrimary text-2xl font-bold">{friendInfo?.GamesPlayed}</h3>
                <p className="text-lightSecondary text-sm font-normal">Games Played</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-bluePrimary text-2xl font-bold">{friendInfo?.Win}</h3>
                <p className="text-lightSecondary text-sm font-normal">Win</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-bluePrimary text-2xl font-bold">{friendInfo?.Loss}</h3>
                <p className="text-lightSecondary text-sm font-normal">Loss</p>
              </div>
            </div>
          </div>
        {/* ); */}
      {/* })} */}
    </div>
  );
}

export default ProfileCardFriend;
