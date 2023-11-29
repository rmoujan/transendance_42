import { useCallback, useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { RHFAutocomplete, RHFTextField } from "../../components/hook-form";
import FormProvider from "../../components/hook-form/FormProvider";
import { RHFUploadAvatar } from "../../components/hook-form/RHFUploadAvatar";
import { showSnackbar } from "../../redux/slices/contact";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import {
  FetchChannels,
  FetchPublicChannels,
} from "../../redux/slices/channels";

const CreatePublicForm = ({ handleClose }: any) => {
  const [file, setFile] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const { friends } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const PublicSchema = Yup.object().shape({
    title: Yup.string().required("Title is Required!!"),
    members: Yup.array().min(2, "Must have at least 2 Members"),
    avatar: Yup.string().required("Avatar is required").nullable(),
    type: Yup.string(),
  });

  const defaultValues = {
    title: "",
    members: [],
    type: "public",
    avatar:
      "https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png",
  };

  const methods = useForm({
    resolver: yupResolver(PublicSchema),
    defaultValues,
  });

  const {
    reset, // reset the form
    setValue, // setValue by input name
    handleSubmit, // form submit function
    formState: {}, // errors and form state
  } = methods; // useful methods from useForm()

  const onSubmit = async (data: any) => {
    // setIsLoading(true);
    try {
      console.log(file);
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      const dataAvatar: any = await axios.patch(
        "http://localhost:3000/users/upload/avatar",
        formData,
        {
          withCredentials: true,
        }
      );

      // console.log("avatarUrl: ", dataAvatar.dat);
      data.avatar = dataAvatar.data;
      const res: any = await axios.post(
        "http://localhost:3000/channels/create",
        data,
        {
          withCredentials: true,
        }
      );
      if (res.data === true) {
        dispatch(
          showSnackbar({
            severity: "success",
            message: "New Public Channel has Created",
          })
        );
        dispatch(FetchChannels());
        dispatch(FetchPublicChannels());
        reset();
        handleClose();
      } else {
        dispatch(
          showSnackbar({
            severity: "error",
            message: "Create Public Channel Failed",
          })
        );
        console.log("error", res.error);
        reset();
        handleClose();
      }
    } catch (error) {
      dispatch(
        showSnackbar({
          severity: "error",
          message: "Create Public Channel Failed",
        })
      );
      console.log("error", error);
      reset();
      handleClose();
    } finally {
      setIsLoading(false);
    }
  };
  const handleDrop = useCallback(
    (acceptedFiles: any) => {
      const file = acceptedFiles[0];
      console.log("file", file);
      console.log(acceptedFiles);
      setFile(file);

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      const title = "avatar";

      if (file) {
        setValue(title, newFile, { shouldValidate: true });
        const filePath = file.path;
        console.log("File Path:", filePath);
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

          <LoadingButton
            loading={isLoading}
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
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default CreatePublicForm;
