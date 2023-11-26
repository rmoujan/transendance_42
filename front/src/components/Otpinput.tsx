import { type } from "os";
import React, { FC, useState, useMemo, useRef, useEffect } from "react";
// import { RE_DIGIT } from "../constants"
import OtpInput from "react-otp-input";
import { constants } from "buffer";
import { CgSpinner } from "react-icons/cg";
import axios from "axios";
import { Alert } from "@material-tailwind/react";
import { useAppDispatch, useAppSelector } from "../redux/store/store";
import { showSnackbar } from "../redux/slices/contact";

// type Props ={
//   value: string;
//   valueLength: number;
//   onChange: (value: string) => void;
// }

// function Otpinput({value, valueLength, onChange}: Props)
// {
//   const valueItems = useMemo(() =>{
//     const valueArray = value.split('');
//     const items: Array<string> = [];
//     for(let i = 0; i< valueLength; i++){
//       const char = valueArray[i];
//       // const re = new RegExp(/^d+$/);

//       if(RE_DIGIT.test(char)){
//         items.push(char);
//       }else{
//         items.push('');
//       }
//     }
//     return items;
//   }, [value, valueLength]);

//   const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>, idx:number)=>{
//     const target = e.target;
//     let targetValue = target.value;
//     const isTargetValueDigit = RE_DIGIT.test(targetValue);

//     if(!isTargetValueDigit && targetValue !== '')
//     {
//       return;
//     }

//     targetValue = isTargetValueDigit ? targetValue : ' ';

//     const newValue = value.substring(0, idx) + targetValue + value.substring(idx + 1);
//     onChange(newValue);

//     if(!isTargetValueDigit)
//       return;
//     const nextElementSibling = target.nextElementSibling as HTMLInputElement | null;

//     if (nextElementSibling){
//       nextElementSibling.focus();
//     }
//   }

//   return(
//     <div className='relative flex flex-col justify-center p-8 items-center md:p-14'>
//       <div className='flex flex-row justify-center p-3 md:pl-14 md:pr-14'>
//         {valueItems.map((digit, idx) =>(
//           <input
//             key={idx}
//             type="text"
//             inputMode="numeric"
//             autoComplete="one-time-code"
//             pattern="\d{1}"
//             maxLength={6}
//             className='bg-[#B7B7C9] rounded-[10px] w-10 h-10 mr-1'
//             value={digit}
//             onChange={(e) => inputOnChange(e, idx)}
//             />
//         ))}
//         {/* <input type="text" className='bg-[#B7B7C9] rounded-[10px] w-10 h-10 mr-1'/>
//         <input type="text" className='bg-[#B7B7C9] rounded-[10px] w-10 h-10 mr-3'/>
//         <input type="text" className='bg-[#B7B7C9] rounded-[10px] w-10 h-10 mr-1'/>
//         <input type="text" className='bg-[#B7B7C9] rounded-[10px] w-10 h-10 mr-1'/>
//         <input type="text" className='bg-[#B7B7C9] rounded-[10px] w-10 h-10 mr-1'/> */}
//       </div>
//       <button className='font-bold w-1/2 text-white hover:scale-105 duration-300 bg-[#FE754D] p-2 rounded-full mb-3 mt-3'>Verify</button>
//     </div>
//   );
// }
interface Props {}

const Otpinput: FC<Props> = (props): JSX.Element => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loding, setLoding] = useState<boolean>(false);
  const [activeOTPIndex, setActiveOTPIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  // const inputRef = useRef<HTMLInputElement[]>(Array(6).fill(null));
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
    // console.log("newInputValue :");
    // console.log(newInputValue);
    // setInputValue(value);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);
  // const [showAlert, setShowAlert] = useState(false);
  const dispatch = useAppDispatch();
  function onVerify() {
    const backendURL = "http://localhost:3000/auth/verify-qrcode";
    const data = { inputValue };

    // console.log("inputValue : ");
    // console.log(inputValue);
    axios
      .post(backendURL, data, { withCredentials: true })
      .then((response) => {
        // console.log('Response from backend:', response.data);
        //redirect to home page
        console.log(response.data);
        console.log("before redirect");
        if (response.data == true) {
          console.log("redirect to login page");
          window.location.href = "http://localhost:5173/home";
        } else {
          // message error with html code
          console.log("error");
          dispatch(
            showSnackbar({
              severity: "error",
              message: "OTP is not correct",
            })
          );
          // alert("otp is not correct");
          // setShowAlert()
          // <Alert className=" bg-[#ce502a]">otp is not correct.</Alert>
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
  const [qrCodeDataURL, setQRCodeDataURL] = useState("");
  // const lotp = axios.get("http://localhost:3000/auth/get-qrcode")
  // const url = lotp.then((res)=>res.data);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const { data } = await axios.get("http://localhost:3000/auth/get-qrcode", { withCredentials: true });
  //     // const { data } = await axios.get("http://localhost:3000/auth/friends");
  //     // console.log("data");
  //     // console.log(data);
  //     setQRCodeDataURL(data);
  //   };
  //   fetchData();
  //   // fetch('https://fakestoreapi.com/users')
  //   //   .then((res) => res.json())
  //   //   .then((data) => setUsers(data))
  // }, []);
  // console.log(lotp.then((res)=>console.log(res.data)));
  return (
    <div className="relative justify-center flex flex-col m-12 space-y-8 w-200 h-auto pt-5 pb-4 bg-[#3b376041] shadow-2xl rounded-[40px] md:flex-row md:space-y-0 ">
      <div className="relative flex flex-col justify-center p-8 items-center md:p-14">
        {/* <img src={qrCodeDataURL} alt="QRcode" className=" mb-5 rounded-2xl bg-red-400" /> */}
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
          {/* <CgSpinner className=' animate-spin' size={20} /> */}
          <span>Verify OTP</span>
        </button>
        {/* i h-16 w-64 bg-gradient-to-br from-yellow-400 to-yellow-600 items-center rounded-full shadow-2xl cursor-pointer absolute overflow-hidden transform hover:scale-x-110 hover:scale-y-105 transition duration-300 ease-out */}
        {/* felx flex-row items-center justify-center gap-1 font-bold w-1/2 text-white hover:scale-105 duration-300 cursor-pointer bg-gradient-to-br from-[#FE754D] to-[#ce502a] p-2 rounded-full mb-3 mt-3 shadow-2xl */}
      </div>
    </div>
  );
};
export default Otpinput;
