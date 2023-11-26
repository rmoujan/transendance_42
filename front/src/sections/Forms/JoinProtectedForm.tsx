import { faker } from "@faker-js/faker";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Avatar,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import axios from "axios";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { FetchChannels } from "../../redux/slices/channels";
import { showSnackbar } from "../../redux/slices/contact";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";

interface Option {
  name: string;
  visibility: string;
  id_channel: number;
  password: string;
}

interface JoinProtectedFormData {
  mySelect: Option; // Store the selected option object
  password: string; // Store the entered password
}

const JoinProtectedForm = ({ handleClose }: any) => {
  const { protectedChannels, channels } = useAppSelector(
    state => state.channels
  );

  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = React.useState(false);

  const ProtectedChannelSchema = Yup.object().shape({
    mySelect: Yup.object().shape({
      name: Yup.string(),
      visibility: Yup.string(),
      id_channel: Yup.number(),
      password: Yup.string(),
    }),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    mySelect: {
      name: "",
      visibility: "",
      password: "",
      id_channel: 0,
    },
    password: "",
  };

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      mySelect: {
        name: "",
        visibility: "",
        id_channel: 0,
      },
    },
    resolver: yupResolver(ProtectedChannelSchema),
  });

  const { errors } = formState;

  const onSubmit = async (data: JoinProtectedFormData) => {
    try {
      console.log("DATA", data);
      const sendData = {
        id_channel: data.mySelect.id_channel,
        name: data.mySelect.name,
        visibility: data.mySelect.visibility,
        password: data.password,
      };
      const res: any = await axios.post(
        "http://localhost:3000/channels/join",
        { sendData },
        { withCredentials: true }
      );
      console.log("res", res.data);
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
      console.log("error", error);
      dispatch(
        showSnackbar({
          severity: "error",
          message: `You Failed Join to ${data.mySelect.name}`,
        })
      );
    }
  };

  const [selectedOption, setSelectedOption] = React.useState<Option>({
    id_channel: 0,
    name: "",
    visibility: "",
    password: "",
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form
      onSubmit={handleSubmit(data =>
        onSubmit({ ...data, mySelect: selectedOption })
      )}
    >
      <Stack spacing={3}>
        <FormControl fullWidth>
          <InputLabel>Choose a Channel</InputLabel>
          <Select
            {...register("mySelect.name")}
            onChange={(event: any) => {
              const selectedValue: any = event.target.value;
              const selectedOption: any = protectedChannels.find(
                (option: any) => option.name === selectedValue
              );
              setSelectedOption(
                selectedOption || protectedChannels[0] || undefined
              );
            }}
            label="Choose a Channel"
            fullWidth
            required
          >
            {protectedChannels.length === 0 ? (
              // Render a message when publicChannels is empty
              <Typography variant="subtitle1" alignItems={"center"} padding={2}>
                There are no channels at the moment.
              </Typography>
            ) : (
              protectedChannels
                .filter(
                  (protectedChannel: any) =>
                    !channels.some(
                      (channel: any) =>
                        channel.channel_id === protectedChannel?.id_channel
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
        <FormControl fullWidth>
          <TextField
            {...register("password")}
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassword} edge="end">
                    {showPassword ? <EyeSlash /> : <Eye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
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

export default JoinProtectedForm;
