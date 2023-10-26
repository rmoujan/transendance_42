import React, { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { Shuffle } from "@phosphor-icons/react";
import { TransitionProps } from "@mui/material/transitions";
import { useQuery } from "@apollo/client";

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
import ScrollBar from "../ScrollBar";
import { GET_TOP_CHARACTERS } from "../../graphql/Query";

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
  const { loading, error, data } = useQuery(GET_TOP_CHARACTERS);
  const [clickedImage, setClickedImage] = useState<string | null>(null);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error("GraphQL Error:", error);
    return <p>Error: {error.message}</p>;
  }

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  const characters = data.topCharacters;

  const handleImageClick = (imageUrl: string) => {
    setClickedImage(imageUrl);
    // You can perform any actions related to the clicked image here
    console.log("Clicked Image:", clickedImage);
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
      {/* <Stack
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
                {characters.map((character: any) => (
                  <Grid key={character.id} item>
                    <Paper
                      sx={{
                        height: 240,
                        width: 200,
                        backgroundImage: `url(${character.image_url})`,
                        backgroundSize: "cover",
                        cursor: "pointer", // Add a pointer cursor
                      }}
                      onClick={() => handleImageClick(character.image_url)}
                    >
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </ScrollBar>
        </Grid>
      </Stack> */}
    </Dialog>
  );
};

export default GalleryDialog;
