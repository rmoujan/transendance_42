import React, { useState } from "react";
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
import { DotsThreeCircle } from "@phosphor-icons/react";
import { toggleDialog } from "../../redux/slices/contact";
import { useAppDispatch } from "../../redux/store/store";

const Contact_menu = [
  {
    title: "Info",
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

const TextMsg = ({ el }: any) => {
  function splitMessageIntoLines(message: any, maxLength: any) {
    const lines = [];
    while (message.length > maxLength) {
      lines.push(message.substring(0, maxLength));
      message = message.substring(maxLength);
    }
    lines.push(message);
    return lines;
  }

  const messageLines = splitMessageIntoLines(el.message, 95);

  return (
    <Stack direction={"row"} justifyContent={el.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: el.incoming ? "#B7B7C9" : "#696693",
          borderRadius: "18px",
          width: "max-content",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ color: el.incoming ? "#16132B" : "#16132B" }}
        >
          {messageLines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
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

const MenuOptions = () => {
  const dispatch = useAppDispatch();

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
    selectedOption
    event
    switch (Contact_menu[index].title) {
      case "Info":
        dispatch(toggleDialog());
        break;
      default:
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
              onClick={(event) => handleCloseClick(event, index)}
            >
              {e.title}
            </MenuItem>
          ))}
        </Stack>
      </StyledMenu>
    </IconButton>
  );
};

export { MenuOptions, TextMsg, Timeline };
