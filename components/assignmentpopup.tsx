import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
  Avatar,
} from "@mui/material";
import { AttachFile, Delete } from "@mui/icons-material";
import pdf from "../public/pdf.png";
import word from "../public/word.png";
import ppt from "../public/ppt.png";
import excel from "../public/excel.png";
import folder from "../public/folder.png";

interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  course: string;
  desc: string;
  link: string;
}

interface PopupFormProps {
  open: boolean;
  handleClose: () => void;
  assignment: Assignment | null;
}

const PopupForm: React.FC<PopupFormProps> = ({
  open,
  handleClose,
  assignment,
}) => {
  const handleSubmit = () => {};

  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    setFiles([]);
  }, [assignment]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const handleFileRemove = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const getFileAvatar = (file: File) => {
    switch (file.type) {
      case "application/pdf":
        return pdf.src;
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return word.src;
      case "application/vnd.ms-powerpoint":
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        return ppt.src;
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return excel.src;
      default:
        return URL.createObjectURL(file);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          width: "800px", // Set fixed width
          height: "600px", // Set fixed height
          overflow: "hidden", // Prevent overflow
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "Bold", fontSize: 35 }}>
        {assignment?.title}
        <Typography sx={{ fontStyle: "italic" }}>
          Due Date: {assignment?.dueDate}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography sx={{marginBottom: 2}}>{assignment?.desc}</Typography>
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <input
            id="upload-input"
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <label htmlFor="upload-input">
            <Button
              variant="contained"
              component="span"
              startIcon={<AttachFile />}
            >
              Add files
            </Button>
          </label>
          {files.length > 0 && (
            <List>
              {files.map((file, index) => (
                <ListItem key={index}>
                  <Avatar
                    src={getFileAvatar(file)}
                    sx={{
                      height: 20,
                      width: 20,
                      borderRadius: 0,
                      marginRight: 2,
                    }}
                  />
                  <ListItemText primary={file.name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleFileRemove(index)}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupForm;
