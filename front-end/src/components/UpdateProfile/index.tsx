import {
  Avatar,
  Dialog,
  DialogTitle,
  Slide,
  Stack,
  Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import { TransitionProps } from "@mui/material/transitions";
import {
  ArrowSquareUp,
  ClockClockwise,
  FinnTheHuman,
} from "@phosphor-icons/react";
import React, { useRef } from "react";
import { showSnackbar } from "../../redux/slices/contact";
import { toggleProfile, updateAvatar } from "../../redux/slices/profile";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import GalleryDialog from "./GalleryDialog";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UpdateProfile = () => {
  const { profile } = useAppSelector(state => state);
  const dispatch = useAppDispatch();
  const [openGallery, setOpenGallery] = React.useState(false);

  const uploadInputRef = useRef(null);

  const onUploadImage = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      // Create a URL for the selected file
      const filePath = URL.createObjectURL(file);
      // Dispatch the updateAvatar action to update the avatar in the Redux store
      dispatch(updateAvatar(filePath));
      dispatch(toggleProfile());
      dispatch(
        showSnackbar({
          severity: "success",
          message: "Your Avatar changed to what you uploaded",
        })
      );
    }
  };

  const resetInputValue = () => {
    if (uploadInputRef.current) {
      uploadInputRef.current.value = null;
    }
  };
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
              dispatch(updateAvatar(profile.default_avatar));
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
            variant="contained"
            component="label"
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
            Upload
            <input
              type="file"
              ref={uploadInputRef}
              onChange={onUploadImage}
              onClick={resetInputValue}
              accept="image/*"
              hidden
            />
          </Button>
          <Button
            onClick={() => {
              console.log("open galleryss");
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
