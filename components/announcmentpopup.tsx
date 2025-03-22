import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { format } from "date-fns";

interface Announcement {
  _id: number;
  title: string;
  createdAt: string;
  description: string;
}

interface PopupFormProps {
  open: boolean;
  handleClose: () => void;
  announcement: Announcement | null;
}

const formatdate = (date: string | undefined) => {
  if (!date) return "";
  return format(new Date(date), "MMMM dd, yyyy HH:mm:ss");
};

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
          {formatdate(announcement?.createdAt)}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography>{announcement?.description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupForm;
