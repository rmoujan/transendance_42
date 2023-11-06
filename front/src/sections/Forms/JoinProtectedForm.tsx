import { faker } from "@faker-js/faker";
import { yupResolver } from "@hookform/resolvers/yup";
import { Avatar, Button, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { showSnackbar } from "../../redux/slices/contact";
import { useAppDispatch } from "../../redux/store/store";



const channelOptions: Option[] = [
  { key: 2133140, label: "RandomGamingManiac", value: "Public Channel 1", password: "vDR9i1Lc0uU28" },
  { key: 3497838, label: "GamingFrenzyFun", value: "Public Channel 2", password: "y5CdnKXAUg2Kw" },
  { key: 3030394, label: "InsaneGamingQuest", value: "Public Channel 3", password: "Jxd5nSqOb4y1o" },
  { key: 5173520, label: "TheRandomGameTime", value: "Public Channel 4", password: "EzOcwxBWPWCZH" },
  { key: 4958154, label: "GamerExtraordinaire", value: "Public Channel 5", password: "OIa6i8AKYbgUc" },
  { key: 3053517, label: "QuirkyGameGuru", value: "Public Channel 6", password: "ARpWBBiZ2NeAW" },
  { key: 1019799, label: "GameOnWithRandom", value: "Public Channel 7", password: "3LgJ7ekRPXJ9t" },
  { key: 606187, label: "LuckyGamingChamp", value: "Public Channel 8", password: "QrLmY7uNibVJb" },
  { key: 1579342, label: "UnpredictableGamingGuy", value: "Public Channel 9", password: "RGLuEfi4XmOt9" },
  { key: 2836728, label: "GamingInRandomMode", value: "Public Channel 10", password: "tYwXYWO2pV9b2" },
  { key: 237783, label: "GameOnWithRandom", value: "Public Channel 11", password: "RopLZn193D9vs" },
  { key: 2615389, label: "LuckyGamingChamp", value: "Public Channel 8", password: "6MiBzRuZnRgUr" },
  { key: 438539, label: "UnpredictableGamingGuy", value: "Public Channel 9", password: "szyBoTbXCCGIb" },
  { key: 3590170, label: "GamingInRandomMode", value: "Public Channel 10", password: "4oDA6PKwYfHdB" },
  { key: 2979652, label: "GameOnWithRandom", value: "Public Channel 11", password: "VN6aUDXCJgkG2" },
];

interface Option {
  value: string;
  label: string;
  key: number;
  password: string;
}

interface JoinProtectedFormData {
  mySelect: Option; // Store the selected option object
  password: string; // Store the entered password
}

const JoinProtectedForm = ({ handleClose }: any) => {
  
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = React.useState(false);

  const ProtectedChannelSchema = Yup.object().shape({
    mySelect: Yup.object().shape({
      value: Yup.string(),
      label: Yup.string(),
      key: Yup.number(),
      password: Yup.string(),
    }),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    mySelect: {
      value: "",
      label: "",
      password: "",
      key: 0,
    },
    password: "",
  };

  const {
    register,
    handleSubmit,
    formState,
  } = useForm({
    defaultValues: {
      mySelect: {
        value: "",
        label: "",
        key: 0,
      }
    },
    resolver: yupResolver(ProtectedChannelSchema)
  });

  const { errors } = formState;

  const onSubmit = async (data: JoinProtectedFormData) => {
    try {
      if (data.mySelect.password === data.password) {
        dispatch(
          showSnackbar({
            severity: "success",
            message: `You Join to ${data.mySelect.value} successfully`,
          })
        );
        // Call API or perform action here
        console.log("DATA", data);
      } else {
        dispatch(
          showSnackbar({
            severity: "warning",
            message: "Password is incorrect. Please try again.",
          })
        );
      }
    } catch (error) {
      console.log("error", error);
      dispatch(
        showSnackbar({
          severity: "failed",
          message: `You Failed Join to ${data.mySelect.value}`,
        })
      );
    }
  };

  const [selectedOption, setSelectedOption] = React.useState<Option>({ key: 0, value: "", label: "", password: "" });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit((data) => onSubmit({ ...data, mySelect: selectedOption }))}>
      <Stack spacing={3}>
        <FormControl fullWidth>
          <InputLabel>Choose a Channel</InputLabel>
          <Select
            {...register("mySelect.value")}
            onChange={(event) => {
              const selectedValue = event.target.value;
              const selectedOption = channelOptions.find((option) => option.value === selectedValue);
              setSelectedOption(selectedOption || channelOptions[0]);
            }}
            label="Choose a Channel"
            fullWidth
            required
          >
            {channelOptions.map((option) => (
              <MenuItem key={option.key} value={option.value}>
                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-around"}>
                  <Avatar src={faker.image.avatar()} sx={{ width: 52, height: 52, marginRight: 2 }} />
                  <Typography variant="subtitle2" color={"black"}>
                    {option.label}
                  </Typography>
                </Stack>
              </MenuItem>
            ))}
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

        <Button onClick={handleClose}>Cancel</Button>
        <Button
          sx={{
            backgroundColor: "#806EA9",
            color: "#C7BBD1",
            borderRadius: "21px",
            "&:hover": {
              backgroundColor: "#684C83",
              color: "#C7BBD1",
            }
          }
          }
          type="submit"
          variant="contained"
        >
          Join Channel
        </Button>
      </Stack>
    </form>
  );
};

export default JoinProtectedForm;
