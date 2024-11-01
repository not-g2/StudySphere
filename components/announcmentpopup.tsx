import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";

interface Announcement {
  id: number;
  title: string;
  datePosted: string;
  content: string;
}

interface PopupFormProps {
  open: boolean;
  handleClose: () => void;
  announcement: Announcement | null;
}

const PopupForm: React.FC<PopupFormProps> = ({
  open,
  handleClose,
  announcement,
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ fontWeight: "Bold" }}>
        {announcement?.title}
        <Typography sx={{ fontStyle: "italic" }}>
          {announcement?.datePosted}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography>{announcement?.content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupForm;
