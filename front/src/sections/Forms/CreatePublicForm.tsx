import { useCallback, useState } from "react";
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

const CreatePublicForm = ({ handleClose, el }: any) => {
  const [file, setFile] = useState<any>();
  const { friends } = useAppSelector(state => state.app);
  const dispatch = useAppDispatch();
  const PublicSchema = Yup.object().shape({
    title: Yup.string().required("Title is Required!!"),
    members: Yup.array().min(2, "Must have at least 2 Members"),
    avatar: Yup.string().required("Avatar is required").nullable(true),
    type: Yup.string(),
  });

  let defaultValues;

  if (!el) {
    defaultValues = {
      title: "",
      members: [],
      type: "public",
      avatar:
        "https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png",
    };
  } else {
    defaultValues = {
      title: el.name,
      members: el.users.map((user: any) => user.user.name),
      type: "public",
      avatar: el.img,
    };
  }
  const methods = useForm({
    resolver: yupResolver(PublicSchema),
    defaultValues,
  });

  const {
    reset, // reset the form
    watch, // watch input value by passing the name of it
    setError, // setError by input name
    setValue, // setValue by input name
    handleSubmit, // form submit function
    formState: { errors }, // errors and form state
  } = methods; // useful methods from useForm()

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
            message: "New Public Channel has Created",
          })
        );
        reset();
        handleClose();
        // call api
      } catch (error) {
        dispatch(
          showSnackbar({
            severity: "failed",
            message: "Create Public Channel Failed",
          })
        );
        console.log("error", error);
        reset();
        handleClose();
      }
    }
    else {
      try {
        data.avatar = file?.preview;
        // await axios.put(`http://localhost:3000/channels/${el.id_channel}`, data, {
        //   withCredentials: true,
        // });
        dispatch(
          showSnackbar({
            severity: "success",
            message: "Public Channel has Updated",
          })
        );
        reset();
        handleClose();
        // call api
      } catch (error) {
        dispatch(
          showSnackbar({
            severity: "failed",
            message: "Update Public Channel Failed",
          })
        );
        console.log("error", error);
        reset();
        handleClose();
      }
    }
  };
  const handleDrop = useCallback(
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

export default CreatePublicForm;
