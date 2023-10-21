import { faker } from "@faker-js/faker";
import {
  Button,
  Dialog,
  DialogTitle,
  Grid,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import { CaretLeft } from "@phosphor-icons/react";
import React from "react";
import { toggleDialog, updatedContactInfo } from "../../redux/slices/contact";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";

const SharedMsgs = () => {
  const dispatch = useAppDispatch();
  const { contact } = useAppSelector((store) => store);
  console.log(contact);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Dialog
      open={contact.contactInfos.open}
      onClose={() => {
        dispatch(toggleDialog());
      }}
      aria-describedby="alert-dialog-slide-description"
      PaperProps={{ style: { backgroundColor: "#AE9BCD", borderRadius: "35px" } }}
    >
      {/* ==> title <== */}
      <Stack
        direction={"row"}
        alignItems={"center"}
        p={2}
        // sx={{backgroundColor: "red"}}
        // justifyContent={"space-between"}
      >
        <Button
          onClick={() => {
            dispatch(updatedContactInfo("CONTACT"));
          }}
          startIcon={<CaretLeft />}
        ></Button>
        <DialogTitle sx={{ m: "0", p: "15px 0" }}>{"Shared"}</DialogTitle>
      </Stack>

      {/* ===> body <=== */}
      <Tabs
        sx={{ px: 2, pt: 2 }}
        value={value}
        onChange={handleChange}
        centered
      >
        <Tab label="Photos" />
        <Tab label="Videos" />
      </Tabs>

      <Stack
        sx={{
          height: "800px",
          width: "600px",
          position: "relative",
          flexGrow: 1,
          overflowY: "scroll",
        }}
        p={3}
        spacing={3}
      >
        {(() => {
          switch (value) {
            case 0:
              // images
              return (
                <Grid container spacing={2}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(() => {
                    return (
                      <Grid item xs={4}>
                        <img
                          src={faker.image.avatar()}
                          alt={faker.person.fullName()}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              );
            case 1:
              // videos
              return (
                <Grid container spacing={2}>
                  {[0, 1, 2, 3, 4, 5, 6].map(() => {
                    return (
                      <Grid item xs={4}>
                        <img
                          src={faker.image.avatar()}
                          alt={faker.person.fullName()}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              );
            default:
              break;
          }
        })()}
      </Stack>
    </Dialog>
  );
};

export default SharedMsgs;
