import * as React from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { Button, IconButton, InputAdornment, Stack } from "@mui/material";
import { RHFAutocomplete, RHFTextField } from "../../components/hook-form";
import FormProvider from "../../components/hook-form/FormProvider";

const MEMBERS = ["name 1", "name 2", "name 3", "name 4", "name 4"];

const CreateProtectedForm = ({ handleClose }: any) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false);

  const ProtectedSchema = Yup.object().shape({
    title: Yup.string().required("Title is Required!!"),
    members: Yup.array().min(3, "Must have at least 3 Members"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    passwordConfirm: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const defaultValues = {
    title: "",
    members: [],
    password: "",
    passwordConfirm: "",
    type: "protected",
  };

  const methods = useForm({
    resolver: yupResolver(ProtectedSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: any) => {
    try {
      // submit data to backend
      console.log("DATA", data);
    } catch (error) {
      console.error(error);
      reset();
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} mb={4}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <RHFTextField name="title" label="Title" />
        </Stack>

        <RHFAutocomplete
          name="members"
          label="Members"
          multiple
          freeSolo
          options={MEMBERS.map((option) => option)}
          ChipProps={{ size: "medium" }}
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

        <RHFTextField
          name="passwordConfirm"
          label="Confirm New Password"
          type={showPasswordConfirm ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  edge="end"
                >
                  {showPasswordConfirm ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack
        spacing={2}
        direction={"row"}
        alignContent={"center"}
        justifyContent={"end"}
      >
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          sx={{
            backgroundColor: "#806EA9", // Change the background color to purple
            color: "#C7BBD1", // Change the text color to white
            borderRadius: "21px",
            "&:hover": {
              backgroundColor: "#684C83", // Change the background color on hover
              color: "#C7BBD1",
            },
          }}
          type="submit"
          variant="contained"
        >
          Create Chennel
        </Button>
      </Stack>
    </FormProvider>
  );
};

export default CreateProtectedForm;
