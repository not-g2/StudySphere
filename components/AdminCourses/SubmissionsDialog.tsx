"use client";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Card,
    Typography,
    Button,
} from "@mui/material";

interface SubmissionsDialogProps {
    open: boolean;
    onClose: () => void;
    submissions: any[];
    submissionsLoading: boolean;
    selectedAssignmentTitle: string;
    onFeedbackClick: (submission: any) => void;
}

const SubmissionsDialog = ({
    open,
    onClose,
    submissions,
    submissionsLoading,
    selectedAssignmentTitle,
    onFeedbackClick,
}: SubmissionsDialogProps) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ color: "black" }}>
                Submissions for: {selectedAssignmentTitle}
            </DialogTitle>
            <DialogContent dividers>
                {submissionsLoading ? (
                    <Typography color="black">
                        Loading submissions...
                    </Typography>
                ) : submissions.length > 0 ? (
                    submissions.map((submission: any) => (
                        <Card
                            key={submission._id}
                            sx={{
                                backgroundColor: "#ffffff",
                                padding: 2,
                                marginBottom: 2,
                            }}
                        >
                            <Typography variant="subtitle2" color="black">
                                Student:{" "}
                                {submission.studentName ||
                                    (submission.studentId &&
                                    typeof submission.studentId === "object"
                                        ? submission.studentId.name
                                        : submission.studentId)}
                            </Typography>
                            <Typography variant="body2" color="black">
                                Status: {submission.status}
                            </Typography>
                            <Typography variant="body2" color="black">
                                File:{" "}
                                <a
                                    href={submission.fileLink}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {submission.fileLink}
                                </a>
                            </Typography>
                            <Button
                                variant="contained"
                                size="small"
                                color="success"
                                onClick={() => onFeedbackClick(submission)}
                                sx={{ marginTop: 1 }}
                            >
                                {submission.status === "graded"
                                    ? "Update Feedback"
                                    : "Mark as Corrected"}
                            </Button>
                        </Card>
                    ))
                ) : (
                    <Typography color="black">
                        No submissions found for this assignment.
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SubmissionsDialog;
