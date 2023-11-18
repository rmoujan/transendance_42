import PropTypes, { InferProps } from "prop-types";
// form
import { Controller, useFormContext } from "react-hook-form";
// @mui
import { Autocomplete, TextField } from "@mui/material";

// ----------------------------------------------------------------------

type RHFAutocompleteProps = {
  name: string;
  label: string;
  helperText?: React.ReactNode;
  multiple?: boolean;
  freeSolo?: boolean;
  options?: any[];
  ChipProps: {
    size: string;
  };
  // Add the multiple property to the type definition
};
RHFAutocomplete.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.node,
  multiple: PropTypes.bool,
  freeSolo: PropTypes.bool,
  options: PropTypes.array,
  ChipProps: PropTypes.shape({
    size: PropTypes.string,
  }),
};
export default function RHFAutocomplete({
  name,
  label,
  helperText,
  ...other
}: InferProps<RHFAutocompleteProps>) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          onChange={(event, newValue) =>
            setValue(name, newValue, { shouldValidate: true })
          }
          renderInput={params => (
            <TextField
              label={label}
              error={!!error}
              helperText={error ? error?.message : helperText}
              {...params}
            />
          )}
          options={other.options}
          {...other}
        />
      )}
    />
  );
}
