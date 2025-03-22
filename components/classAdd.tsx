import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from "@mui/material";

interface ClassCodePopupProps {
  open: boolean;
  handleClose: () => void;
  onJoinClass: (classCode: string, joinType: "course" | "group") => void;
}

const ClassCodePopup: React.FC<ClassCodePopupProps> = ({
  open,
  handleClose,
  onJoinClass,
}) => {
  const [classCode, setClassCode] = useState("");
  const [joinType, setJoinType] = useState<"course" | "group">("course");
  const [error, setError] = useState("");

  const handleJoin = () => {
    if (classCode.trim() === "") {
      setError("Please enter a class code");
      return;
    }
    onJoinClass(classCode, joinType);
    setClassCode(""); // Reset the input field after joining
    setError("");
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Join a Class or Group</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Class/Group Code"
          variant="outlined"
          value={classCode}
          onChange={(e) => setClassCode(e.target.value)}
          error={!!error}
          helperText={error}
          autoFocus
          margin="dense"
        />
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Join as:</FormLabel>
          <RadioGroup
            row
            value={joinType}
            onChange={(e) =>
              setJoinType(e.target.value as "course" | "group")
            }
          >
            <FormControlLabel
              value="course"
              control={<Radio />}
              label="Course"
            />
            <FormControlLabel
              value="group"
              control={<Radio />}
              label="Group"
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleJoin} color="primary" variant="contained">
          Join
        </Button>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClassCodePopup;
