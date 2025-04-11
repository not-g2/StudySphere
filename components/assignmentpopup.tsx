"use client";
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
    CardContent,
    CardActions,
    Card,
} from "@mui/material";
import { AttachFile, Delete } from "@mui/icons-material";
import pdf from "../public/pdf.png";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { Assignment } from "@/types/assignment";

interface PopupFormProps {
    open: boolean;
    handleClose: () => void;
    assignment: Assignment | null;
    studentId: string | undefined;
}

const formatdate = (date: string | undefined) => {
    if (!date) {
        return;
    }
    const formattedDate = format(new Date(date), "MMMM dd, yyyy HH:mm:ss");
    return formattedDate;
};

const PopupForm: React.FC<PopupFormProps> = ({
    open,
    handleClose,
    assignment,
    studentId,
}) => {
    const handleSubmit = () => {
        submitAssignment();
        handleClose();
    };

    const [files, setFiles] = useState<File | null>(null);

    useEffect(() => {
        setFiles(null);
    }, [assignment]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const maxSize = 10 * 1024 * 1024; // 10 MB
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // Check if the file is a PDF
            if (file.type !== "application/pdf") {
                alert(`${file.name} is not a PDF file.`);
                return;
            }

            // Check if the file size is within the limit
            if (file.size > maxSize) {
                alert(`${file.name} exceeds the 10 MB limit.`);
                return;
            }

            // Set the file as the only entry in the files array
            setFiles(file);
        }
    };

    const handleFileRemove = () => {
        setFiles(null); // Clear the file
    };

    const getFileAvatar = (file: File | null) => {
        if (!file) {
            return;
        }
        switch (file.type) {
            case "application/pdf":
                return pdf.src;
            default:
                return URL.createObjectURL(file);
        }
    };

    async function submitAssignment() {
        const sessionData = Cookies.get("session");
        if (!sessionData) {
            return;
        }
        const session = JSON.parse(sessionData);
        if (!assignment || !files || !studentId) {
            return;
        }
        try {
            const formData = new FormData();
            formData.append("assignmentId", assignment?._id.toString());
            formData.append("studentId", studentId);
            formData.append("pdfFile", files);
            console.log(files);
            const token = session.user.token;
            const response = await fetch(
                "http://localhost:8000/api/submissions/submit",
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Submission failed");
            }

            const result = await response.json();
            console.log("Submission successful:", result);
            return result;
        } catch (error) {
            throw error;
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                style: {
                    width: "800px",
                    height: "600px",
                    overflow: "hidden",
                    backgroundColor: "#001D3D",
                },
            }}
        >
            <DialogTitle
                sx={{ fontWeight: "Bold", fontSize: 35, color: "#FFFFFF" }}
            >
                {assignment?.title}
                <Typography sx={{ fontStyle: "italic" }}>
                    Due Date: {formatdate(assignment?.dueDate)}
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Typography sx={{ marginBottom: 2, color: "#FFFFFF" }}>
                    {assignment?.description}
                </Typography>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                >
                    <input
                        id="upload-input"
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                    <label htmlFor="upload-input">
                        <Button
                            variant="contained"
                            component="span"
                            startIcon={<AttachFile />}
                        >
                            Add file
                        </Button>
                    </label>
                    {files && (
                        <Card
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                padding: 2,
                                boxShadow: 2,
                                backgroundColor: "#012E5E",
                                borderRadius: 2,
                                marginTop: 3,
                            }}
                        >
                            <Avatar
                                src={getFileAvatar(files)}
                                sx={{
                                    height: 40,
                                    width: 40,
                                    borderRadius: 1,
                                    marginRight: 2,
                                }}
                            />
                            <CardContent
                                sx={{
                                    flex: "1 0 auto",
                                    padding: "8px 16px",
                                    "&:last-child": { paddingBottom: "8px" },
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    noWrap
                                    sx={{ color: "#FFFFFF" }}
                                >
                                    {files.name}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <IconButton
                                    edge="end"
                                    color="error"
                                    onClick={handleFileRemove}
                                    aria-label="delete file"
                                >
                                    <Delete />
                                </IconButton>
                            </CardActions>
                        </Card>
                    )}
                </Box>
            </DialogContent>

            <DialogActions>
                <Button sx={{ color: "#FFFFFF" }} onClick={handleClose}>
                    Close
                </Button>
                <Button sx={{ color: "#FFFFFF" }} onClick={handleSubmit}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PopupForm;
