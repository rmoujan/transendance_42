import React, {useEffect, useState, useRef } from "react";
import { online } from "../Data/online";
import { Link, useRoutes } from "react-router-dom";
import ProfileCardUser from "./ProfileCardUser";
import { link } from "fs";
import { useNavigate } from "react-router-dom";
import ProfileCardFriend from "./ProfileCardFriend";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import { socket } from "../../socket";

export function handelProfile(data: any) {
  return data;
  // <ProfileCardUser/>
  console.log("test");
}

interface RightbarDataProps {
  toggle: boolean;
}
type User = {
  id_user: number;
  name: string;
  avatar: string;
  TwoFactor: boolean;
  secretKey: string | null;
  About:string;
  status_user: string;
  wins:number;
  losses:number;
  gamesPlayed:number;
};
const RightbarData: React.FC<RightbarDataProps> = ({ toggle }) => {
  const [selectedFriend, setSelectedFriend] = useState<any | null>(null);
  const navigate = useNavigate();
  // Handle click event
  const handleProfileClick = (friend: any) => {
    // Update selectedFriend with the clicked friend's information
    navigate(`/profileFriend/${friend.id}`);
    setSelectedFriend(friend);
    handelProfile(selectedFriend);
  };
  const [users, setUsers] = useState<User[]>([]);
  const [AccountOwner, setAccountOwner] = useState<User[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const friendsResponse = await axios.get("http://localhost:3000/auth/friends", { withCredentials: true });
        const userResponse = await axios.get("http://localhost:3000/auth/get-user", { withCredentials: true });

        const friends = friendsResponse.data;
        const user = userResponse.data;

        setUsers(friends);
        setAccountOwner(user);

        // Assuming you have a socket instance available
        if (socket) {
          socket.on("RefreshFriends", async () => {
            const newfriends = await axios.get("http://localhost:3000/auth/friends", { withCredentials: true }); 
            console.log("newfriends : " , newfriends.data);
            // console.log("what is inside friends : " , newfriends); 
            setUsers(newfriends.data); // Add the new friend to the existing user list
          });
          console.log("refreeeeeeeshfriends");
          socket.on("offline", (data: any) => {
            setUsers(prevUsers => {
              return prevUsers.map((user: User) => {
                if (user.id_user === data.id_user) {
                  return { ...user, status_user: "offline" };
                }
                return user;
              });
            });
          });
          socket.on("online", (data: any) => {
            setUsers(prevUsers => {
              return prevUsers.map((user: User) => {
                if (user.id_user === data.id_user) {
                  return { ...user, status_user: "online" };
                }
                return user;
              });
            });
          });
        }
      } catch (error) {
        console.log(error);
        
        // Handle errors here
      }
    };

    fetchData();

    // Clean up the socket listeners when the component unmounts
    return () => {
      // if (socket) {
      //   socket.off("statusChange");
      // }
    };
  }, []);
  
  console.log("debbuging users of rightbar : " , users);
  return (
    <div
      className=""
      
    >
      {" "}
      {users.map((data) => (
        <div
          className={`${
            toggle ? "last:w-[3.6rem]" : "last:w-[17rem] pt-2.5"
          } rightbar left-4`}
          // onClick={() => handleProfileClick(data)}
          key={data.id_user}

        >
          <div className="relative group">
            <img className="w-12 h-12 rounded-full pt-0" src={data.avatar} alt="" />
            {
              data.status_user === "online" ? (
                <span className="bottom-0 left-8 absolute w-3.5 h-3.5 bg-green-400 border-2 border-[#2D2945] dark:border-gray-800 rounded-full"></span>
              ) : (
                <span className="bottom-0 left-8 absolute w-3.5 h-3.5 bg-red-400 border-2 border-[#2D2945] dark:border-gray-800 rounded-full"></span>
              )
            }
            {/* <span className="bottom-0 left-8 absolute w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RightbarData;

    // useEffect(() => {
    //   const fetchUsers = async () => {
    //     const { data } = await axios.get("http://localhost:3000/auth/friends", {
    //       withCredentials: true,
    //     });
    //     console.log("frienddddddddddddddd");
    //     console.log(data);
    //     const { data: data2 } = await axios.get("http://localhost:3000/auth/get-user", {
    //       withCredentials: true,
    //     });
    //     setUsers(data);
    //     if (socket) {
    //       socket.on("offline", (data: any) => {
    //         console.log("data");
    //         console.log(data);
    //         const updateFriends = users.map((user: User) => {
    //           if (user.id_user === data.id_user) {
    //             return { ...user, status_user: "offline" };
    //           }
    //           return user;
    //         });
    //         setUsers(updateFriends);
    //       });
    //       socket.on("online", (data: any) => {
    //         console.log("data");
    //         console.log(data);
    //         const updateFriends = users.map((user: User) => {
    //           if (user.id_user === data.id_user) {
    //             return { ...user, status_user: "online" };
    //           }
    //           return user;
    //         });
    //         setUsers(updateFriends);
    //       });
          
    //     }
    //     setAccountOwner(data2);
    //     const updateFriends = data.filter((user:User) => user.id_user !== data2.id_user);
    //     setUsers(updateFriends);
    //     console.log("============================================???");
    //   }
    //   fetchUsers();
    //   // Use a delay (e.g., setTimeout) to gradually show the divs after component mounts.
    //    // Adjust the delay as needed
  
    //   // Clear the timeout when the component unmounts to avoid memory leaks.
    // }, []);
      
        // useEffect(() => {
        //   const fetchData = async () => {
        //     try {
        //       const friendsResponse = await axios.get("http://localhost:3000/auth/friends", { withCredentials: true });
        //       const userResponse = await axios.get("http://localhost:3000/auth/get-user", { withCredentials: true });
      
        //       const friends = friendsResponse.data;
        //       const user = userResponse.data;
      
        //       setUsers(friends);
        //       setAccountOwner(user);
      
        //       // Assuming you have a socket instance available
        //       if (socket) {
        //         socket.on("offline", (data: any) => {
        //           console.log("data");
        //           console.log(data);
        //           const updateFriends = users.map((user: User) => {
        //             if (user.id_user === data.id_user) {
        //               return { ...user, status_user: "offline" };
        //             }
        //             return user;
        //           });
        //           setUsers(updateFriends);
        //         });
        //         socket.on("online", (data: any) => {
        //           console.log("data");
        //           console.log(data);
        //           const updateFriends = users.map((user: User) => {
        //             if (user.id_user === data.id_user) {
        //               return { ...user, status_user: "online" };
        //             }
        //             return user;
        //           });
        //           setUsers(updateFriends);
        //         });
        //       }
        //     } catch (error) {
        //       // Handle errors here
        //     }
        //   };
      
        //   fetchData();
      
        //   // Clean up the socket listeners when the component unmounts
        //   return () => {
        //     if (socket) {
        //       socket.off("statusChange");
        //     }
        //   };
        // }, []);