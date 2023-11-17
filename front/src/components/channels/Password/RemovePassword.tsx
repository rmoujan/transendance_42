import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Stack } from "@mui/material";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { showSnackbar } from "../../../redux/slices/contact";
import { useAppDispatch } from "../../../redux/store/store";
import FormProvider from "../../hook-form/FormProvider";

const RemovePassword = ({ handleClose, el, user_id }: any) => {
  const dispatch = useAppDispatch();

  const methods = useForm({
    resolver: yupResolver(Yup.object().shape({})),
    defaultValues: {},
  });

  const { handleSubmit, errors, reset } = methods;

  const onSubmit = async (data: any) => {
    try {
    //   console.log(el);
    //   console.log(user_id);
      data.id_channel = el.id_channel;
      data.user_id = user_id;
      console.log(data);
      await axios.post("http://localhost:3000/channels/removePass", data, {
        withCredentials: true,
      });
      dispatch(
        showSnackbar({
          severity: "success",
          message: "You upgrated to Protected channel",
        })
      );
      handleClose();
    } catch (err) {
      console.error(err);
      reset();
      dispatch(
        showSnackbar({
          severity: "failed",
          message: "update into Protected Channel Failed",
        })
      );
      handleClose();
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
          Remove Password
        </Button>
      </Stack>
    </FormProvider>
  );
};

export default RemovePassword;
