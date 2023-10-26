import React, { useState } from "react";
import Arcane from "../../img/Arcane.png";
import { Data } from "../Data/AccountOwnerData";
import scr from "../../img/Screenshot.png";
import Cover from "../../img/bg33.png";
import { MdModeEditOutline } from "react-icons/md";
import { Modal } from "antd";
import axios from "axios";
import { IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { toggleProfile } from "../../redux/slices/profile";
type User = {
  id_user: number;
  name: string;
  avatar: string;
  TwoFactor: boolean;
  secretKey: string | null;
  status_user: string;
};
type AccountOwnerProps = {
  user: User[];
};
function AccountOwner({ user }: AccountOwnerProps) {
  const { profile } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  const [isEditingName, setIsEditingName] = useState(false);

  function toggleUserName(id_user: number, newName: string) {
    // if (isEditingName) {
    //   // Step 4: Send the updated name to the backend
    //   axios.post("http://localhost:3000/auth/update-user", {
    //     id_user: id_user,
    //     name: newName,
    //   });
    //   setIsEditingName(false);
    // } else {
    //   setIsEditingName(true);
    // }
  }
  return (
    <div className="bg-[#3f3b5b91] min-w-screen lg-laptop:w-[70%]  lg-laptop:mt-16 rounded-3xl mb-11 shadow-2xl">
      {user.map((data) => {
        return (
          <div className="dark:!bg-navy-800 shadow-shadow-500 mb-5 shadow-3xl flex justify-center rounded-primary relative mx-auto  h-full w-full max-w-[90rem] flex-col items-center bg-cover bg-clip-border p-[16px] dark:text-white dark:shadow-none">
            <div
              className="relative flex h-72 w-full md:w-[35rem] lg-laptop:w-[120rem] justify-center items-end rounded-3xl bg-cover -mt-3 shadow-lg"
              title="object-center"
              style={{
                // backgroundImage: 'url("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bca2fa29-36c0-4b87-aa20-6848ad75c66b/d62n5by-9ef8ff16-8b2d-41c6-849f-093129d3ac3a.jpg/v1/fill/w_1203,h_664,q_70,strp/mercenaries_by_real_sonkes_d62n5by-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODgzIiwicGF0aCI6IlwvZlwvYmNhMmZhMjktMzZjMC00Yjg3LWFhMjAtNjg0OGFkNzVjNjZiXC9kNjJuNWJ5LTllZjhmZjE2LThiMmQtNDFjNi04NDlmLTA5MzEyOWQzYWMzYS5qcGciLCJ3aWR0aCI6Ijw9MTYwMCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.cj4Pf9CSyiVk-cjTsZKAeHUcLPPKP6h-el1mMuLDJmo")',
                backgroundImage: `url(${Cover})`,
              }}
            >
              <IconButton>
                <div className=" flex h-[98px] w-[98px] items-center -m-11 justify-center rounded-full border-[4px] border-white bg-slate-400">
                  <img
                    className="h-full w-full rounded-full "
                    src={profile.avatar}
                    alt=""
                    onClick={() => {
                      console.log("this where it should show profile photo");
                      console.log(profile);
                      dispatch(toggleProfile());
                    }}
                  />
                </div>
              </IconButton>
            </div>
            {/* <div className="flex mt-16 justify-between items-center w-full">
              <div>first</div>
              <div>second</div>
              <div>therd</div> */}
            <div
              className=" flex  w-full lg-laptop:flex-row  mt-10  justify-between 
             flex-col-reverse "
            >
              <div className=" mt-4 flex flex-col md:!gap-14 justify-center tablet:flex-row ">
                <div className="flex flex-col items-center justify-center ">
                  <h3 className="text-white text-lg tablet:text-2xl font-bold">
                    {155}
                  </h3>
                  <p className="text-[#A3AED0] text-sm font-normal w-24 ">
                    Games Played
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-white text-lg tablet:text-2xl font-bold">
                    {64} %
                  </h3>
                  <p className="text-[#A3AED0] text-sm font-normal">Win</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-white text-lg tablet:text-2xl font-bold">
                    {45} %
                  </h3>
                  <p className="text-[#A3AED0] text-sm font-normal">Loss</p>
                </div>
              </div>
              <div className="flex flex-row justify-center items-center ">
                <h4 className="text-white mobile:text-2xl tablet:text-4xl flex-row font-bold lg:mt-4 mt-0 lg-laptop:-ml-44">
                  {data.name}
                </h4>

                {/* <MdModeEditOutline className=" w-6 flex items-center justify-center mx-2 text-gray-400" onClick={()=>toggleUserName(data.id_user, data.name)}/> */}
              </div>
              <div className="flex justify-center mt-4 md:mt-4">
                {/* <button className="bg-gradient-to-br from-[#fe764dd3] to-[#ce502ad3] rounded-2xl px-3 mx-4 shadow-2xl">
                  Edit Profile Photo
                </button> */}
                <button className="bg-gradient-to-br from-[#fe764dd3] to-[#ce502ad3] font-semibold rounded-2xl px-3 text-white shadow-2xl hidden lg-laptop:block">
                  Add Friend +
                </button>
              </div>
            </div>
          </div>
          // <div key={data.id} className="flex w-full max-w-[900px] h-72 pl-10 pt-10 mb-5  rounded-[46px] mx-auto bg-gradient-to-tr from-[#3F3B5B] via-[#2A2742] to-[#3f3a5f] shadow-2xl">
          //   <img className=" w-16 h-16 lg:w-28 lg:h-28  p-1 rounded-full ring-4 ring-gray-300 dark:ring-[#3b3c5a]" src={data.src} alt="" />
          //   <div className="flex flex-col text-white">
          //     <h3 className=" font-Lalezar font-bold text-3xl ml-3 lg:ml-10">Jinx</h3>
          //     <hr className=" text-gray-400 mx-14 my-8 md:w-96" />
          //     <div className='flex flex-row mb-4'>
          //       <span className=' -ml-16 lg:ml-9 text-sm'>Games Played</span> <span className=' ml-5 lg:ml-10 text-sm text-gray-400'>{data.GamesPlayed}</span>
          //     </div>
          //     <div className='flex flex-row mb-4'>
          //       <span className='-ml-16 lg:ml-9 text-sm'>Win</span> <span className=' ml-5 lg:ml-10 text-sm text-gray-400'>{data.Win}</span>
          //     </div>
          //     <div className='flex flex-row'>
          //       <span className='-ml-16 lg:ml-9 text-sm' >Loss</span> <span className='ml-5 lg:ml-10 text-sm text-gray-400'>{data.Loss}</span>
          //     </div>
          //   </div>
          // </div>
        );
      })}
    </div>
  );
}

export default AccountOwner;
