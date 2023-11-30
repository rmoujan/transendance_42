import React, { FC, useEffect, useRef, useState } from "react";
import axios from "axios";
import { CgSpinner } from "react-icons/cg";
import { showSnackbar } from "../redux/slices/contact";
import { useAppDispatch } from "../redux/store/store";

interface Props {}

const Otpinput: FC<Props> = (): JSX.Element => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loding, setLoding] = useState<boolean>(false);
  const [activeOTPIndex, setActiveOTPIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);
  const dispatch = useAppDispatch();
  function onVerify() {
    const backendURL = "http://localhost:3000/auth/verify-qrcode";
    const data = { inputValue };

    axios
      .post(backendURL, data, { withCredentials: true })
      .then((response) => {
        if (response.data == true) {
          window.location.href = "http://localhost:5173/home";
        } else {
          dispatch(
            showSnackbar({
              severity: "error",
              message: "OTP is not correct",
            })
          );
        }

        setLoding(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoding(false);
      });
    axios.post(
      "http://localhost:3000/profile/verifyOtp",
      { verify: true },
      { withCredentials: true }
    );
  }

  return (
    <div className="relative justify-center flex flex-col m-12 space-y-8 w-200 h-auto pt-5 pb-4 bg-[#3b376041] shadow-2xl rounded-[40px] md:flex-row md:space-y-0 ">
      <div className="relative flex flex-col justify-center p-8 items-center md:p-14">
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
                {}
              </React.Fragment>
            );
          })}
        </div>
        <button
          onClick={onVerify}
          className=" w-1/2  flex gap-1 items-center justify-center py-2.5 font-bold text-white hover:scale-105 duration-300 cursor-pointer bg-gradient-to-br from-[#FE754D] to-[#ce502a] my-3 rounded-full shadow-2xl"
        >
          {loding && <CgSpinner className=" animate-spin" size={20} />}
          <span>Verify OTP</span>
        </button>
      </div>
    </div>
  );
};
export default Otpinput;
