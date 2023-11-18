import React, { useState } from "react";
import PropTypes from "prop-types";
import { useFormContext, Controller, FieldValues } from "react-hook-form";
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack,
  Avatar,
  Typography,
} from "@mui/material";
import { faker } from "@faker-js/faker";

interface Option {
  value: string;
  label: string;
}

interface RHFSelectProps {
  name: string;
  label: string;
  helperText?: React.ReactNode;
  options: Option[];
}

RHFSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  helperText: PropTypes.node,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func,
};

RHFSelect.defaultProps = {
  helperText: "",
};

export default function RHFSelect({
  name,
  label,
  helperText,
  options,
}: RHFSelectProps) {
  const { control } = useFormContext<FieldValues>();
  const [selectedOption, setSelectedOption] = useState<Option | undefined>(
    undefined
  ); // State to hold the selected option

  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValue = event.target.value as string;
    const selectedOption = options.find(
      option => option.value === selectedValue
    );
    setSelectedOption(selectedOption);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Select
            {...field}
            value={selectedOption ? selectedOption.value : ""}
            onChange={handleSelectChange} // Add onChange handler
            error={!!error}
            label={label}
            fullWidth
          >
            {options.map(option => (
              <MenuItem
                key={option.value}
                value={option.value}
                className="align-middle"
              >
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-around"}
                >
                  <Avatar
                    src={faker.image.avatar()}
                    sx={{ width: 52, height: 52, marginRight: 2 }}
                  />
                  <Typography variant="subtitle2" color={"black"}>
                    {option.label}
                  </Typography>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {helperText && <p>{helperText}</p>}
      {/*  Access the selected value and label wherever needed, for example: */}
      <p>Selected Value: {selectedOption?.value}</p>
      <p>Selected Label: {selectedOption?.label}</p>
    </FormControl>
  );
}
