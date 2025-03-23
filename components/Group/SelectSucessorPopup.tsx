"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

interface Member {
  memberid: string;
  name: string;
  rank: string;
}

interface SelectSuccessorPopupProps {
  open: boolean;
  candidates: Member[];
  onClose: () => void;
  onSubmit: (successorId: string) => void;
}

const SelectSuccessorPopup: React.FC<SelectSuccessorPopupProps> = ({
  open,
  candidates,
  onClose,
  onSubmit,
}) => {
  const [selectedId, setSelectedId] = useState("");

  const handleConfirm = () => {
    if (selectedId) {
      onSubmit(selectedId);
      setSelectedId("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Successor</DialogTitle>
      <DialogContent>
        <Typography>
          As you are the creator, please select a successor before leaving.
        </Typography>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="successor-select-label">Successor</InputLabel>
          <Select
            labelId="successor-select-label"
            value={selectedId}
            label="Successor"
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {candidates.map((member) => (
              <MenuItem key={member.memberid} value={member.memberid}>
                {member.name} ({member.rank})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" disabled={!selectedId}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectSuccessorPopup;
