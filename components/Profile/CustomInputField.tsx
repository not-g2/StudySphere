import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

interface CustomInputFieldProps {
    value: string | null;
    label: string | null;
    onChange: (value: string) => void;
}

const CustomInputField: React.FC<CustomInputFieldProps> = ({
    value,
    onChange,
    label,
}) => {
    return (
        <TextField
            label={label}
            variant="filled"
            fullWidth
            value={value ?? ""}
            onChange={(e) => {
                onChange(e.target.value);
            }}
            InputProps={{
                style: { color: "#FFFFFF" },
            }}
            sx={{
                backgroundColor: "#1E1E1E", // Dark background for the TextField container
                borderRadius: "8px",
                margin: "0px 0px",

                "& .MuiInputBase-root": {
                    backgroundColor: "#6082B6", // Slightly lighter dark gray
                    color: "#E0E0E0", // Light gray text for better contrast
                    borderRadius: "8px",
                },

                "& .MuiFilledInput-root": {
                    backgroundColor: "#6082B6",
                    "&:hover": { backgroundColor: "#43697f" }, // Slightly lighter on hover
                    "&.Mui-focused": {
                        backgroundColor: "#6082B6",
                        boxShadow: "0 0 0 2px #ADADAD", // Matches the requested color
                    },
                    "&.Mui-disabled": {
                        backgroundColor: "#6082B6 !important",
                        color: "#6082B6 !important", // Text stays visible in disabled mode
                        opacity: 1,
                    },
                    "&:before, &:after": {
                        display: "none",
                    },
                },

                "& .MuiInputLabel-root": {
                    color: "#ADADAD", // Default label color
                },

                "& .MuiInputLabel-root.Mui-focused": {
                    color: "#E0E0E0", // Brighter label when focused
                },

                "& .MuiInputLabel-root.Mui-disabled": {
                    color: "#888888 !important", // Lighter gray for disabled label
                },
            }}
        />
    );
};

export default CustomInputField;
