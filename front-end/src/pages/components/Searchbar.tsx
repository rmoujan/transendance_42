"use client";
import React, { useState, Fragment } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoNotifications } from "react-icons/io5";
import { name } from "../Data/Dataname";
import { Popover, Transition } from "@headlessui/react";
import SearchbarData from "./SearchbarData";
function Searchbar() {
  const [activeSearch, setActiveSearch] = useState([]);
  // const handleSearch = (e) =>{
  //     if(e)
  // }
  return (
    <header className="flex items-center justify-between p-4 space-x-2 ">
      <h1 className=" text-white text-3xl 2xl:text-4xl lg:ml-32 font-PalanquinDark font-bold">
        Ping Pong{" "}
      </h1>
      {/* <div className="hidden sm:block">
        <input
          type="search"
          name="Serch"
          placeholder="Search for Game..."
          className="w-[25rem] p-2 pl-11 rounded-full bg-[#322f49da] focus:outline-none text-white"
        />
        <button type="submit" className="flex ml-4 -mt-7 text-white "> */}
          <SearchbarData />
        {/* <AiOutlineSearch /> */}

        {/* </button>
      </div> */}
      <div className="relative inline-flex w-fit mt-3 hidden sm:block">
        <Popover className="relative flex justify-center items-center">
          {({ open }) => (
            <>
              {/* <div className={`${open ? "": ""}absolute mr-32 bottom-auto left-auto right-2 top-1 z-10 inline-block -translate-y-1/2 translate-x-2/4 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 rounded-full bg-[#C85151] p-1.5 text-xs`}></div> */}
              <div
                className={`absolute mr-32 bottom-auto left-auto right-2 top-1 z-10 inline-block -translate-y-1/2 translate-x-2/4 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 rounded-full ${
                  open ? "" : "bg-[#C85151]"
                } p-1.5 text-xs`}
              ></div>

              <Popover.Button className="">
                <div className="flex w-10 h-10 mr-32 items-center justify-center rounded-full bg-[#322f49da] active:bg-[#3f3c5cda] p-3 text-center text-white shadow-lg dark:text-gray-200">
                  <IoNotifications />
                </div>
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-500"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-10 mt-28 w-80 -ml-72 text-white">
                  <strong className=" flex justify-center">Notification</strong>
                  <div className="flex justify-center items-center bg-[#35324bda] rounded-3xl w-full p-5 shadow-2xl">
                    this is the panel
                  </div>
                </Popover.Panel>
              </Transition>
              {/* </div> */}
            </>
          )}
        </Popover>
      </div>
    </header>
    // <form className="left-[807px] top-[20px] absolute text-slate-500 text-[21px] font-medium leading-loose col-span-5 p-10 bg-amber-200">
    //     <div className="relative">
    //         <input type="search" placeholder="Search for Game..." className="w-full p-2 pl-11 rounded-full bg-[#25184288]"/>
    //         <button className="absolute right-1 top-1/2 -translate-y-1/2 p-4 rounded-full">
    //             <AiOutlineSearch />
    //         </button>
    //     </div>
    //     {/* <div className="absolute top-20 p-4 bg-slate-800 text-white w-full rounded-xl left-1/2 -translate-x-1/2 flex flex-col gap-2">

    //     </div> */}
    // </form>
  );
}
export default Searchbar;
