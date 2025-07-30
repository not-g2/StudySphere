// components/Group/CreateGroupPopup.tsx
"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

interface CreateGroupPopupProps {
  open: boolean;
  handleClose: () => void;
  onCreateGroup: (groupName: string) => void;
}

const CreateGroupPopup: React.FC<CreateGroupPopupProps> = ({
  open,
  handleClose,
  onCreateGroup,
}) => {
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (groupName.trim() === "") {
      setError("Please enter a group name");
      return;
    }
    onCreateGroup(groupName);
    setGroupName("");
    setError("");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Create a Group</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Group Name"
          variant="outlined"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          error={!!error}
          helperText={error}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCreate} color="primary" variant="contained">
          Create Group
        </Button>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateGroupPopup;
