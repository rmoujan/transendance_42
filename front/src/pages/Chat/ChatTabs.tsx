import { Tab as BaseTab, TabProps } from "@mui/base/Tab";
import { TabPanel as BaseTabPanel, TabPanelProps } from "@mui/base/TabPanel";
import { Tabs } from "@mui/base/Tabs";
import { TabsList as BaseTabsList, TabsListProps } from "@mui/base/TabsList";
import { useTheme } from "@mui/system";
import { User } from "@phosphor-icons/react";
import clsx from "clsx";
import * as React from "react";
import { FetchFriends } from "../../redux/slices/app";
import { fetchConverstations } from "../../redux/slices/converstation";
import { FetchProfile } from "../../redux/slices/profile";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import All from "../../sections/All";
import Channels from "../../sections/Channels";
import Friends from "../../sections/Friends";
import Privates from "../../sections/Private";
import { socket, socket_user } from "../../socket";

const resolveSlotProps = (fn: unknown, args: unknown) =>
  typeof fn === "function" ? fn(args) : fn;

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  (props, ref) => {
    const { className, ...other } = props;
    return (
      <BaseTabsList
        ref={ref}
        className={clsx(
          "rounded-t-4xl mx-9 bg-transparent flex font-sans items-center justify-center content-between min-w-tabs-list",
          className
        )}
        {...other}
      />
    );
  }
);

const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(
  (props, ref) => {
    const { className, ...other } = props;
    return (
      <BaseTabPanel
        ref={ref}
        className={clsx(
          " py-5 px-3 bg-[#696693] rounded-[46px] w-full h-full font-sans text-sm",
          className
        )}
        {...other}
      />
    );
  }
);

function useIsDarkMode() {
  const theme = useTheme();
  return theme.palette.mode === "dark";
}

const ChatTabs = () => {
  const isDarkMode = useIsDarkMode();
  const dispatch = useAppDispatch();

  // !!! fetch all conversations with user_is
  const { profile, contact } = useAppSelector((state) => state);
  const { friends } = useAppSelector((state) => state.app);
  React.useEffect(() => {
    if (socket_user) {
      socket_user.on("friendsUpdateChat", (data: any) => {
        dispatch(FetchFriends());
      });
    }
    if (!profile._id) {
      dispatch(FetchProfile());
    }
    if (socket) {
      // console.log(socket?.connected);
      socket.emit("allConversationsDm", { _id: profile._id });
      socket.on("response", (data: any) => {
        // console.log(data);
        dispatch(
          fetchConverstations({ conversations: data, user_id: profile._id })
        );
      });
    }
  }, [profile._id]);
  // !! fetch all conversations with user_id

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <Tabs defaultValue={0}>
        <TabsList>
          <Tab value={0}>
            <User size={21} weight="bold" />
          </Tab>
          <Tab value={1}>All</Tab>
          <Tab value={2}>Private</Tab>
          <Tab value={3}>Channels</Tab>
        </TabsList>
        <TabPanel value={0}>
          <Friends />
        </TabPanel>
        <TabPanel value={1}>
          <All />
        </TabPanel>
        <TabPanel value={2}>
          <Privates />
        </TabPanel>
        <TabPanel value={3}>
          <Channels />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ChatTabs;

const Tab = React.forwardRef<HTMLButtonElement, TabProps>((props, ref) => {
  return (
    <BaseTab
      ref={ref}
      {...props}
      slotProps={{
        ...props.slotProps,
        root: (ownerState) => {
          const resolvedSlotProps = resolveSlotProps(
            props.slotProps?.root,
            ownerState
          );
          return {
            ...resolvedSlotProps,
            className: clsx(
              `font-sans ${
                ownerState.selected
                  ? "text-[#f78562] bg-[#696693]"
                  : "text-[#B7B7C9] bg-[#3D3C65] focus:text-[#EADDFF] hover:bg-[#f78562] hover:text-[#3D3C65]"
              } ${
                ownerState.disabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              } shadow-2xl text-sm -z-1 leading-[1.5] font-semibold w-full py-2.5 px-3 m-1.5 mb-0 border-0 rounded-t-2xl flex justify-center focus:outline-0 focus:shadow-outline-purple-light`,
              resolvedSlotProps?.className
            ),
          };
        },
      }}
    />
  );
});
