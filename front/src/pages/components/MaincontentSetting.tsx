import React, { useState, useEffect } from "react";
import Arcan from "../../img/Arcane.png";
import { Data } from "../Data/AccountOwnerData";
import { TbPhotoEdit, TbUserEdit } from "react-icons/tb";
import { motion } from "framer-motion";
import { fadeIn } from "./variants";
import axios from "axios";
import AboutMe from "./AboutMe";
import Cover from "../../img/bg33.png";
import Path from "./Path";
import { da } from "@faker-js/faker";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { showSnackbar } from "../../redux/slices/contact";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Otpinput from "../../components/Otpinput";
import TwoFactor from "../../components/TwoFactor";
import { CgSpinner } from "react-icons/cg";
import astronaut from "../../img/astronaut_.png";
import { url } from "inspector";
import { socket_user, socketuser } from "../../socket";
import { IconButton, Stack, TextField } from "@mui/material";
import { toggleProfile } from "../../redux/slices/profile";
import UpdateProfile from "../../components/UpdateProfile";
import { PencilSimpleLine } from "@phosphor-icons/react";

type User = {
  id_user: number;
  name: string;
  avatar: string;
  TwoFactor: boolean;
  secretKey: string | null;
  About: string;
  status_user: string;
  wins: number;
  losses: number;
  games_played: number;
  Progress: number;
  Wins_percent: number;
  Losses_percent: number;
};
function MaincontentSetting() {
  const { profile } = useAppSelector((state) => state);
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState("");
  const [twoFactor, setTwoFactor] = useState<User[]>([]);
  const [name, setName] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const fetchData = async () => {
    const { data } = await axios.get("http://localhost:3000/auth/get-user", {
      withCredentials: true,
    });
    setTwoFactor(data);
  };
  useEffect(() => {
    if (socket_user == undefined) {
      socketuser();
    }
    fetchData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleUserNameChange = (event: any) => {
    setUserName(event.target.value);
    console.log(userName);
  };

  // const toggleTwoFactor = async (enable: boolean) => {
  //   const backendURL = "http://localhost:3000/auth/TwoFactorAuth";
  //   const data = { enable };
  //   console.log("data");
  //   console.log(data);
  //   axios
  //     .post(backendURL, data, {
  //       withCredentials: true,
  //     })
  //     .then((response) => {
  //       console.log("before redirect");
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  //     console.log("user.TwoFactor here")
  //     const filteredUsers = twoFactor.filter((user) =>
  //     console.log(user.TwoFactor)
  //   );
  // }
  const [open, setOpen] = React.useState(false);
  // const toggleTwoFactor = async (user: User) => {
  //   const updatedTwoFactorStatus = !user.TwoFactor;

  //   // Optimistically update the UI
  //   setTwoFactor((prevUsers) =>
  //     prevUsers.map((u) => (u.id_user === user.id_user ? { ...u, TwoFactor: updatedTwoFactorStatus } : u))
  //   );

  //   const backendURL = "http://localhost:3000/auth/TwoFactorAuth";
  //   const data = { id_user: user.id_user, enable: updatedTwoFactorStatus };

  //   try {
  //     const response = await axios.post(backendURL, data, {
  //       withCredentials: true,
  //     });

  //     console.log("Backend response:", response.data);

  //     // You can handle the response here as needed.
  //   } catch (error) {
  //     console.error("Error:", error);

  //     // If there's an error, revert the UI back to the previous state
  //     setTwoFactor((prevUsers) =>
  //       prevUsers.map((u) => (u.id_user === user.id_user ? { ...u, TwoFactor: !updatedTwoFactorStatus } : u))
  //     );
  //   }
  // }

  const toggleTwoFactor = async (user: User) => {
    const updatedTwoFactorStatus = !user.TwoFactor;

    setOpen(true);
    // Optimistically update the UI
    // setTwoFactor((prevUsers) =>
    //   prevUsers.map((u) =>
    //     u.id_user === user.id_user
    //       ? { ...u, TwoFactor: updatedTwoFactorStatus }
    //       : u
    //   )
    // );

    // const backendURL = "http://localhost:3000/auth/TwoFactorAuth";
    // const data = { id_user: user.id_user, enable: updatedTwoFactorStatus };

    // try {
    //   const response = await axios.post(backendURL, data, {
    //     withCredentials: true,
    //   });

    //   console.log("Backend response:", response.data);

    //   // You can handle the response here as needed.
    // } catch (error) {
    //   console.error("Error:", error);

    //   // If there's an error, revert the UI back to the previous state
    //   setTwoFactor((prevUsers) =
    //     prevUsers.map((u) =>
    //       u.id_user === user.id_user
    //         ? { ...u, TwoFactor: !updatedTwoFactorStatus }
    //         : u
    //     )
    //   );
    // }
  };

  const EditProfileName = async () => {
    const backendURL = "http://localhost:3000/profile/modify-name";
    const data = { name };

    try {
      const response = await axios.post(backendURL, data, {
        withCredentials: true,
      });

      if (response.status === 200) {
        console.log("Name updated successfully");
        // Update your UI with the new name if needed.
      } else if (response.status === 400) {
        console.error("Name already exists. Handle this error appropriately.");
        // Update your UI to display an error message to the user if needed.
      }
      // console.log("Name updated successfully");
      // Update your UI with the new name if needed.
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const dispatch = useAppDispatch();

  const Save = async () => {
    const backendURLName = "http://localhost:3000/profile/modify-name";
    const backendURLPhoto = "http://localhost:3000/profile/modify-photo";
    const formData = new FormData();
    const dataName = { name };
    const dataPhoto = { photo };

    formData.append("name", name);
    if (photo) {
      formData.append("photo", photo);
    }
    if (name) {
      try {
        const responseName = await axios
          .post(backendURLName, dataName, {
            withCredentials: true,
          })
          .then((response) => {
            console.log("response name =======================", response.data);
          });
        dispatch(
          showSnackbar({
            severity: "success",
            message: "Name updated successfully",
          })
        );
        console.log("response name =======================");
        //clear input name
        setName("");
        console.log("Name updated successfully");
      } catch (error) {
        dispatch(
          showSnackbar({
            severity: "error",
            message: "Name updated failed",
          })
        );
        setName("");
        // console.error("Error:", error);
      }
    }
    if (photo) {
      try {
        const responsePhoto = await axios.post(backendURLPhoto, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        dispatch(
          showSnackbar({
            type: "success",
            message: "Photo updated successfully",
          })
        );
        console.log("Photo updated successfully");
      } catch (error) {
        dispatch(
          showSnackbar({
            severity: "error",
            message: "Photo updated failed",
          })
        );
        console.error("Error:", error);
      }
    }
    fetchData();
  };

  const [p, setP] = useState<string | undefined>(undefined);
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the first selected file
    const selectedFile = e.target.files && e.target.files[0];
    console.log("selectedFile");
    console.log(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataURL = e.target?.result as string;
        setP(dataURL);

        console.log("dataURL");
        console.log(dataURL);
      };
      reader.readAsDataURL(selectedFile);
    }
    console.log("p");
    console.log(p);

    if (e.target.files) {
      setPhoto(e.target.files[0]);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [inputValue, setInputValue] = useState<string>("");
  const [loding, setLoding] = useState<boolean>(false);

  function onVerify(user: User) {
    const backendURL = "http://localhost:3000/auth/verify-qrcode";
    const backURL = "http://localhost:3000/auth/TwoFactorAuth";
    const data = { inputValue };
    const updatedTwoFactorStatus = !user.TwoFactor;
    const twoFactor = { id_user: user.id_user, enable: updatedTwoFactorStatus };

    console.log("inputValue : ");
    console.log(inputValue);
    console.log("updatedTwoFactorStatus : ");
    console.log(updatedTwoFactorStatus);
    console.log("user.TwoFactor : ");
    console.log(user.TwoFactor);
    axios
      .post(backendURL, data, { withCredentials: true })
      .then((response) => {
        if (response.data == true) {
          console.log("redirect to login page");
          setTwoFactor((prevUsers) =>
            prevUsers.map((u) =>
              u.id_user === user.id_user
                ? { ...u, TwoFactor: updatedTwoFactorStatus }
                : u
            )
          );
          axios.post(backURL, twoFactor, {
            withCredentials: true,
          });
        } else {
          // message error with html code
          console.log("error");
          setTwoFactor((prevUsers) =>
            prevUsers.map((u) =>
              u.id_user === user.id_user
                ? { ...u, TwoFactor: !updatedTwoFactorStatus }
                : u
            )
          );
          alert("otp is not correct");
        }
        setLoding(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoding(false);
      });
    // setLoding(true);
    // setTimeout(()=>{
    //   setLoding(false);
    // }, 2000)
  }

  return (
    <>
      {twoFactor.map((data) => {
        return (
          <section
            key={data.id_user}
            className="overflow-scroll resultUserContainer text-gray-600 body-font   w-full"
          >
            <div className="container px-5 py-24 mx-auto">
              <div className="flex flex-col items-center lg-laptop:items-stretch  lg-laptop:flex-row -m-4 justify-center  ">
                <motion.div
                  variants={fadeIn("right", 0.2)}
                  initial="hidden"
                  whileInView={"show"}
                  viewport={{ once: false, amount: 0.7 }}
                  className="p-4 lg-laptop:w-1/3 w-full"
                >
                  <div className="flex justify-center text-white text-xl tablet:text-4xl font-PalanquinDark mb-10">
                    Account Setting
                  </div>
                  <div className="h-full min-w-[22vh] -ml-4 tablet:ml-0 tablet:min-w-[40vh] lg-laptop:!min-w-[20vh]  bg-gradient-to-tr from-[#3F3B5B] via-[#2A2742] to-[#302c4bc7] shadow-2xl p-8 rounded-[46px]  ">
                    <div
                      className="flex flex-col justify-center items-center bg-slate-500 bg-cover rounded-2xl"
                      title="object-center"
                      style={{
                        backgroundImage: `url(${Cover})`,
                      }}
                    >
                      <img
                        className=" flex items-end justify-end mobile:w-20 mobile:h-20 tablet:w-20 tablet:h-20 mt-10  p-0.5 rounded-full ring-4 ring-gray-300 dark:ring-[#3b3c5a]"
                        src={data.avatar}
                        alt={data.name}
                      />
                    </div>
                    <div className=" flex flex-col  items-center mt-8">
                      <span className=" font-Lalezar font-bold text-4xl  text-white">
                        {data.name}
                      </span>
                      <div className=" justify-center hidden tablet:block items-center mb-3 text-sm px-4 md:w-80 bg-transparent rounded-3xl p-4">
                        <div className=" flex flex-row justify-center items-center">
                          <div className="flex flex-col items-center font-semibold mr-4">
                            <div className=" text-xl text-white font-bold font-PalanquinDark">
                              {data.games_played}
                            </div>
                            <div className="text-sm text-[#A3AED0]">
                              Games Played
                            </div>
                          </div>
                          <div className="w-px h-10 bg-[#A3AED0] rotate-180 transform origin-center"></div>

                          <div className="flex flex-col items-center font-semibold mx-4 ">
                            <div className=" text-xl text-white font-bold font-PalanquinDark">
                              {data.Wins_percent} %
                            </div>
                            <div className="text-sm text-[#A3AED0]">Win</div>
                          </div>
                          <div className="w-px h-10 bg-[#A3AED0] rotate-180 transform origin-center"></div>

                          <div className="flex flex-col items-center font-semibold mx-4">
                            <div className=" text-xl text-white font-bold font-PalanquinDark">
                              {data.Losses_percent} %
                            </div>
                            <div className="text-sm text-[#A3AED0]">Loss</div>
                          </div>
                        </div>
                      </div>
                      {/* <div className=" flex flex-row text-white items-center text-center">
                        <TbUserEdit className="text-2xl" />
                        <input
                          className="bg-transparent border-2 border-white rounded-2xl p-2 ml-3 w-40  text-white"
                          type="text"
                          placeholder="Edit Profile Name"
                          onClick={EditProfileName}

                        />
                      </div> */}
                      <div className="flex flex-row text-white items-center text-center">
                        <TbUserEdit className="text-2xl" />
                        <input
                          className="bg-transparent border-2 border-white rounded-2xl p-2 ml-3 w-40 text-white"
                          type="text"
                          placeholder="Edit Profile Name"
                          value={name} // Make sure to bind the input value to a state variable
                          onChange={(e) => setName(e.target.value)} // Handle the name change
                        />
                      </div>
                      {/* <button
                        className="flex justify-center items-center text-white text-lg bg-[#7ca732] rounded-2xl p-3 px-5 mt-5"
                        onClick={EditProfileName}
                      >
                        Save
                      </button> */}
                      {/* Hafid TODO: here's where i change in this code */}
                      <Stack direction={"row"} spacing={2} p={2}>
                        <IconButton
                          aria-label="upload image"
                          size="large"
                          onClick={() => {
                            console.log(
                              "this where it should show profile photo"
                            );
                            console.log(profile);
                            dispatch(toggleProfile());
                          }}
                        >
                          <TbPhotoEdit className="text-4xl text-[#B7B7C9]" />
                        </IconButton>

                        <IconButton
                          aria-label="change-user-name"
                          size="large"
                          onClick={handleEditClick}
                        >
                          <PencilSimpleLine
                            size={36}
                            weight="bold"
                            color="#B7B7C9"
                          />
                        </IconButton>

                        {isEditing && (
                          <TextField
                            // className="bg-transparent border-2 border-white rounded-2xl p-2 ml-3 w-40 text-white"
                            label="Edit Profile Name"
                            variant="outlined"
                            value={userName}
                            onChange={handleUserNameChange}
                            sx={{
                              "& .MuiInputLabel-root": {
                                color: "#B7B7C9",
                                fontWeight: "bold",
                              },
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "#B7B7C9",
                                  borderWidth: "2px",
                                  fontWeight: "bold",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#B7B7C9",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#B7B7C9",
                                },
                              },
                              "& .MuiInputBase-input": {
                                color: "#B7B7C9", // Color of the text
                                fontWeight: "bold",
                              },
                              "& .MuiInputBase-input::placeholder": {
                                color: "#B7B7C9",
                                fontWeight: "bold",
                              },
                            }}
                          />
                        )}
                      </Stack>
                      {/* Hafid TODO: here's where i change in this code */}
                      <div className=" flex flex-row text-white items-center text-center mt-5">
                        <TbPhotoEdit className="text-2xl" />
                        <div className=" ml-3 text-lg w-72 text-center items-center p-2 border-2 border-white max-w-[200px] overflow-hidden rounded-2xl">
                          <input type="file" onChange={handlePhotoChange} />
                        </div>
                        {/* <input type="file" onChange={handlePhotoChange} /> */}
                      </div>
                      <button
                        className=" flex justify-center items-center text-white text-lg bg-[#7ca732] hover:bg-[#5c782d] rounded-2xl p-3 px-5 mt-5"
                        onClick={Save}
                      >
                        Save
                      </button>
                      <div className=" flex flex-row text-white items-center text-center mt-5">
                        {/* {photo && <img src={p} alt="User Photo" />} */}
                        {/* <img class="h-full w-full rounded-full " src="/Volumes/TOSHIBA EXT/last_transcendence/front-end/src/uploads/Group 11.png" alt=""> */}

                        {/* <button className=" text-lg bg-slate-600 rounded-2xl p-3" onClick={handelTwoFactor}>TwoFactor </button> */}
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  variants={fadeIn("left", 0.2)}
                  initial="hidden"
                  whileInView={"show"}
                  viewport={{ once: false, amount: 0.7 }}
                  className="p-4  tablet:w-1/3 w-full lg-laptop:space-x-10"
                >
                  <div className=" flex justify-center text-white text-xl tablet:text-4xl font-PalanquinDark mb-10 ml-10">
                    Help
                  </div>
                  <div className="h-full tablet:min-w-[40vh] lg-laptop:min-w-[16vw] lg-laptop:min-h-[30vh]  bg-gradient-to-tr from-[#3F3B5B] via-[#2a2742af] to-[#454069c7] shadow-2xl  p-8 rounded-[46px]">
                    <div className="leading-relaxed mb-6 text-[#A3AED0]">
                      <div
                        className="relative justify-center bg-cover"
                        style={{
                          backgroundImage: `url(${astronaut})`,
                          backgroundSize: "80% 100%",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                          // opacity: "0.4",
                        }}
                      >
                        <div className="">
                          <h2 className="text-center text-white  font-PalanquinDark">
                            How to Play ft_transcendence
                          </h2>
                          <p>
                            Welcome to Ping Pong Game, a real-time online pong
                            contest. Here's a quick guide on how to play the
                            game:
                          </p>

                          <h3 className="text-center text-white  font-PalanquinDark">
                            Objective
                          </h3>
                          <p>
                            Your goal is to score points by hitting the ball
                            past your opponent's paddle while defending your own
                            goal.
                          </p>

                          <h3 className="text-center text-white  font-PalanquinDark">
                            Controls
                          </h3>
                          <p>Use the following controls to play the game:</p>
                          <ul>
                            <li>
                              <strong>Player 1:</strong> W (Move Up) and S (Move
                              Down)
                            </li>
                            <li>
                              <strong>Player 2:</strong> Up Arrow (Move Up) and
                              Down Arrow (Move Down)
                            </li>
                          </ul>
                          <h3 className="text-center text-white  font-PalanquinDark">
                            Chat
                          </h3>
                          <p>
                            Feel free to use the real-time chat to communicate
                            with other players during the game.
                          </p>

                          <p>
                            Now that you know the basics, get out there and
                            enjoy a game!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  variants={fadeIn("right", 0.2)}
                  initial="hidden"
                  whileInView={"show"}
                  viewport={{ once: false, amount: 0.7 }}
                  className="p-4 laptop:w-3/4 lg-laptop:w-1/3  w-full lg-laptop:space-x-10"
                >
                  <div className="flex  justify-start  mobile:ml-10 lg-laptop:justify-center  text-white text-xl tablet:text-4xl font-PalanquinDark mb-10  lg-laptop:ml-11">
                    About me
                  </div>
                  {/* <div className=" flex justify-start items-start lg-laptop:justify-center lg-laptop:items-center"> */}
                  <div className="flex  justify-center h-full bg-gradient-to-tr tablet:w-[50%]  lg-laptop:w-full from-[#3F3B5B] via-[#2a2742af] to-[#454069c7] shadow-2xl p-4  tablet:p-8 rounded-[46px]">
                    <AboutMe />
                    {/* <p className="leading-relaxed mb-6 text-[#A3AED0]">
                        Synth chartreuse iPhone lomo cray raw denim brunch
                        everyday carry neutra before they sold out fixie 90's
                        microdosing. Tacos pinterest fanny pack venmo,
                        post-ironic heirloom try-hard pabst authentic iceland.
                      </p> */}
                    {/* </div> */}
                  </div>
                </motion.div>
              </div>
              <motion.div
                variants={fadeIn("up", 0.2)}
                initial="hidden"
                whileInView={"show"}
                viewport={{ once: false, amount: 0.7 }}
              >
                <div className=" flex justify-center items-center text-white font-bold text-xl tablet:text-4xl mt-32 mb-10">
                  Two Factor Authentication
                </div>
                <div className="flex justify-center items-center">
                  <div className=" h-full  bg-gradient-to-tr from-[#3F3B5B] via-[#2a2742af] to-[#454069c7]  shadow-2xl  p-8 rounded-[46px] max-w-3xl">
                    <div
                      className="flex justify-center items-center p-4 mb-4 text-sm rounded-2xl text-white bg-blue-300 dark:bg-gray-800  dark:text-blue-400"
                      role="alert"
                    >
                      <svg
                        className="fill-current w-4 h-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
                      </svg>

                      <span className="sr-only">Two Factor</span>
                      <div>
                        Secure your account with{" "}
                        <span className="underline">
                          Two-Factor Authentication
                        </span>
                        .
                        {/* <span className=" font-bold">Two-Factor</span> is not enabled on your account. <span className="underline">Enable</span> it now to secure your account. */}
                      </div>
                    </div>
                    <div className=" flex justify-center items-center text-[#A3AED0] mb-5">
                      Two Factor Authentication improves the security of your
                      account by requiring a unique code from an app on your
                      mobile device each time you sign in. You can use Google
                      Authenticator or Authy to generate the code.
                    </div>
                    <div className=" flex justify-center items-center">
                      <div className=" flex flex-row text-white items-center text-center mt-2">
                        <TwoFactor />
                      </div>
                      {/* <button className=" flex justify-center items-center text-white text-lg bg-[#7ca732] rounded-2xl p-3 " onClick={handelTwoFactor}>
                        Enable Two-Factor(2FA)
                      </button> */}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        );
      })}
      {profile.open && <UpdateProfile />}
    </>
  );
}

export default MaincontentSetting;

// import React, { useState } from 'react';
// import Arcan from '../../img/Arcane.png';
// import { Data } from '../Data/AccountOwnerData';
// import { TbPhotoEdit, TbUserEdit } from 'react-icons/tb';
// import { motion } from 'framer-motion';
// import { fadeIn } from './variants';

// function MaincontentSetting() {
//   const [editMode, setEditMode] = useState(false);
//   const [newAvatar, setNewAvatar] = useState<File | null>(null);

//   const toggleEditMode = () => {
//     setEditMode(!editMode);
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files && event.target.files[0];
//     if (file && file.type.startsWith('image/')) {
//       // Validate that the selected file is an image
//       setNewAvatar(file);
//     } else {
//       // Handle invalid file type or no file selected
//       setNewAvatar(null);
//     }
//   };

//   const getCurrentAvatar = () => {
//     if (editMode && newAvatar) {
//       return URL.createObjectURL(newAvatar); // Show the new avatar when in edit mode
//     }
//     return Arcan; // Show the current avatar otherwise
//   };

//   return (
//     <>
//       {Data.map((data) => {
//         return (
//           <>
//             <section className="text-gray-600 body-font w-full">
//               <div className="container px-5 py-24 mx-auto">
//                 <div className="flex flex-wrap -m-4 justify-center">
//                   <motion.div
//                     variants={fadeIn('right', 0.2)}
//                     initial="hidden"
//                     whileInView={'show'}
//                     viewport={{ once: false, amount: 0.7 }}
//                     className="p-4 md:w-1/3 w-full"
//                   >
//                     <div className="text-white text-4xl font-PalanquinDark mb-10">
//                       Account Setting{' '}
//                     </div>
//                     <div className="h-full bg-gradient-to-tr from-[#3F3B5B] via-[#2A2742] to-[#302c4bc7] shadow-2xl p-8 rounded-[46px]">
//                       <div className="flex flex-col justify-center items-center">
//                         <div className="relative">
//                           <img
//                             className="w-28 h-28 p-1 rounded-full ring-4 ring-gray-300 dark:ring-[#3b3c5a]"
//                             src={getCurrentAvatar()}
//                             alt=""
//                             onClick={toggleEditMode}
//                           />
//                           {editMode && (
//                             <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
//                               <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleFileChange}
//                               />
//                             </div>
//                           )}
//                         </div>
//                         <span className="font-Lalezar font-bold text-4xl mt-5 text-white">
//                           Jinx
//                         </span>
//                         <div  onClick={toggleEditMode}>upload </div>
//                       </div>
//                       {/* ... Other content ... */}
//                     </div>
//                   </motion.div>
//                   {/* ... Other sections ... */}
//                 </div>
//               </div>
//             </section>
//           </>
//         );
//       })}
//     </>
//   );
// }

// export default MaincontentSetting;
