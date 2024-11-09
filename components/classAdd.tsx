import React, { useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Typography,
    TextField,
} from "@mui/material";

interface ClassCodePopupProps {
    open: boolean;
    handleClose: () => void;
    onJoinClass: (classCode: string) => void;
}

const ClassCodePopup: React.FC<ClassCodePopupProps> = ({
    open,
    handleClose,
    onJoinClass,
}) => {
    const [classCode, setClassCode] = useState("");
    const [error, setError] = useState("");

    const handleJoin = () => {
        if (classCode.trim() === "") {
            setError("Please enter a class code");
            return;
        }
        onJoinClass(classCode);
        setClassCode(""); // Reset the input field after joining
        setError("");
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>Join a Class</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Class Code"
                    variant="outlined"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    error={!!error}
                    helperText={error}
                    autoFocus
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleJoin}
                    color="primary"
                    variant="contained"
                >
                    Join Class
                </Button>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ClassCodePopup;
