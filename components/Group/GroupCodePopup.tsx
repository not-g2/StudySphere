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

interface GroupCodePopupProps {
  open: boolean;
  handleClose: () => void;
  onJoinGroup: (groupCode: string) => void;
}

const GroupCodePopup: React.FC<GroupCodePopupProps> = ({
  open,
  handleClose,
  onJoinGroup,
}) => {
  const [groupCode, setGroupCode] = useState("");
  const [error, setError] = useState("");

  const handleJoin = () => {
    if (groupCode.trim() === "") {
      setError("Please enter a group code");
      return;
    }
    onJoinGroup(groupCode);
    setGroupCode(""); // Reset the input field after joining
    setError("");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Join a Group</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Group Code"
          variant="outlined"
          value={groupCode}
          onChange={(e) => setGroupCode(e.target.value)}
          error={!!error}
          helperText={error}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleJoin} color="primary" variant="contained">
          Join Group
        </Button>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupCodePopup;
