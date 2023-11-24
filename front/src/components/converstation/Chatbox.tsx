import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { PaperPlaneRight, Smiley } from "@phosphor-icons/react";
import React, { useRef, useState } from "react";
import { useAppSelector } from "../../redux/store/store";
import { socket } from "../../socket";

const StyledInput = styled(TextField)(() => ({
  "& .MuiInputBase-input": {
    height: "40px",
    paddingTop: "12px",
    paddingBottom: "12px",
    fontSize: "19px",
    color: "#fff",
  },
}));

const ChatInput = ({ setOpenEmojis, setValue, value, inputRef }: any) => {
  const { contact, profile } = useAppSelector(state => state);
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      // Prevent the default behavior of "Enter" key in a textarea
      event.preventDefault();
      // console.log(contact.room_id);
      // console.log(profile._id);
      if (!value) return;
      socket.emit(
        contact.type_chat === "individual"
          ? "direct_message"
          : "channel_message",
        {
          message: linkify(value),
          from: profile._id,
          to: contact.room_id,
        }
      );
      setValue("");
    }
  };
  return (
    <StyledInput
      inputRef={inputRef}
      value={value}
      onChange={event => {
        setValue(event.target.value);
      }}
      onKeyDown={handleKeyPress} // Attach the key press event handler
      fullWidth
      placeholder="Write a message... "
      variant="filled"
      InputProps={{
        disableUnderline: true,
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip title="Emojis">
              <IconButton
                onClick={() => {
                  setOpenEmojis((prev: any) => !prev);
                }}
              >
                {" "}
                <Smiley size={32} color="#B7B7C9" />{" "}
              </IconButton>
            </Tooltip>
            <Tooltip title="Send">
              <IconButton>
                {" "}
                <PaperPlaneRight
                  size={32}
                  color="#B7B7C9"
                  onClick={() => {
                    // console.log(contact.room_id);
                    // console.log(profile._id);
                    if (!linkify(value)) return;
                    const _id = parseInt(contact.room_id.toString());
                    // console.log(contact.type_chat);
                    socket.emit(
                      contact.type_chat === "individual"
                        ? "direct_message"
                        : "channel_message",
                      {
                        message: linkify(value),
                        // conversation_id: room_id,
                        from: profile._id,
                        to: _id,
                        // type: containsUrl(v›alue) ? "Link" : "Text",
                      }
                    );
                    setValue("");
                  }}
                />{" "}
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
      }}
    />
  );
};

function linkify(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(
    urlRegex,
    url => `<a href="${url}" target="_blank">${url}</a>`
  );
}

const Chatbox = () => {
  const [openEmojis, setOpenEmojis] = React.useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  function handleEmojiClick(emoji: any) {
    const input = inputRef.current;
    // console.log("emoji", emoji);
    setValue(value + emoji);
    // console.log("input", input);

    // if (input) {
    //   const selectionStart = input.selectionStart;
    //   const selectionEnd = input.selectionEnd;

    //   setValue(
    //     value.substring(0, selectionStart) +
    //     emoji +
    //     value.substring(selectionEnd)
    //   );

    //   // Move the cursor to the end of the inserted emoji
    //   input.selectionStart = input.selectionEnd = selectionStart + 1;
    // }
  }

  return (
    <Box
      sx={{
        padding: "16px 24px",
        width: "100%",
        background: "#696693",
        WebkitBorderBottomLeftRadius: "25px",
        WebkitBorderBottomRightRadius: "25px",
      }}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        spacing={3}
        sx={{ backgroundColor: "#3D3C65", borderRadius: "21px" }}
      >
        {/* chatinput */}
        <Stack
          sx={{
            width: "100%",
            "&.css-18plez3-MuiInputBase-root-MuiFilledInput-root": {
              borderRadius: "51px",
            },
          }}
        >
          <Box
            sx={{
              display: openEmojis ? "inline" : "none",
              zIndex: 10,
              position: "fixed",
              bottom: 160,
              left: "72%",
            }}
          >
            <Picker
              data={data}
              onEmojiSelect={(emoji: any) => {
                handleEmojiClick(emoji.native);
                setOpenEmojis(false);
              }}
            />
          </Box>
          <ChatInput
            setOpenEmojis={setOpenEmojis}
            setValue={setValue}
            value={value}
            inputRef={inputRef}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default Chatbox;
