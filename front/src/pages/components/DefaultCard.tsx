import React from "react";
import avatar from "../../img/download.png";
const DefaultCard = () => {
return  (
    <>
         <div className="bg-[#8b98e452] h-[20vh] w-[15vw] rounded-[30px] mr-7">
              <div className=" flex flex-col justify-start items-start m-2">
                <div className=" flex flex-row justify-end space-x-24">
                  <div className=" flex justify-end text-6xl text-white mt-4">
                    0
                  </div>
                  <img
                    className="  flex w-24 h-24 justify-end rounded-full border-[4px] border-white mt-3"
                    src={avatar}
                    alt=""
                  />
                </div>
                <div className=" flex text-white text-center ml-[150px] font-bold mt-2 text-xl">
                    Name
                </div>
              </div>
              <div className=" flex justify-between mx-10 mt-5 text-white">
                <div className=" flex flex-col justify-center items-center">
                  <div className=" font-bold text-xl">Status</div>
                  <div className=" bg-[#457336] px-3 rounded-full mt-5">
                    Status
                  </div>
                </div>
                <div className=" flex flex-col justify-center items-center">
                  <div className=" font-bold text-xl">Level</div>
                  <div className=" px-3 text-[#FE754D] font-bold rounded-full mt-5">
                    Level
                  </div>
                </div>
                <div className=" flex flex-col justify-center items-center">
                  <div className=" font-bold text-xl">Win</div>
                  <div className=" px-3 text-white font-bold rounded-full mt-5">
                    Win
                  </div>
                </div>
              </div>
            </div>     
    </>
)
}

export default DefaultCard;