"use client";
import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface AddAssignmentDialogProps {
    open: boolean;
    onClose: () => void;
    courseID: string | string[] | undefined;
    onAssignmentAdded?: () => void;
}

const AddAssignmentDialog = ({
    open,
    onClose,
    courseID,
    onAssignmentAdded,
}: AddAssignmentDialogProps) => {
    const [assignmentTitle, setAssignmentTitle] = useState("");
    const [assignmentDescription, setAssignmentDescription] = useState("");
    const [assignmentDueDate, setAssignmentDueDate] = useState("");
    const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
    const router = useRouter();

    const handleSubmit = async () => {
        if (!assignmentTitle || !assignmentDueDate || !assignmentFile) {
            alert("Please fill in all required fields.");
            return;
        }
        try {
            const sessionData = Cookies.get("session");
            if (!sessionData) {
                router.push("/auth/signin");
                return;
            }
            const session = JSON.parse(sessionData);
            const formData = new FormData();
            formData.append("title", assignmentTitle);
            formData.append("description", assignmentDescription);
            if (typeof courseID !== "string") {
                alert("Invalid course ID.");
                return;
            }
            formData.append("course", courseID);

            formData.append("dueDate", assignmentDueDate);
            formData.append("createdBy", session.user.id);
            formData.append("pdfFile", assignmentFile);

            const response = await fetch(
                "http://localhost:8000/api/adminauth/post/assgn",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${session.user.token}`,
                    },
                    body: formData,
                }
            );
            if (response.ok) {
                alert("Assignment created successfully");
                onClose();
                if (onAssignmentAdded) onAssignmentAdded();
            } else {
                alert("Failed to create assignment");
            }
        } catch (error) {
            console.error("Error creating assignment:", error);
            alert("Error creating assignment");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ color: "black" }}>New Assignment</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Title"
                    value={assignmentTitle}
                    onChange={(e) => setAssignmentTitle(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Description"
                    value={assignmentDescription}
                    onChange={(e) => setAssignmentDescription(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Due Date"
                    type="date"
                    value={assignmentDueDate}
                    onChange={(e) => setAssignmentDueDate(e.target.value)}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                    Upload PDF
                    <input
                        type="file"
                        hidden
                        accept="application/pdf"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setAssignmentFile(e.target.files[0]);
                            }
                        }}
                    />
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                >
                    Post Assignment
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddAssignmentDialog;
