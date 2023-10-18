import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import FormProvider from "../../components/hook-form/FormProvider";
import { Button, Stack } from "@mui/material";
import { RHFAutocomplete, RHFTextField } from "../../components/hook-form";


const MEMBERS = ["name 1", "name 2", "name 3", "name 4", "name 4"];

const CreatePrivateForm = ({ handleClose }: any) => {
    const PrivateSchema = Yup.object().shape({
        title: Yup.string().required("Title is Required!!"),
        members: Yup.array().min(3, "Must have at least 3 Members"),
    });

    const defaultValues = {
        title: "",
        members: [],
        type: 'private',
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
            <Stack spacing={3}>
                <RHFTextField name="title" label="Title" />
                <RHFAutocomplete
                    name="members"
                    label="Members"
                    multiple
                    freeSolo
                    options={MEMBERS.map((option) => option)}
                    ChipProps={{ size: "medium" }}
                />
                <Stack
                    spacing={2}
                    direction={"row"}
                    alignContent={"center"}
                    justifyContent={"end"}
                >
                    <Button onClick={handleClose} >Cancel</Button>
                    <Button type="submit" variant="contained">
                        Create Chennel
                    </Button>
                </Stack>
            </Stack>
        </FormProvider>
    );
}

export default CreatePrivateForm;