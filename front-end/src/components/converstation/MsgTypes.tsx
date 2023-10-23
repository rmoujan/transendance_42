import React, { useState } from "react";
import {
  Box,
  Divider,
  Stack,
  Typography,
  IconButton,
  MenuItem,
} from "@mui/material";
import Menu, { MenuProps } from '@mui/material/Menu';
import { alpha, styled } from "@mui/material/styles";
import { CaretDown, DotsThreeCircle } from "@phosphor-icons/react";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { mutedContact, toggleDialog } from "../../redux/slices/contact";

const Message_options = [
  {
    title: "Reply",
  },
  {
    title: "React to message",
  },
  {
    title: "Star message",
  },
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


const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
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
          <MsgOptions />
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
          <MsgOptions />
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
  return (
    // <>{console.log(el)}</>
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
          <MsgOptions />
        </Stack>
        <Typography
          variant="body1"
          sx={{ color: el.incoming ? "#000" : "#EADDFF" }}
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
      <Divider width="46%" sx={{ background: "#3D2E5F" }} />
      <Typography variant="caption">{el.text}</Typography>
      <Divider width="46%" sx={{ background: "#3D2E5F" }} />
    </Stack>
  );
};

// ~ this for options in messages

const MsgOptions = () => {
  const [conversationMenuanchorEl, setConversationMenuAnchorEl] = React.useState(null);
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
    console.log(event.currentTarget);
    setConversationMenuAnchorEl(event.currentTarget);
  };
  const handleCloseConversationMenu = () => {
    setConversationMenuAnchorEl(null);
  };

  return (
    <>
      <CaretDown
        size={20}
        color="#EADDFF"
        id="basic-button"
        aria-controls={openConversationMenu ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={openConversationMenu ? "true" : undefined}
        onClick={handleClick}
      />
      <Menu
        id="basic-menu"
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
      >
        <Stack spacing={1} px={1}>
          {/* u can add hover '&:hover': {
      backgroundColor: "red",
    }, */}
          {/* ***** handle closing ***** */}
          {Message_options.map((e, index) => (
            <MenuItem key={index} onClick={handleCloseConversationMenu}>{e.title}</MenuItem>
          ))}
        </Stack>
      </Menu>
    </>
  );
};

// ~ this for options in contact list

const MenuOptions = () => {

  const dispatch = useAppDispatch();
  const { contact } = useAppSelector((state) => state);


  const [conversationMenuanchorEl, setConversationMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const openConversationMenu = Boolean(conversationMenuanchorEl);
  const [selectedOption, setSelectedOption] = useState<string>('');

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
        dispatch(mutedContact({room_id: contact.room_id}))
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
        backgroundColor: "#8979AC",
      }}
    >
      <DotsThreeCircle
        size={36}
        color="#EADDFF"
        id="converstation-positioned-button"
        aria-controls={openConversationMenu ? "conversation-positioned-menu" : undefined}
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
            backgroundColor: "#AE9BCD",
          },
        }}
      >
        <Stack spacing={1} px={1}>
          {Contact_menu.map((e, index) => (
            <MenuItem key={index} onClick={(event) => handleCloseClick(event, index)}>
              {e.title}
            </MenuItem>
          ))}
        </Stack>
      </StyledMenu>
    </IconButton>
  );
};

export { Timeline, TextMsg, MediaMsg, ReplyMsg, MenuOptions };
