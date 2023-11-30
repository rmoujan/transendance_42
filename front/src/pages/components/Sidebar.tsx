import { useState } from "react";
import Logo from "./Logo";
import SidebarData from "./SidebarData";

const Sidebar = () => {
  const [toggle] = useState(false);
  return (
    <nav className="flex w-40 h-full">
      <div className="w-full flex -mt-28 px-6 ">
        <div className="w-full h-full flex items-center justify-center text-sm lg:text-xl ">
          <div className={`${toggle ? "w-[5.8rem]" : ""} sidebar-container`}>
            <Logo toggle={toggle} />
            <SidebarData toggle={toggle} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
