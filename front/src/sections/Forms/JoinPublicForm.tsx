import { faker } from "@faker-js/faker";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Avatar,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { showSnackbar } from "../../redux/slices/contact";
import { useAppDispatch } from "../../redux/store/store";

const channelOptions: Option[] = [
  { key: 24716, label: "RandomGamingManiac", value: "Public Channel 1" },
  { key: 33511, label: "GamingFrenzyFun", value: "Public Channel 2" },
  { key: 19437, label: "InsaneGamingQuest", value: "Public Channel 3" },
  { key: 25601, label: "TheRandomGameTime", value: "Public Channel 4" },
  { key: 39502, label: "GamerExtraordinaire", value: "Public Channel 5" },
  { key: 45408, label: "QuirkyGameGuru", value: "Public Channel 6" },
  { key: 4004, label: "GameOnWithRandom", value: "Public Channel 7" },
  { key: 5212, label: "LuckyGamingChamp", value: "Public Channel 8" },
  { key: 40572, label: "UnpredictableGamingGuy", value: "Public Channel 9" },
  { key: 21985, label: "GamingInRandomMode", value: "Public Channel 10" },
  { key: 31006, label: "GameOnWithRandom", value: "Public Channel 11" },
  { key: 20110, label: "LuckyGamingChamp", value: "Public Channel 8" },
  { key: 9290, label: "UnpredictableGamingGuy", value: "Public Channel 9" },
  { key: 16227, label: "GamingInRandomMode", value: "Public Channel 10" },
  { key: 30893, label: "GameOnWithRandom", value: "Public Channel 11" },
]; 
interface Option {
  value: string;
  label: string;
  key: number;
}


interface JoinPublicFormData {
  mySelect: Option; // Store the selected option object
}

const JoinPublicForm = ({ handleClose }: any) => {

  const dispatch = useAppDispatch();

  const schema = Yup.object().shape({
    mySelect: Yup.object().shape({
      value: Yup.string().required("Channel is required"),
      label: Yup.string(),
      key: Yup.number(),
    }),
  });

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
    resolver: yupResolver(schema)
  });

  const { errors } = formState;

  const onSubmit = (data: JoinPublicFormData) => {
    try {
      dispatch(
        showSnackbar({
          severity: "success",
          message: `You Join to ${data.mySelect.value} successfully`,
        })
      );
      // Access the selected option value and label from the form data
      const selectedValue = data.mySelect.value;
      const selectedLabel = data.mySelect.label;

      // Call API with form data, including the selected channel value and label
      console.log("Selected Channel Value:", selectedValue);
      console.log("Selected Channel Label:", selectedLabel);
    } catch (error) {
      console.error("error", error);
      dispatch(
        showSnackbar({
          severity: "failed",
          message: `You Failed Join to ${data.mySelect.value}`,
        })
      );
    }
  };

  // State to store the selected option
  const [selectedOption, setSelectedOption] = useState<Option>({key: 0, value: "", label: "" });

  return (
    <form onSubmit={handleSubmit((data) => onSubmit({ mySelect: selectedOption }))}>
      <Stack spacing={3}>
        <FormControl fullWidth>
          <InputLabel>Choose a Channel</InputLabel>
          <Select
            {...register("mySelect.value")}
            onChange={(event) => {
              const selectedValue = event.target.value;
              const selectedOption = channelOptions.find((option) => option.value === selectedValue);
              setSelectedOption(selectedOption || { key: 0, value: "", label: "" });
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

export default JoinPublicForm;
