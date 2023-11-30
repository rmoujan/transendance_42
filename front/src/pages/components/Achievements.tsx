import axios from "axios";
import { useEffect, useState } from "react";
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
      const { data } = await axios.get(
        "http://localhost:3000/profile/Achievments",
        {
          withCredentials: true,
        }
      );
      setAchievements(data);
    };
    fetchData();
  }, []);
  return (
    <div>
      {Achievements.length == 0 && (
        <div className="flex justify-center items-center mt-4">
          <p className=" mt-20 text-center text-gray-300 text-2xl opacity-50">
            No Achievements yet !
          </p>
        </div>
      )}
      {Achievements.map((data) => {
        return (
          <div
            key={data.id}
            className=" bg-black/20 rounded-2xl shadow-2xl flex items-center justify-center p-3   my-5"
          >
            <div className=" flex flex-row justify-between items-center">
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
          </div>
        );
      })}
    </div>
  );
}

export default Achievements;
