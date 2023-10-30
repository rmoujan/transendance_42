import React, { useState, useEffect, useRef } from 'react';
// import { Picker } from 'emoji-mart';
// import 'emoji-mart/css/emoji-mart.css';
import { FaLaughBeam } from 'react-icons/fa';
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

function AboutMe() {
  const [inputText, setInputText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Data saved on the backend:', inputText);
  };

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLElement | null>(null);

  const handleEmojiClick = (emoji: any) => {
    setSelectedEmoji(emoji.native);
    setShowEmojiPicker(false);
  };

  const [selectedEmoji, setSelectedEmoji] = useState('');

  // Add an event listener to close the emoji picker when clicking outside the picker box
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    // Add the event listener when the emoji picker is shown
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
      <div className="flex flex-col tablet:w-[20rem] tablet:h-[24rem] mobile:w-full mb-4 border border-gray-200 rounded-2xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
        <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600">
          <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
            <div className="flex items-center space-x-1 sm:pr-4" ref={emojiPickerRef as any}>
              {showEmojiPicker && (
                <div className="absolute mt-10 left-0 z-10">
                  <Picker data={data} onEmojiSelect={(emoji: any) => handleEmojiClick(emoji)} />
                </div>
              )}
              <FaLaughBeam onClick={() => setShowEmojiPicker((show) => !show)} />
            </div>
          </div>
          <div id="tooltip-fullscreen" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark-bg-gray-700">
            Show full screen
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
        <div className="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
          <label htmlFor="editor" className="sr-only">Publish post</label>
          <textarea
            id="editor"
            rows={8}
            className="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
            placeholder="Write something about yourself..."
            required
            value={inputText + selectedEmoji}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
        </div>
      </div>
      <button type="submit" className="inline-flex m items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-gradient-to-br from-[#fe764dd3] to-[#ce502ad3] rounded-2xl focus:ring-4 focus:-ring-blue-200 dark:focus:ring-blue-900 hover-bg-blue-800" onClick={handleSubmit}>
        Publish post
      </button>
    </form>
  );
}

export default AboutMe;
