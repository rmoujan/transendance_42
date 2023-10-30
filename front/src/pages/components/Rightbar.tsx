import React, { useState, useRef } from "react";
import { BiChevronLeft } from "react-icons/bi";
import Logo from "./Logo";
import RightbarData from "./RightbarData";
import Arcane from "../../img/Arcane.png";
import { TiGroup } from "react-icons/ti";
import ProfileCard from "./ProfileCard";
import { FiChevronUp } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";
function Rightbar() {
  const [toggle, setToggle] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollStep = 150;
  const handleScrollUp = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        top: -scrollStep,
        behavior: "smooth",
      });
    }
  };

  const handleScrollDown = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        top: scrollStep,
        behavior: "smooth",
      });
    }
  };
  return (
    // <nav className="flex w-40 h-full hidden lg:block mt-20"></nav>
    <div className=" mt-[30px]">

      <nav className="flex w-40 h-full hidden lg:block mt-20">
        <div className="w-full flex -mt-32 px-6">
          <div className="w-full h-full flex items-center justify-center text-gray-900 mt-10 text-xl">
            <div className={`${toggle ? "w-[5.8rem]" : ""} rightbar-container `}>
              {/* <div className="group">
                <img
                  className="w-14 h-14 p-1 rounded-full ring-2 ring-[#FE754D] dark:ring-[#FE754D] "
                  src={Arcane}
                  alt="Bordered avatar"
                />
                <span className="profile-card group-hover:scale-100 ">
                  <ProfileCard />
                </span>
              </div> */}

              {/* <div className="flex text-white items-center justify-center mt-8 text-[1.7rem]">
                <TiGroup />
              </div> */}
              <button className="absolute left-6 my-5 bg-[#0505054d] p-3 rounded-full" onClick={handleScrollUp}>
                <FiChevronUp className=" text-white" />
              </button>
              <div
                className="overflow-y-auto resultContainer relative h-[38.5rem] mt-[4.5rem]"
                ref={containerRef}
              >
                <RightbarData toggle={toggle} />
              </div>
              <button
                className="absolute left-6  bg-[#0505054d] p-3 rounded-full mt-0"
                onClick={handleScrollDown}
              >
                <FiChevronDown className=" text-white" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

// function Rightbar(){
//     const [toggle, setToggle] = useState(false);
//     return (
//         <div className="col-span-5 md:col-span-1 bg-rose-300">
//             <div className="w-full h-screen object-cover flex items-center justify-end">
//         <div className={`${toggle ? "w-[5.8rem]" : ""} rightbar-container`}>
//           <Logo toggle={toggle} />
//           <SidebarData toggle={toggle} />
//           {/* <div className="absolute top-[7rem] flex justify-center items-center -left-5 w-10 h-10  rounded-2xl cursor-pointer"
//                 onClick={() => {
//                     setToggle(!toggle);
//                 }}
//                 >
//                     <BiChevronLeft className={`${toggle ?"rotate-180" : ""} text-3xl transition-all duration-300`} />
//                 </div> */}
//         </div>
//       </div>
//         </div>
//     );
// }
export default Rightbar;
