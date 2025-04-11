"use client";
import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";

interface FormData {
    description: string;
    startDate: string;
    endDate: string;
}

interface PopupFormProps {
    open: boolean;
    handleClose: () => void;
    handleSubmit: (formData: FormData) => void;
}

const PopupForm: React.FC<PopupFormProps> = ({
    open,
    handleClose,
    handleSubmit,
}) => {
    const [formData, setFormData] = useState<FormData>({
        description: "",
        startDate: "",
        endDate: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const onSubmit = () => {
        handleSubmit(formData);
        setFormData({
            description: "",
            startDate: "",
            endDate: "",
        });
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Enter Deadline Details</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Description"
                    name="description"
                    type="text"
                    fullWidth
                    value={formData.description}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Start Date"
                    name="startDate"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={formData.startDate}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="End Date"
                    name="endDate"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={formData.endDate}
                    onChange={handleChange}
                    inputProps={{ min: formData.startDate }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={onSubmit} color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PopupForm;
