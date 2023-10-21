import * as React from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, IconButton, InputAdornment, Stack } from "@mui/material";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { RHFSelect, RHFTextField } from "../../components/hook-form";
import FormProvider from "../../components/hook-form/FormProvider";
import { showSnackbar } from "../../redux/slices/contact";
import { useAppDispatch } from "../../redux/store/store";

const channelOptions: Option[] = [
  { label: "RandomGamingManiac", value: "Public Channel 1" },
  { label: "GamingFrenzyFun", value: "Public Channel 2" },
  { label: "InsaneGamingQuest", value: "Public Channel 3" },
  { label: "TheRandomGameTime", value: "Public Channel 4" },
  { label: "GamerExtraordinaire", value: "Public Channel 5" },
  { label: "QuirkyGameGuru", value: "Public Channel 6" },
  { label: "GameOnWithRandom", value: "Public Channel 7" },
  { label: "LuckyGamingChamp", value: "Public Channel 8" },
  { label: "UnpredictableGamingGuy", value: "Public Channel 9" },
  { label: "GamingInRandomMode", value: "Public Channel 10" },
  { label: "GameOnWithRandom", value: "Public Channel 11" },
  { label: "LuckyGamingChamp", value: "Public Channel 8" },
  { label: "UnpredictableGamingGuy", value: "Public Channel 9" },
  { label: "GamingInRandomMode", value: "Public Channel 10" },
  { label: "GameOnWithRandom", value: "Public Channel 11" },
];

interface Option {
  value: string;
  label: string;
}

const JoinProtectedForm = ({ handleClose }: any) => {
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
  const ProtectedChannelSchema = Yup.object().shape({
    name: Yup.string().required("Name of Channel is Required!!"),
    password: Yup.string().required("Password is Required!!"),
  });

  const defaultValues = {
    name: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(ProtectedChannelSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setError,
    handleSubmit,
    formState: { errors, isSubmitted, isSubmitSuccessful, isValid },
  } = methods;

  const onSubmit = async (data: any) => {
    try {
      dispatch(
        showSnackbar({
          severity: "success",
          message: `You Join to ${data.name} successfully`,
        })
      );
      // call api
      console.log("DATA", data);
    } catch (error) {
      console.log("error", error);
      reset();
      // setError("afterSubmit", {
      //   ...error,
      //   message: error.message,
      // });
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {/* NEED TO CREATE A FORM DATA */}
      <Stack spacing={3}>
        <RHFSelect
          name="channel"
          label="Choose a Channel"
          helperText="Select your preferred channel"
          options={channelOptions}
        />
        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Stack
          spacing={2}
          direction={"row"}
          alignContent={"center"}
          justifyContent={"end"}
        >
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#806EA9", // Change the background color to purple
              color: "#C7BBD1", // Change the text color to white
              borderRadius: "21px",
              "&:hover": {
                backgroundColor: "#684C83", // Change the background color on hover
                color: "#C7BBD1",
              },
            }}
            onClick={handleClose}
          >
            Join Channel
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default JoinProtectedForm;
