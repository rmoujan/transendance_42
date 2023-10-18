import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import FormProvider from "../../components/hook-form/FormProvider";
import { RHFSelect } from "../../components/hook-form";

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

const JoinPublicForm = ({ handleClose }: any) => {
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
            // call api
            console.log("DATA", data);
        } catch (error) {
            console.log("error", error);
            reset();
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
                ;
                <Stack
                    spacing={2}
                    direction={"row"}
                    alignContent={"center"}
                    justifyContent={"end"}
                >
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        Join Channel
                    </Button>
                </Stack>
            </Stack>
        </FormProvider>
    );
};

export default JoinPublicForm;