import {
  Box,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import Menu, { MenuProps } from "@mui/material/Menu";
import { alpha, styled } from "@mui/material/styles";
import { CaretDown, DotsThreeCircle } from "@phosphor-icons/react";
import React, { useState } from "react";
import { mutedContact, toggleDialog } from "../../redux/slices/contact";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";

const Message_options = [
  {
    title: "Delete Message",
  },
];

const Contact_menu = [
  {
    title: "Info",
  },
  {
    title: "Mute notifications",
  },
  {
    title: "Clear messages",
  },
  {
    title: "Delete Chat",
  },
  {
    title: "Block",
  },
];

interface MenuPropsState extends MenuProps {
  isrtl: boolean;
}
const StyledMenu = styled((props: MenuPropsState) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: props.isrtl ? "left" : "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: props.isrtl ? "right" : "left",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === "light" ? "#B7B7C9" : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

interface ReplyProps {
  incoming: boolean;
  message: string;
  reply: string;
}

const ReplyMsg = ({ el }: any) => {
  return (
    <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: el.incoming ? "#5E4F80" : "#3D2E5F",
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
          <MsgOptions el={el} />
        </Stack>
        <Stack spacing={1}>
          <Stack
            p={2}
            direction={"column"}
            spacing={2}
            alignItems={"center"}
            sx={{ backgroundColor: "#5E4F80", borderRadius: 1 }}
          >
            <Typography variant="body1" sx={{ color: "#000" }}>
              {el.message}
            </Typography>
          </Stack>
          <Typography
            variant="body1"
            sx={{ color: el.incoming ? "#000" : "#EADDFF" }}
          >
            {el.reply}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

const MediaMsg = ({ el }: any) => {
  return (
    <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: el.incoming ? "#5E4F80" : "#3D2E5F",
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
          <MsgOptions el={el} />
        </Stack>
        <Stack spacing={1}>
          <img
            src={el.img}
            alt={el.message}
            style={{ maxHeight: 240, borderRadius: "10px" }}
          />

          <Typography
            variant="body1"
            sx={{ color: el.incoming ? "#000" : "#EADDFF" }}
          >
            {el.message}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

const TextMsg = ({ el }: any) => {
  // console.log(el);
  return (
    // <>{console.log(el)}</>
    <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: el.incoming ? "#B7B7C9" : "#696693",
          borderRadius: "18px",
          width: "max-content",
        }}
      >
        <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
          <MsgOptions el={el} />
        </Stack>
        <Typography
          variant="subtitle1"
          sx={{ color: el.incoming ? "#16132B" : "#16132B" }}
        >
          {el.message}
        </Typography>
      </Box>
    </Stack>
  );
};

const Timeline = ({ el }: any) => {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Divider>
        <Typography variant="caption">{el.text}</Typography>
      </Divider>
    </Stack>
  );
};

// ~ this for options in messages

const MsgOptions = (el: any) => {
  const [conversationMenuanchorEl, setConversationMenuAnchorEl] =
    React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const openConversationMenu = Boolean(conversationMenuanchorEl);

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    setSelectedIndex(index);
    setConversationMenuAnchorEl(null);
  };
  const handleClick = (event: any) => {
    // console.log(event.currentTarget);
    setConversationMenuAnchorEl(event.currentTarget);
  };
  const handleCloseConversationMenu = () => {
    setConversationMenuAnchorEl(null);
  };

  return (
    <>
      <CaretDown
        size={20}
        color="#16132B"
        id="basic-button"
        aria-controls={openConversationMenu ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={openConversationMenu ? "true" : undefined}
        onClick={handleClick}
      />
      <StyledMenu
        id="chat-menu"
        anchorEl={conversationMenuanchorEl}
        open={openConversationMenu}
        onClose={handleCloseConversationMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        PaperProps={{
          style: {
            backgroundColor: "#AE9BCD",
            boxShadow: "none",
          },
        }}
        isrtl={!el.el.incoming}
      >
        {/* {console.log(el.incoming)} */}
        <Stack spacing={2} px={1}>
          {/* u can add hover '&:hover': {
      backgroundColor: "red",
    }, */}
          {/* ***** handle closing ***** */}
          {Message_options.map((e, index) => (
            <MenuItem key={index} onClick={handleCloseConversationMenu}>
              {e.title}
            </MenuItem>
          ))}
        </Stack>
      </StyledMenu>
    </>
  );
};

// ~ this for options in contact list

const MenuOptions = () => {
  const dispatch = useAppDispatch();
  const { contact } = useAppSelector(state => state);

  const [conversationMenuanchorEl, setConversationMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const openConversationMenu = Boolean(conversationMenuanchorEl);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleClick = (event: any) => {
    setConversationMenuAnchorEl(event.currentTarget);
  };

  const handleCloseClick = (event: any, index: number) => {
    setConversationMenuAnchorEl(null);
    setSelectedOption(Contact_menu[index].title);
    console.log(`Selected option: ${Contact_menu[index].title}`, index);
    switch (Contact_menu[index].title) {
      case "Info":
        dispatch(toggleDialog());
        break;
      case "Mute notifications":
        console.log("Mute notifications");
        // ! emit "mute_converstation" event
        dispatch(mutedContact({ room_id: contact.room_id }));
        break;
      case "Clear messages":
        console.log("Clear messages");
        // ! emit "Clear_messages" event
        // socket.emit("clear_contact", { to: _id, from: user_id });
        break;
      case "Delete Chat":
        console.log("Delete Chat");
        break;
      case "Block":
        console.log("Block");
        // ! emit "block_contact" event
        // socket.emit("block_contact", { to: _id, from: user_id });
        break;
      default:
        console.log("default");
        break;
    }
  };

  const handleClose = () => {
    setConversationMenuAnchorEl(null);
  };

  return (
    <IconButton
      size="small"
      sx={{
        backgroundColor: "#3D3C65",
      }}
    >
      <DotsThreeCircle
        size={36}
        color="#B7B7C9"
        id="converstation-positioned-button"
        aria-controls={
          openConversationMenu ? "conversation-positioned-menu" : undefined
        }
        aria-haspopup="true"
        aria-expanded={openConversationMenu ? "true" : undefined}
        onClick={handleClick}
      />
      <StyledMenu
        id="conversation-positioned-menu"
        anchorEl={conversationMenuanchorEl}
        open={openConversationMenu}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "converstation-positioned-button",
        }}
        PaperProps={{
          style: {
            backgroundColor: "#3D3C65",
          },
        }}
        isrtl={true}
      >
        <Stack spacing={1} px={1}>
          {Contact_menu.map((e, index) => (
            <MenuItem
              key={index}
              onClick={event => handleCloseClick(event, index)}
            >
              {e.title}
            </MenuItem>
          ))}
        </Stack>
      </StyledMenu>
    </IconButton>
  );
};

export { MediaMsg, MenuOptions, ReplyMsg, TextMsg, Timeline };
