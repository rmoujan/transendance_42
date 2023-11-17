import React, { useRef } from 'react'
import { Scrollbar } from "smooth-scrollbar-react";
import type { Scrollbar as BaseScrollbar } from "smooth-scrollbar/scrollbar";

function ScrollBar({children}:any) {
    const scrollbar = useRef<BaseScrollbar | null>(null);
    const overscrollConfig: any = {
        effect: 'bounce', // Define the overscroll effect
      };
  return (
    <Scrollbar
    className="bg-red"
      ref={scrollbar}
      plugins={{
        overscroll: overscrollConfig,
      }}
    >
      {children}
    </Scrollbar>
  )
}

export default ScrollBar;