import React, { useState, useEffect, useRef } from "react";
import Path from "./Path";
import axios from 'axios';
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { FaLaughBeam } from 'react-icons/fa';
import { func } from "prop-types";
import { set } from "react-hook-form";
// import { IoIosMoon } from 'react-icons/io';
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { showSnackbar } from "../../redux/slices/contact";

type User = {
    id_user: number;
    name: string;
    avatar: string;
    TwoFactor: boolean;
    secretKey: string | null;
    About:string;
    status_user: string;
  };
function AboutMe() {
    const [inputText, setInputText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState('');
    const emojiPickerRef = useRef<HTMLElement | null>(null);
    const dispatch = useAppDispatch();
    const handleSubmit = async (e: React.FormEvent) => {
        axios.post("http://localhost:3000/profile/About", { About: inputText }, { withCredentials: true }).then((res) => {
            console.log("res", res.data);
            // setUser(res.data);
        }
        );
        e.preventDefault();
        try {
            dispatch(showSnackbar({ message: "Your post has been published", type: "success" }));
            console.log('Data saved on the backend:', inputText);
            //cleaning the input
            setInputText('');
        }
        catch (error) {
            dispatch(showSnackbar({ message: "Your post didn't publish", type: "error" }));
            console.error('Error saving data:', error);
        }
    };
    const [user, setUser] = useState<User[]>([]);
    const [About, setAbout] = useState<HTMLTextAreaElement | null>(null);
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputText(e.target.value);
    };

    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const [value, setValue] = useState<string>('');
    
    function handleEmojiClick(emoji: any) {
        const input = inputRef.current;
        console.log("emoji", emoji);
        setInputText(inputText + emoji.native);
        console.log("input", input);
       
        setAbout(input);
        // console.log("emoji", emoji);
        // setSelectedEmoji(emoji.native);
        // setShowEmojiPicker(false);
    }
    // useEffect(() => {
    //     const fetchData = async () => {
    //       const backURL = "http://localhost:3000/profile/About";
    //       console.log("About", About);
    //       axios.post(backURL, About,{ withCredentials: true }).then((res) => {
    //         console.log("res", res.data);
    //         setUser(res.data);
    //       }
    //         );
    //     }
    //   }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            // Remove the event listener when the emoji picker is hidden
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmojiPicker]);
    return (
        <form>
            <div className=" flex flex-col  tablet:w-[20rem] tablet:h-[24rem] mobile:w-full mb-4 border border-gray-200 rounded-2xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600">
                    <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
                        <div className="flex items-center space-x-1 sm:pr-4" ref={emojiPickerRef as any}>
                            {/* <div className={showEmojiPicker ? "inline  fixed mt-[100rem] left-auto" : "hidden"}>
                            <Picker data={data} onEmojiSelect={(emoji: any) => {
                                handleEmojiClick(emoji.native)
                            }}/>
                            </div> */}
                            {showEmojiPicker && (
                                <div className="absolute top-auto mt-96  z-10 left-auto ml-80">
                                    <Picker data={data} onEmojiSelect={(emoji: any) => handleEmojiClick(emoji)} />
                                </div>
                            )}
                            <FaLaughBeam onClick={() =>
                                setShowEmojiPicker((show) => !show)} />

                                
                            {/* <button 
                            type="button"
                            `${}`
                            // onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM13.5 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm3.5 9.5A5.5 5.5 0 0 1 4.6 11h10.81A5.5 5.5 0 0 1 10 15.5Z" />
                                </svg>
                                <span className="sr-only">Add emoji</span>
                            </button> */}
                        </div>
                        <div className="flex flex-wrap items-center space-x-1 sm:pl-4">
                        </div>
                    </div>
                    <div id="tooltip-fullscreen" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                        Show full screen
                        <div className="tooltip-arrow" data-popper-arrow></div>
                    </div>
                </div>
                <div className="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
                    <label htmlFor="editor" className="sr-only">Publish post</label>
                    {/* I love playing pong game! Always up for a challenging match. */}
                    <textarea
                        id="editor"
                        rows={8}
                        className="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                        placeholder="Write some thing about you ..."
                        required
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    ></textarea>
                </div>
            </div>
            
            <button type="submit" className="inline-flex m items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-gradient-to-br from-[#fe764dd3] to-[#ce502ad3] rounded-2xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800" onClick={handleSubmit}>
                Publish post
            </button>
        </form>
    );
}
export default AboutMe;