import React from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { styled } from "@mui/material/styles";
import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { ImageSquare, PaperPlaneRight, Smiley } from "@phosphor-icons/react";

const StyledInput = styled(TextField)(() => ({
  "& .MuiInputBase-input": {
    height: "40px",
    paddingTop: "12px",
    paddingBottom: "12px",
    color: "#C7BBD1",
  },
}));

const ChatInput = ({ setOpenEmojis }:any) => {
  return (
    <StyledInput
      fullWidth
      placeholder="Write a message... "
      variant="filled"
      InputProps={{
        disableUnderline: true,
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip title="Photo/Video">
                <IconButton>
                {" "}
                <ImageSquare size={32} color="#C7BBD1" />{" "}
                </IconButton>
            </Tooltip>
            <Tooltip title="Emojis">
            <IconButton
              onClick={() => {
                setOpenEmojis((prev: any) => !prev);
              }}
            >
              {" "}
              <Smiley size={32} color="#C7BBD1" />{" "}
            </IconButton>
                </Tooltip>
                <Tooltip title="Send">

            <IconButton>
              {" "}
              <PaperPlaneRight size={32} color="#C7BBD1" />{" "}
            </IconButton>
                </Tooltip>
          </InputAdornment>
        ),
      }}
    />
  );
};
const Chatbox = () => {
  const [openEmojis, setOpenEmojis] = React.useState(false);
  return (
    <Box sx={{ padding: "16px 24px", width: "100%",background: "#8979AC", WebkitBorderBottomLeftRadius: "25px", WebkitBorderBottomRightRadius: "25px" }}>
      <Stack
        direction="row"
        alignItems={"center"}
        spacing={3}
        sx={{ backgroundColor: "#5E4F80", borderRadius: "23px" }}
      >
        {/* chatinput */}
        <Stack sx={{ width: "100%" }}>
          <Box
            sx={{
              display: openEmojis ? "inline" : "none",
              zIndex: 10,
              position: "fixed",
              bottom: 81,
              right: 100,
            }}
          >
            <Picker data={data} onEmojiSelect={console.log} />
          </Box>
          <ChatInput setOpenEmojis={setOpenEmojis} />
        </Stack>
      </Stack>
    </Box>
  );
};

export default Chatbox;
