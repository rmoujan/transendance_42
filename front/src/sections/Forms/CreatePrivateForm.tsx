import React from "react";
import axios from "axios";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Stack } from "@mui/material";
import { RHFAutocomplete, RHFTextField } from "../../components/hook-form";
import FormProvider from "../../components/hook-form/FormProvider";
import { RHFUploadAvatar } from "../../components/hook-form/RHFUploadAvatar";
import { showSnackbar } from "../../redux/slices/contact";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";

const CreatePrivateForm = ({ handleClose, el }: any) => {
  const [file, setFile] = React.useState<any>();
  const dispatch = useAppDispatch();
  const PrivateSchema = Yup.object().shape({
    title: Yup.string().required("Title is Required!!"),
    members: Yup.array().min(2, "Must have at least 2 Members"),
    avatar: Yup.string().required("Avatar is required").nullable(true),
  });

  let defaultValues;

  if (!el) {
    defaultValues = {
      title: "",
      members: [],
      type: "private",
      avatar:
        "https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png",
    };
  } else {
    defaultValues = {
      title: el.name,
      members: el.users.map((user: any) => user.user.name),
      type: "private",
      avatar: el.img,
    };
  }
  const methods = useForm({
    resolver: yupResolver(PrivateSchema),
    defaultValues,
  });

  const {
    reset, // reset the form
    watch, // watch input value by passing the name of it
    setError, // setError by input name
    handleSubmit, // form submit function
    setValue, // setValue by input name
    formState: { errors, isSubmitted, isSubmitSuccessful, isValid }, // errors and form state
  } = methods; // useful methods from useForm()

  const { friends } = useAppSelector(state => state.app);
  const onSubmit = async (data: any) => {
   if (!el) { try {
      data.avatar = file?.preview;
      await axios.post("http://localhost:3000/channels/create", data, {
        withCredentials: true,
      });

      dispatch(
        showSnackbar({
          severity: "success",
          message: "New Private Channel has Created",
        })
      );
      handleClose();
    } catch (error) {
      console.log("error", error);
      dispatch(
        showSnackbar({
          severity: "failed",
          message: "Create Private Channel Failed",
        })
      );
      reset();
      handleClose();
    }}
    else {
      try {
        data.avatar = file?.preview;
        // await axios.post("http://localhost:3000/channels/create", data, {
        //   withCredentials: true,
        // });
        dispatch(
          showSnackbar({
            severity: "success",
            message: "Private Channel has Updated Successfully",
          })
        );
        handleClose();
      } catch (error) {
        console.log("error", error);
        dispatch(
          showSnackbar({
            severity: "failed",
            message: "Update into Private Channel has Failed",
          })
        );
        reset();
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
      <Stack spacing={3}>
        <RHFUploadAvatar name="avatar" maxSize={3145728} onDrop={handleDrop} />
        <RHFTextField name="title" label="Title" />
        <RHFAutocomplete
          name="members"
          label="Members"
          multiple
          freeSolo
          options={friends.map((friend: any) => friend?.name)}
          ChipProps={{ size: "medium" }}
        />
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
      </Stack>
    </FormProvider>
  );
};

export default CreatePrivateForm;
