import React from "react";


function AboutMe() {
  return (
    <form>
   <div className=" flex flex-col  tablet:w-full mobile:w-full mb-4 border border-gray-200 rounded-2xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
       <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600">
           <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
               <div className="flex items-center space-x-1 sm:pr-4">
                   <button type="button" className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                       <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM13.5 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm3.5 9.5A5.5 5.5 0 0 1 4.6 11h10.81A5.5 5.5 0 0 1 10 15.5Z"/>
                        </svg>
                       <span className="sr-only">Add emoji</span>
                   </button>
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
            <textarea
                id="editor"
                rows={8}
                className="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                placeholder="Write some thing about you ..."
                required
            ></textarea>
        </div>
   </div>
   <button type="submit" className="inline-flex m items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-gradient-to-br from-[#fe764dd3] to-[#ce502ad3] rounded-2xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
       Publish post
   </button>
</form>
  );
}
export default AboutMe;