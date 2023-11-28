import { type } from "os";
import React, { FC, useState, useMemo, useRef, useEffect } from "react";
import OtpInput from "react-otp-input";
import { constants } from "buffer";
import { CgSpinner } from "react-icons/cg";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

type User = {
  id_user: number;
  name: string;
  avatar: string;
  TwoFactor: boolean;
  secretKey: string | null;
  status_user: string;
};

const TwoFactor = () => {
  const [twoFactor, setTwoFactor] = useState<User[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [qrCodeDataURL, setQRCodeDataURL] = useState("");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [activeOTPIndex, setActiveOTPIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [loding, setLoding] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("http://localhost:3000/auth/get-user", {
        withCredentials: true,
      });
      setTwoFactor(data);
    };
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await axios.get("http://localhost:3000/auth/get-qrcode", {
      withCredentials: true,
    });
    setQRCodeDataURL(data);
  };
  useEffect(() => {}, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  const toggleTwoFactor = async (user: User) => {
    fetchData();
    setOpen(true);
  };

  const toggleTwoF = async (user: User) => {
    const backURL = "http://localhost:3000/auth/TwoFactorAuth";
    const updatedTwoFactorStatus = !user.TwoFactor;
    const twoFactor = { id_user: user.id_user, enable: updatedTwoFactorStatus };
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
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnChange = (
    { target }: React.ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const { value } = target;
    const newOTP: string[] = [...otp];

    newOTP[index] = value.substring(value.length - 1);
    if (!value) setActiveOTPIndex(index - 1);
    else setActiveOTPIndex(index + 1);
    setOtp(newOTP);
    let newInputValue = "";
    newOTP.forEach((digit) => {
      newInputValue += digit;
    });

    setInputValue(newInputValue);
  };

  function onVerify(user: User) {
    const backendURL = "http://localhost:3000/auth/verify-qrcode";
    const backURL = "http://localhost:3000/auth/TwoFactorAuth";
    const data = { inputValue };
    const updatedTwoFactorStatus = !user.TwoFactor;
    const twoFactor = { id_user: user.id_user, enable: updatedTwoFactorStatus };

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
          setTimeout(() => {
            window.location.href = "/Authentication";
          }, 1000);
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
    setOpen(false);
  }

  return (
    <>
      {twoFactor.map((user) => (
        <div key={user.id_user}>
          {user.TwoFactor ? (
            <button
              className="text-lg bg-[#a73232] rounded-2xl p-3 select-none"
              onClick={() => toggleTwoF(user)}
            >
              Disable Two-Factor(2FA)
            </button>
          ) : (
            <button
              className="text-lg bg-[#7ca732] rounded-2xl p-3 select-none"
              onClick={() => toggleTwoFactor(user)}
            >
              Enable Two-Factor(2FA)
            </button>
          )}
          <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            maxWidth="xl"
            aria-labelledby="responsive-dialog-title"
            sx={{
              p: 5,
              "& .MuiPaper-root": {
                borderRadius: "26px",
              },
            }}
            PaperProps={{
              style: {
                //backgroundColor transparent
                backgroundColor: "transparent",

                borderRadius: "28px",
                // padding: "32px 135px",
              },
            }}
            className="duration-500 backdrop-blur-lg  group-hover:blur-sm hover:!blur-none group-hover:scale-[0.85] hover:!scale-100 cursor-pointer p-8 group-hover:mix-blend-luminosity hover:!mix-blend-normal shadow-2xl"
          >
            <div className="bg-[#8b98e452] h-[65vh]">
              <DialogContent>
                <div className=" flex flex-col justify-center items-center ">
                  <div className="relative justify-center flex flex-col  space-y-8 w-200 h-auto pt-5  rounded-[40px] md:flex-row md:space-y-0 ">
                    <div className="relative flex flex-col justify-center  items-center ">
                      <div className=" text-[#B7B7C9] font-bold text-2xl mb-3 ">
                        Get the App to Scan QR Code
                      </div>
                      <p className=" max-w-[15vw] text-white text-center">
                        First you need to download the Google Authenticator
                        application on your smartphone. This application is
                        available on the App Store and Google Play.
                      </p>
                      <div className=" text-[#B7B7C9] font-bold text-2xl mb-3 ">
                        Scan QR Code
                      </div>
                      <p className=" max-w-[15vw] text-white text-center">
                        Open the Google Authenticator application on your
                        smartphone and scan the QR code below.
                      </p>
                      <div className=" text-[#B7B7C9] font-bold text-2xl mb-3 ">
                        Enter the code
                      </div>
                      <p className=" max-w-[15vw] text-white text-center">
                        Enter the code generated by the Google Authenticator
                        application.
                      </p>
                      <img
                        src={qrCodeDataURL}
                        alt="QRcode"
                        className=" mb-5 rounded-2xl bg-red-400 mt-5"
                      />
                      <div className=" text-[#B7B7C9] font-bold text-2xl mb-3 ">
                        Enter your OTP{" "}
                      </div>
                      <div className="flex flex-row justify-center p-3 md:pl-14 md:pr-14">
                        {otp.map((_, index) => {
                          return (
                            <React.Fragment key={index}>
                              <input
                                ref={index === activeOTPIndex ? inputRef : null}
                                type="number"
                                className="remove-arrow bg-[#B7B7C9] rounded-[10px] w-10 h-10 mr-1 text-[#3b3760] font-bold text-center font-zcool"
                                onChange={(e) => handleOnChange(e, index)}
                                value={otp[index]}
                              />
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onVerify(user)}
                    className=" w-1/2  flex gap-1 items-center justify-center py-2.5 font-bold text-white hover:scale-105 duration-300 cursor-pointer bg-gradient-to-br from-[#FE754D] to-[#ce502a] rounded-full shadow-2xl"
                  >
                    {loding && (
                      <CgSpinner className=" animate-spin" size={20} />
                    )}
                    <span>Verify OTP</span>
                  </button>
                </div>
              </DialogContent>
            </div>
          </Dialog>
        </div>
      ))}
    </>
  );
};
export default TwoFactor;
