import React, { useState ,useEffect} from "react";
import axios from "axios";
import { AchievementsData } from "../Data/AchievementsData";

type Achievements = {
  id: number;
  achieve: string;
  msg: string;
  userId: number;
};

function Achievements() {
  const [Achievements, setAchievements] = useState<Achievements[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("http://localhost:3000/profile/Achievments", {
        withCredentials: true,
      });
      setAchievements(data);
    };
    fetchData();
  }, []);
  return (
    <div>
      {/* //if no achievements show this message */}
      {
        Achievements.length == 0 && (
          
          <div className="flex justify-center items-center mt-4">
          <p className=" mt-20 text-center text-gray-300 text-2xl opacity-50">
            No Achievements yet !
          </p>
          </div>
        )
      }
      {Achievements.map((data) => {
        return (
          <div key={data.id} className=" bg-black/20 rounded-2xl shadow-2xl flex items-center justify-center p-3   my-5" >
            <div className=" flex flex-row justify-between items-center">
              {/* //if msg == Tbarkellah 3lik  show this image form AchievementsData.tsx and if mssg == "Wa Rak Nad...Khomasiya" show other image from AchievementsData.tsx and if mssg == "papapapapa...3Ashra" show other image from AchievementsData.tsx*/}
              {data.msg == "Tbarkellah 3lik" && (
                <img
                  className="w-12 h-12"
                  src={AchievementsData[0].src}
                  alt=""
                />
              )}
              {data.msg == "Wa Rak Nad...Khomasiya" && (
                <img
                  className="w-12 h-12"
                  src={AchievementsData[1].src}
                  alt=""
                />
              )}
              {data.msg == "papapapapa...3Ashra" && (
                <img
                  className="w-12 h-12"
                  src={AchievementsData[2].src}
                  alt=""
                />
              )}
              <div>

              <p className="text-white text-2xl font-bold">{data.achieve}</p>
              <p className="text-gray-400 text-lg font-medium">{data.msg}</p>
              </div>
            </div>
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
