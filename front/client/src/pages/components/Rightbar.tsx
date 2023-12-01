import { useRef, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import RightbarData from "./RightbarData";
function Rightbar() {
  const [toggle, setToggle] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollStep = 150;
  const handleScrollUp = () => {
    setToggle(false);
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
    <div className=" mt-[30px]">
      <nav className="flex w-40 h-full hidden lg:block mt-20">
        <div className="w-full flex -mt-32 px-6">
          <div className="w-full h-full flex items-center justify-center text-gray-900 mt-10 text-xl">
            <div className={`${toggle ? "w-[5.8rem]" : ""} rightbar-container `}>
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

export default Rightbar;
