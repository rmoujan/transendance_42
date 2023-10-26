import {
  Avatar,
  Dialog,
  DialogTitle,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import { TransitionProps } from "@mui/material/transitions";
import {
  ArrowSquareUp,
  ClockClockwise,
  FinnTheHuman,
} from "@phosphor-icons/react";
import React from "react";
import { toggleProfile, updateAvatar } from "../../redux/slices/profile";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import GalleryDialog from "./GalleryDialog";
import { showSnackbar } from "../../redux/slices/contact";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UpdateProfile = () => {
  const { profile } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const [openGallery, setOpenGallery] = React.useState(false);
  return (
    <Dialog
      open={profile.open}
      TransitionComponent={Transition}
      onClose={() => {
        dispatch(toggleProfile());
      }}
      PaperProps={{
        style: {
          backgroundColor: "#AE9BCD",
          borderRadius: "35px",
          padding: "12px",
        },
      }}
      maxWidth={"md"}
    >
      {" "}
      <DialogTitle className="justify-center">
        {"Update the Profile Picture"}
      </DialogTitle>
      <Stack alignItems={"center"} direction={"column"} spacing={2}>
        <Avatar
          alt={profile.name}
          src={profile.avatar}
          sx={{ width: 200, height: 200 }}
        />
        {/* name */}
        <Stack direction={"column"} alignItems={"center"}>
          <Typography variant="h2" color={"#322554"} sx={{ padding: 0 }}>
            {profile.name}
          </Typography>
        </Stack>
      </Stack>
      <Stack
        sx={{
          height: "100%",
          position: "relative",
        }}
        p={3}
        spacing={3}
      >
        <Stack direction={"row"} justifyContent={"center"} spacing={4}>
          <Button
            onClick={() => {
              console.log("default");
              updateAvatar(profile.default_avatar);
              dispatch(toggleProfile());
              dispatch(
                showSnackbar({
                  severity: "success",
                  message: "Your Avatar changed to the default",
                })
              );
            }}
            variant="contained"
            endIcon={<ClockClockwise size={30} />}
            sx={{
              borderRadius: "15px",
              fontSize: "20px",
              padding: "10px 22px",
              color: "#EADDFF",
              backgroundColor: "#322554",
              "&:hover": {
                backgroundColor: "#806EA9",
              },
            }}
          >
            Default
          </Button>
          <Button
            onClick={() => {
              console.log("update");
              // dispatch(toggleProfile());
            }}
            variant="contained"
            endIcon={<ArrowSquareUp size={30} />}
            sx={{
              borderRadius: "15px",
              fontSize: "20px",
              padding: "10px 22px",
              color: "#EADDFF",
              backgroundColor: "#322554",
              "&:hover": {
                backgroundColor: "#806EA9",
              },
            }}
          >
            <VisuallyHiddenInput type="file" />
            Update
          </Button>
          <Button
            onClick={() => {
              console.log("open gallery");
              setOpenGallery(true);
              // dispatch(toggleProfile());
            }}
            variant="contained"
            endIcon={<FinnTheHuman size={30} />}
            sx={{
              borderRadius: "15px",
              fontSize: "20px",
              padding: "10px 22px",
              color: "#EADDFF",
              backgroundColor: "#DF1D1D",
              "&:hover": {
                backgroundColor: "#ef8285",
              },
            }}
          >
            Gallery
          </Button>
        </Stack>
      </Stack>
      {openGallery && (
        <GalleryDialog
          open={openGallery}
          handleClose={() => setOpenGallery(false)}
        />
      )}
    </Dialog>
  );
};

export default UpdateProfile;
