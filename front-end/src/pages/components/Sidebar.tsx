import React, { useState } from "react";
import { BiChevronLeft } from "react-icons/bi";
import Logo from "./Logo";
import SidebarData from "./SidebarData";

const Sidebar = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <nav className="flex w-40 h-full">
      <div className="w-full flex -mt-28 px-6 ">
        <div className="w-full h-full flex items-center justify-center text-sm lg:text-xl ">
          <div className={`${toggle ? "w-[5.8rem]" : ""} sidebar-container`}>
            <Logo toggle={toggle} />
            <SidebarData toggle={toggle} />
            {/* <div className="absolute top-[7rem] flex justify-center items-center -left-5 w-10 h-10  rounded-2xl cursor-pointer"
                 onClick={() => {
                     setToggle(!toggle);
                 }}
                 >
                     <BiChevronLeft className={`${toggle ?"rotate-180" : ""} text-3xl transition-all duration-300`} />
                 </div> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

// const Sidebar = () =>{
//     const [toggle, setToggle] = useState(false);
//     return (
//         <div className="w-full h-screen object-cover flex items-center col-span-5 md:col-span-1 p-10 bg-gray-700">
//             <div className={`${toggle ? "w-[5.8rem]": ""} sidebar-container`}>
//                 <Logo toggle={toggle} />
//                 <SidebarData toggle={toggle} />
//                 {/* <div className="absolute top-[7rem] flex justify-center items-center -left-5 w-10 h-10  rounded-2xl cursor-pointer"
//                 onClick={() => {
//                     setToggle(!toggle);
//                 }}
//                 >
//                     <BiChevronLeft className={`${toggle ?"rotate-180" : ""} text-3xl transition-all duration-300`} />
//                 </div> */}
//             </div>
//         </div>
//     )
// }
export default Sidebar;
