import { Tabs } from "@mui/base/Tabs";
import { StyledTab, StyledTabPanel, StyledTabsList } from "../tabs/StyledTabs";
import JoinPublicForm from "../../sections/Forms/JoinPublicForm";
import JoinProtectedForm from "../../sections/Forms/JoinProtectedForm";

export default function JoinTabs({ handleClose }: any) {
  return (
    <Tabs defaultValue={0}>
      <StyledTabsList>
        <StyledTab value={0}>Publics</StyledTab>
        <StyledTab value={1}>Protected</StyledTab>
      </StyledTabsList>
      <StyledTabPanel value={0}>
        <JoinPublicForm handleClose={handleClose} />
      </StyledTabPanel>
      <StyledTabPanel value={1}>
        <JoinProtectedForm handleClose={handleClose} />
      </StyledTabPanel>
    </Tabs>
  );
}