import * as React from "react";
import { Stack, Typography } from "@mui/material";

interface NoChatProps {
  [key: string]: unknown; // You can replace this with specific prop types if needed
}

const NoChat: React.FC<NoChatProps> = () => (
    <Stack
    spacing={2}
    sx={{ height: "100%", width: "100%" }}
    alignItems="center"
    justifyContent={"center"}
    // className="shadow-2xl"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={220}
      height={220}
      viewBox="0 0 375 375"
    >
      <defs>
        <clipPath id="a">
          <path d="M72 24.488h284V214H72Zm0 0" />
        </clipPath>
        <clipPath id="b">
          <path d="M19.29 92H304v258.738H19.29Zm0 0" />
        </clipPath>
      </defs>
      <g clipPath="url(#a)">
        <path
          fill="#b7b7c9"
          d="M355.29 94.758v55.445c0 27.992-16.36 52.16-40.04 63.453v-50.918c0-45.125-36.727-81.851-81.863-81.851H89.98c-6.046 0-11.945.66-17.62 1.914 5.663-33.114 34.511-58.313 69.245-58.313h143.407c38.812 0 70.277 31.457 70.277 70.27Zm0 0"
        />
      </g>
      <g clipPath="url(#b)">
        <path
          fill="#fe754d"
          d="M233.387 92.473H89.969c-38.801 0-70.266 31.468-70.266 70.265v55.45c0 38.812 31.465 70.265 70.266 70.265h6.21v62.043l8.9-8.898a181.445 181.445 0 0 1 128.296-53.145c38.813 0 70.266-31.465 70.266-70.265v-55.45c.011-38.797-31.442-70.265-70.254-70.265Zm0 0"
        />
      </g>
    </svg>
    <Typography variant="subtitle2" color={"#b7b7c9"}>
      Select a conversation or start a New one
    </Typography>
  </Stack>
);

export default NoChat;
