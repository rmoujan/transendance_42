import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import FormProvider from "../../components/hook-form/FormProvider";
import { Button, Stack } from "@mui/material";
import { RHFAutocomplete, RHFTextField } from "../../components/hook-form";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { showSnackbar } from "../../redux/slices/contact";
import LoadingButton from "@mui/lab/LoadingButton";


const CreatePrivateForm = ({ handleClose }: any) => {
  const dispatch = useAppDispatch();
  const PrivateSchema = Yup.object().shape({
    title: Yup.string().required("Title is Required!!"),
    members: Yup.array().min(3, "Must have at least 3 Members"),
  });

  const defaultValues = {
    title: "",
    members: [],
    type: "private",
  };

  const methods = useForm({
    resolver: yupResolver(PrivateSchema),
    defaultValues,
  });

  const {
    reset, // reset the form
    watch, // watch input value by passing the name of it
    setError, // setError by input name
    handleSubmit, // form submit function
    formState: { errors, isSubmitted, isSubmitSuccessful, isValid }, // errors and form state
  } = methods; // useful methods from useForm()

  const { friends } = useAppSelector(state => state.app);
  const onSubmit = async (data: any) => {
    try {
      dispatch(
        showSnackbar({
          severity: "success",
          message: "New Private Channel has Created",
        })
      );
      // call api
      console.log("DATA", data);
    } catch (error) {
      console.log("error", error);
      reset();
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="title" label="Title" />
        <RHFAutocomplete
          name="members"
          label="Members"
          multiple
          freeSolo
          options={friends.map(friend => friend?.name)}
          ChipProps={{ size: "medium" }}
        />
        <Stack
          spacing={2}
          direction={"row"}
          alignContent={"center"}
          justifyContent={"end"}
        >
          <Button onClick={handleClose}>Cancel</Button>
          {/* <LoadingButton loading variant="outlined">
  Submit
</LoadingButton> */}
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
            Create Channel
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default CreatePrivateForm;
