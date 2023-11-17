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
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { showSnackbar } from "../../redux/slices/contact";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import axios from "axios";

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
  const { publicChannels, channels } = useAppSelector(state => state.channels);
  console.log(channels);
  console.log(publicChannels);

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

  const onSubmit = (data: JoinPublicFormData) => {
    try {
      // Access the selected option value and label from the form data
      // const selectedValue = data.mySelect.name;
      // const selectedLabel = data.mySelect.label;
      const sendData = {
        id_channel: data.mySelect.id_channel,
        name: data.mySelect.name,
        visibility: data.mySelect.visibility,
        password: data.mySelect?.password,
      };
      console.log("DATA", data.mySelect);
      axios.post(
        "http://localhost:3000/channels/join",
        { sendData },
        { withCredentials: true }
      );
      // Call API with form data, including the selected channel value and label
      dispatch(
        showSnackbar({
          severity: "success",
          message: `You Join to ${data.mySelect.name} successfully`,
        })
      );
      handleClose();
    } catch (error) {
      console.error("error", error);
      dispatch(
        showSnackbar({
          severity: "failed",
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
      onSubmit={handleSubmit(data => onSubmit({ mySelect: selectedOption }))}
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
            {publicChannels
              .filter(
                publicChannel =>
                  !channels.some(
                    channel => channel.channel_id === publicChannel?.id_channel
                  )
              )
              .map((option: any) => (
                //  .filter((el: any) => !(el.id_channel === channels || el.user_id !== action.payload.user_id))
                // console.log(option),
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
              ))}
          </Select>
        </FormControl>

        <Button onClick={handleClose}>Cancel</Button>
        <Button
          sx={{
            backgroundColor: "#806EA9",
            color: "#C7BBD1",
            borderRadius: "21px",
            "&:hover": {
              backgroundColor: "#684C83",
              color: "#C7BBD1",
            },
          }}
          type="submit"
          variant="contained"
        >
          Join Channel
        </Button>
      </Stack>
    </form>
  );
};

export default JoinPublicForm;
