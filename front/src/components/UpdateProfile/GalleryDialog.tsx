import { TransitionProps } from "@mui/material/transitions";
import { Shuffle } from "@phosphor-icons/react";
import React from "react";

import {
  Button,
  ButtonProps,
  Dialog,
  Grid,
  Paper,
  Slide,
  Stack,
  styled,
} from "@mui/material";
import { showSnackbar } from "../../redux/slices/contact";
import { toggleProfile, updateAvatar } from "../../redux/slices/profile";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import ScrollBar from "../ScrollBar";
// import { GET_TOP_CHARACTERS } from "../../graphql/Query";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ColorButton = styled(Button)<ButtonProps>(() => ({
  color: "#C7BBD1",
  backgroundColor: "#443263",
  "&:hover": {
    backgroundColor: "darkpurple",
  },
}));

const GalleryDialog = ({ open, handleClose }: any) => {
  const { characters } = useAppSelector(state => state.characters);
  const dispatch = useAppDispatch();

  const handleImageClick = (img: string) => {
    console.log(img);
    dispatch(updateAvatar(img));
    dispatch(toggleProfile());
    handleClose();
    dispatch(
      showSnackbar({
        severity: "success",
        message: "Your Avatar changed to what you uploaded",
      })
    );
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      PaperProps={{
        style: {
          backgroundColor: "#AE9BCD",
          boxShadow: "none",
          margin: "10",
          borderRadius: "35px",
          padding: "12px",
        },
      }}
    >
      <Stack
        direction={"row"}
        alignContent={"center"}
        spacing={3}
        color="#709CE6"
        margin={"50px"}
        display={"block"}
      >
        <ColorButton
          startIcon={<Shuffle size={26} />}
          sx={{
            // margin: " 0 20px",
            width: "100%",
            fontSize: "18px", // Adjust the font size as needed
            padding: "8px 53px", // Adjust the padding as needed
            // neeed to make it center
            backgroundColor: "#806EA9", // Change the background color to purple
            color: "#3D2E5F", // Change the text color to white
            borderRadius: "21px",
            "&:hover": {
              backgroundColor: "#684C83", // Change the background color on hover
              color: "#C7BBD1",
            },
          }}
          variant="contained"
        >
          Random
        </ColorButton>
      </Stack>
      <Stack>
        <Grid sx={{ flexGrow: 1 }} container spacing={2}>
          <ScrollBar>
            <Grid item xs={12}>
              <Grid container justifyContent="center" spacing={2}>
                {characters.map(el => (
                  <Grid key={el.id} item>
                    <Paper
                      sx={{
                        height: 140,
                        width: 100,
                        backgroundImage: `url(${el.image})`,
                        backgroundSize: "cover",
                        cursor: "pointer", // Add a pointer cursor
                      }}
                      onClick={() => handleImageClick(el.image)}
                    ></Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </ScrollBar>
        </Grid>
      </Stack>
    </Dialog>
  );
};

export default GalleryDialog;
