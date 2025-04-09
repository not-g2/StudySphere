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

interface AddAnnouncementDialogProps {
    open: boolean;
    onClose: () => void;
    courseID: string | undefined | string[];
    onAnnouncementAdded?: () => void;
}

const AddAnnouncementDialog = ({
    open,
    onClose,
    courseID,
    onAnnouncementAdded,
}: AddAnnouncementDialogProps) => {
    const [announcementTitle, setAnnouncementTitle] = useState("");
    const [announcementDescription, setAnnouncementDescription] = useState("");
    const router = useRouter();

    const handleSubmit = async () => {
        if (!announcementTitle || !announcementDescription) {
            alert("Please fill in all fields.");
            return;
        }
        try {
            const sessionData = Cookies.get("session");
            if (!sessionData) {
                router.push("/auth/signin");
                return;
            }
            const session = JSON.parse(sessionData);
            const response = await fetch(
                "http://localhost:8000/api/adminauth/post/announcement",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.user.token}`,
                    },
                    body: JSON.stringify({
                        title: announcementTitle,
                        description: announcementDescription,
                        course: courseID,
                    }),
                }
            );
            if (response.ok) {
                alert("Announcement posted successfully");
                onClose();
                if (onAnnouncementAdded) onAnnouncementAdded();
            } else {
                alert("Failed to post announcement");
            }
        } catch (error) {
            console.error("Error posting announcement:", error);
            alert("Error posting announcement");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ color: "black" }}>New Announcement</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Title"
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={announcementDescription}
                    onChange={(e) => setAnnouncementDescription(e.target.value)}
                    margin="normal"
                />
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
                    Post Announcement
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddAnnouncementDialog;
