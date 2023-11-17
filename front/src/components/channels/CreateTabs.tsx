import { Tabs } from "@mui/base/Tabs";
import { StyledTab, StyledTabPanel, StyledTabsList } from "../tabs/StyledTabs";
import CreatePrivateForm from "../../sections/Forms/CreatePrivateForm";
import CreateProtectedForm from "../../sections/Forms/CreateProtectedForm";
import CreatePublicForm from "../../sections/Forms/CreatePublicForm";

const CreateTabs = ({ handleClose, el }: any) => {
  return (
    <Tabs defaultValue={0}>
      <StyledTabsList>
        <StyledTab value={0}>Publics</StyledTab>
        <StyledTab value={1}>Protected</StyledTab>
        <StyledTab value={2}>Private</StyledTab>
      </StyledTabsList>
      <StyledTabPanel value={0}>
        <CreatePublicForm handleClose={handleClose} el={el} />
      </StyledTabPanel>
      <StyledTabPanel value={1}>
        <CreateProtectedForm handleClose={handleClose} el={el} />
      </StyledTabPanel>
      <StyledTabPanel value={2}>
        <CreatePrivateForm handleClose={handleClose} el={el} />
      </StyledTabPanel>
    </Tabs>
  );
};

export default CreateTabs;
