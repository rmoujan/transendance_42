import { yupResolver } from "@hookform/resolvers/yup";
import { Button, IconButton, InputAdornment, Stack } from "@mui/material";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import axios from "axios";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { RHFAutocomplete, RHFTextField } from "../../components/hook-form";
import FormProvider from "../../components/hook-form/FormProvider";
import { RHFUploadAvatar } from "../../components/hook-form/RHFUploadAvatar";
import { showSnackbar } from "../../redux/slices/contact";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";

const CreateProtectedForm = ({ handleClose, el }: any) => {
  const [file, setFile] = React.useState<any>();
  const { friends } = useAppSelector(state => state.app);
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false);

  const ProtectedSchema = Yup.object().shape({
    title: Yup.string().required("Title is Required!!"),
    members: Yup.array().min(2, "Must have at least 2 Members"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    passwordConfirm: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    avatar: Yup.string().required("Avatar is required").nullable(true),
  });

  let defaultValues;

  if (!el) {
    defaultValues = {
      title: "",
      members: [],
      password: "",
      passwordConfirm: "",
      type: "protected",
      avatar:
        "https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png",
    };
  } else {
    defaultValues = {
      title: el.name,
      members: el.users.map((user: any) => user.user.name),
      password: el.password,
      passwordConfirm: el.password,
      type: "protected",
      avatar: el.img,
    };
  }
  const methods = useForm({
    resolver: yupResolver(ProtectedSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    setValue, // setValue by input name
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: any) => {
    if (!el) {
      try {
        data.avatar = file?.preview;
        await axios.post("http://localhost:3000/channels/create", data, {
          withCredentials: true,
        });
        dispatch(
          showSnackbar({
            severity: "success",
            message: "New Protected Channel has Created",
          })
        );
        handleClose();
        reset();
      } catch (error) {
        console.error(error);
        reset();
        dispatch(
          showSnackbar({
            severity: "failed",
            message: "Create Protected Channel Failed",
          })
        );
        handleClose();
      }
    } else {
      try {
        data.avatar = file?.preview;
        // await axios.put(
        //   `http://localhost:3000/channels/${el._id}/update`,
        //   data,
        //   {
        //     withCredentials: true,
        //   }
        // );
        dispatch(
          showSnackbar({
            severity: "success",
            message: "Protected Channel has Updated",
          })
        );
        handleClose();
        reset();
      } catch (error) {
        console.error(error);
        reset();
        dispatch(
          showSnackbar({
            severity: "failed",
            message: "Update Protected Channel Failed",
          })
        );
        handleClose();
      }
    }
  };

  const handleDrop = React.useCallback(
    (acceptedFiles: any) => {
      const file = acceptedFiles[0];

      setFile(file);

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      const title = "avatar";

      if (file) {
        setValue(title, newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} mb={4}>
        <RHFUploadAvatar name="avatar" maxSize={3145728} onDrop={handleDrop} />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <RHFTextField name="title" label="Title" />
        </Stack>

        <RHFAutocomplete
          name="members"
          label="Members"
          multiple
          freeSolo
          options={friends.map((friend: any) => friend?.name)}
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
        direction={"row"}
        alignContent={"center"}
        justifyContent={"space-evenly"}
      >
        <Button
          sx={{
            backgroundColor: "#806EA9", // Change the background color to purple
            color: "#C7BBD1", // Change the text color to white
            borderRadius: "12px",
            width: "150px",
            height: "50px",
            "&:hover": {
              backgroundColor: "#684C83", // Change the background color on hover
              color: "#C7BBD1",
            },
          }}
          variant="contained"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          sx={{
            backgroundColor: "#806EA9", // Change the background color to purple
            color: "#C7BBD1", // Change the text color to white
            borderRadius: "12px",
            height: "50px",
            "&:hover": {
              backgroundColor: "#684C83", // Change the background color on hover
              color: "#C7BBD1",
            },
          }}
          type="submit"
          variant="contained"
        >
          Create Channel
        </Button>
      </Stack>
    </FormProvider>
  );
};

export default CreateProtectedForm;
