import PropTypes from 'prop-types';
import { useFormContext, Controller } from "react-hook-form";
import { TextField } from "@mui/material";

interface RHFTextFieldProps {
  name: string;
  label: string;
  helperText?: React.ReactNode;
}

RHFTextField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.node,
};

export default function RHFTextField({ name, helperText, ...other }:RHFTextFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          value={
            typeof field.value === "number" && field.value === 0
              ? ""
              : field.value
          }
          error={!!error}
          helperText={error ? error.message : helperText}
          {...other}
        />
      )}
    />
  );
}
