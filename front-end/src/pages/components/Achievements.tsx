import React from "react";
import { AchievementsData } from "../Data/AchievementsData";
function Achievements() {
  return (
    <div>
      {AchievementsData.map((data) => {
        return (
          <div key={data.id} className=" bg-black/20 rounded-2xl shadow-2xl flex justify-center p-8  my-5" >
            {/* <div className="relative flex flex-row items-center max-w-5xl sm:ml-20 md:-mr-16 lg:mr-0 lg:ml-5 ">
              <img className="w-6 h-6 lg:w-8 lg:h-8 m-2 -ml-5 lg:-ml-2" src={data.src} alt="" />
              <div className="flex flex-col w-[16rem]">
                <span className="ml-3 mt-2  text-lg lg:text-2xl">{data.name}</span>
              </div>
              {data.status == "ACHIEVED" ? (
                <span className="mt-2 text-[#FE754D] lg:text-2xl text-sm w-[14rem]">{data.status}</span>
              ) : (
                <span className="mt-2 text-[#A3AED0] lg:text-2xl text-sm w-[14rem]">{data.status}</span>
              )}
            </div> */}
            {/* <hr className="text-white w-[100%] mt-16"/> */}
          </div>
        );
      })}
    </div>
  );
}

export default Achievements;
