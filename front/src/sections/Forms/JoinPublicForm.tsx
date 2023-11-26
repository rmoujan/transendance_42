import { faker } from "@faker-js/faker";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Avatar,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { FetchChannels } from "../../redux/slices/channels";
import { showSnackbar } from "../../redux/slices/contact";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";

interface Option {
  id_channel: number;
  name: string;
  visibility: string;
  password: string;
}

interface JoinPublicFormData {
  mySelect: Option; // Store the selected option object
}

const JoinPublicForm = ({ handleClose }: any) => {
  const dispatch = useAppDispatch();
  const { publicChannels, channels } = useAppSelector(
    (state) => state.channels
  );
  // console.log(channels);
  // console.log(publicChannels);

  const schema = Yup.object().shape({
    mySelect: Yup.object().shape({
      name: Yup.string().required("Channel is required"),
      visibility: Yup.string(),
      id_channel: Yup.number(),
    }),
  });

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      mySelect: {
        id_channel: 0,
        name: "",
        visibility: "",
      },
    },
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const onSubmit = async (data: JoinPublicFormData) => {
    try {
      // Access the selected option value and label from the form data
      const sendData = {
        id_channel: data.mySelect.id_channel,
        name: data.mySelect.name,
        visibility: data.mySelect.visibility,
        password: data.mySelect?.password,
      };
      console.log("DATA", data.mySelect);
      const res: any = await axios.post(
        "http://localhost:3000/channels/join",
        { sendData },
        { withCredentials: true }
      );
      // Call API with form data, including the selected channel value and label
      if (res.data === true) {
        dispatch(
          showSnackbar({
            severity: "success",
            message: `You joined ${data.mySelect.name} successfully`,
          })
        );
        dispatch(FetchChannels());
        handleClose();
      } else {
        dispatch(
          showSnackbar({
            severity: "error",
            message: `Failed to join ${data.mySelect.name}`,
          })
        );
        handleClose();
      }
    } catch (error) {
      console.error("error", error);
      dispatch(
        showSnackbar({
          severity: "error",
          message: `You Failed Join to ${data.mySelect.name}`,
        })
      );
      handleClose();
    }
  };

  // State to store the selected option
  const [selectedOption, setSelectedOption] = useState<Option>({
    id_channel: 0,
    name: "",
    visibility: "",
    password: "",
  });

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit({ mySelect: selectedOption }))}
    >
      <Stack spacing={3}>
        <FormControl fullWidth>
          <InputLabel>Choose a Channel</InputLabel>
          <Select
            {...register("mySelect.name")}
            onChange={(event: any) => {
              const selectedValue = event.target.value;
              const selectedOption = publicChannels.find(
                (option: any) => option.name === selectedValue
              );
              setSelectedOption(
                selectedOption || {
                  id_channel: 0,
                  name: "",
                  visibility: "",
                  password: "",
                }
              );
            }}
            label="Choose a Channel"
            fullWidth
            required
          >
            {publicChannels.length === 0 ? (
              // Render a message when publicChannels is empty
              <Typography variant="subtitle1" alignItems={"center"} padding={2}>
                There are no channels at the moment.
              </Typography>
            ) : (
              publicChannels
                .filter(
                  (publicChannel: any) =>
                    !channels.some(
                      (channel: any) =>
                        channel.channel_id === publicChannel?.id_channel
                    )
                )
                .map((option: any) => (
                  <MenuItem key={option.id_channel} value={option.name}>
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"space-around"}
                    >
                      <Avatar
                        src={faker.image.avatar()}
                        sx={{ width: 52, height: 52, marginRight: 2 }}
                      />
                      <Typography variant="subtitle2" color={"black"}>
                        {option.name}
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))
            )}
          </Select>
        </FormControl>

        <Stack
          direction={"row"}
          alignContent={"center"}
          justifyContent={"space-evenly"}
        >
          <Button
            sx={{
              // backgroundColor: "#806EA9", // Change the background color to purple
              color: "#3D3C65", // Change the text color to white
              borderRadius: "12px",
              width: "150px",
              height: "50px",
              fontSize: "18px",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#3D3C65", // Change the background color on hover
                color: "#b7b7c9",
              },
            }}
            variant="outlined"
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            sx={{
              backgroundColor: "#3D3C65", // Change the background color to purple 3D3C65
              color: "#f78562", // Change the text color to white
              borderRadius: "12px",
              height: "50px",
              fontSize: "18px",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#3D3C65", // Change the background color on hover
                color: "#b7b7c9",
              },
            }}
            type="submit"
            variant="contained"
          >
            Create Channel
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default JoinPublicForm;
