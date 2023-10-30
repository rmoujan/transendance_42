import * as React from "react";
import { Tab as BaseTab, TabProps } from "@mui/base/Tab";
import { TabPanel as BaseTabPanel, TabPanelProps } from "@mui/base/TabPanel";
import { Tabs } from "@mui/base/Tabs";
import { TabsList as BaseTabsList, TabsListProps } from "@mui/base/TabsList";
import { useTheme } from "@mui/system";
import { UserCircle } from "@phosphor-icons/react";
import clsx from "clsx";
import All from "../../sections/All";
import Channels from "../../sections/Channels";
import Friends from "../../sections/Friends";
import Privates from "../../sections/Private";


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
          " py-5 px-3 bg-green-400 dark:bg-[#806EA9] border-slate-200 dark:border-slate-700 rounded-[46px] w-full h-full font-sans text-sm",
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
  return (
    <div className={isDarkMode ? "dark" : ""}>
      <Tabs defaultValue={0}>
        <TabsList>
          <Tab value={0}>
            <UserCircle size={21} />
          </Tab>
          <Tab value={1}>All</Tab>
          <Tab value={2}>Private</Tab>
          <Tab value={3}>Channels</Tab>
        </TabsList>
      {/* 
      * this is for friends
       */}
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
                  ? "text-[#443263] bg-[#806EA9]"
                  : "text-[#806EA9] bg-[#443263] focus:text-[#EADDFF] hover:bg-[#514371B8]"
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
