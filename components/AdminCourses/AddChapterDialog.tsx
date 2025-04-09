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

interface AddChapterDialogProps {
    open: boolean;
    onClose: () => void;
    courseID: string | string[] | undefined;
    onChapterAdded?: () => void;
}

const AddChapterDialog = ({
    open,
    onClose,
    courseID,
    onChapterAdded,
}: AddChapterDialogProps) => {
    const [chapterTitle, setChapterTitle] = useState("");
    const [chapterFile, setChapterFile] = useState<File | null>(null);
    const router = useRouter();

    const handleSubmit = async () => {
        if (!chapterTitle || !chapterFile) {
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
            formData.append("title", chapterTitle);
            formData.append("courseID", courseID);
            formData.append("pdfFile", chapterFile);

            const response = await fetch(
                `http://localhost:8000/api/chapter/create/${courseID}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${session.user.token}`,
                    },
                    body: formData,
                }
            );
            if (response.ok) {
                alert("Chapter created successfully");
                onClose();
                if (onChapterAdded) onChapterAdded();
            } else {
                alert("Failed to create chapter");
            }
        } catch (error) {
            console.error("Error creating chapter:", error);
            alert("Error creating chapter");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ color: "black" }}>New Chapter</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Title"
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    margin="normal"
                />
                <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                    Upload PDF
                    <input
                        type="file"
                        hidden
                        accept="application/pdf"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setChapterFile(e.target.files[0]);
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
                    Post Chapter
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddChapterDialog;
