import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Stack } from "@mui/material";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { resetContact, showSnackbar, toggleDialog } from "../../../redux/slices/contact";
import { useAppDispatch } from "../../../redux/store/store";
import FormProvider from "../../hook-form/FormProvider";
import { FetchChannels, FetchPrivatesChannels, FetchProtectedChannels, FetchPublicChannels } from "../../../redux/slices/channels";

const RemovePassword = ({ handleClose, el, user_id }: any) => {
  const dispatch = useAppDispatch();

  const methods = useForm({
    resolver: yupResolver(Yup.object().shape({})),
    defaultValues: {},
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = async (data: any) => {
    try {
    //   console.log(el);
    //   console.log(user_id);
      data.id_channel = el.id_channel;
      data.user_id = user_id;
      await axios.post("http://localhost:3000/channels/removePass", data, {
        withCredentials: true,
      });
      dispatch(toggleDialog());
      dispatch(FetchChannels());
      dispatch(FetchProtectedChannels());
      dispatch(FetchPublicChannels());
      dispatch(FetchPrivatesChannels());
      dispatch(resetContact());
      dispatch(
        showSnackbar({
          severity: "success",
          message: "You upgrated to Protected channel",
        })
      );
    } catch (err) {
      console.error(err);
      reset();
      handleClose();
      dispatch(
        showSnackbar({
          severity: "error",
          message: "update into Protected Channel Failed",
        })
      );
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
          Remove Password
        </Button>
      </Stack>
    </FormProvider>
  );
};

export default RemovePassword;
