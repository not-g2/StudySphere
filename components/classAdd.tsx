"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";

interface ClassCodePopupProps {
  open: boolean;
  handleClose: () => void;
  onJoinClass: (classCode: string, joinType: "course") => void;
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
    onJoinClass(classCode, "course");
    setClassCode("");
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
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={handleJoin} color="primary" variant="contained">
          Join
        </Button>
        <Button type="button" onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClassCodePopup;
