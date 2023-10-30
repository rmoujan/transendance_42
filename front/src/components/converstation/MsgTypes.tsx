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


const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "right",
        }}
        {...props}
    />
))(({ theme }) => ({
    "& .MuiPaper-root": {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === "light"
                ? "rgb(55, 65, 81)"
                : theme.palette.grey[300],
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

const ReplyMsg = ({ el }: ReplyProps) => {
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
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const open = Boolean(anchorEl);

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setAnchorEl(null);
    };
    const handleClick = (event: any) => {
        console.log(event.currentTarget);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <CaretDown
                size={20}
                color="#EADDFF"
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
            />
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
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
                    {Message_options.map((e) => (
                        <MenuItem onClick={handleClick}>{e.title}</MenuItem>
                    ))}
                </Stack>
            </Menu>
        </>
    );
};

// ~ this for options in contact list

const MenuOptions = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
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
                id="demo-customized-button"
                aria-controls={open ? "demo-customized-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
            />
            <StyledMenu
                id="demo-customized-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "demo-customized-button",
                }}
                PaperProps={{
                    style: {
                        backgroundColor: "#AE9BCD",
                        boxShadow: "none",
                    },
                }}
            >
                <Stack spacing={1} px={1}>
                    {Contact_menu.map((e) => (
                        <MenuItem onClick={handleClick}>{e.title}</MenuItem>
                    ))}
                </Stack>
            </StyledMenu>
        </IconButton>
    );
};

export { Timeline, TextMsg, MediaMsg, ReplyMsg, MenuOptions };
