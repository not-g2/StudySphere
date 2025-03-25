"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    Button,
    Skeleton,
    IconButton,
    Dialog,
    TextField,
    Fade,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";

import Banner from "@/components/UserCourses/Banner";
import AnnouncementsList from "@/components/AdminCourses/AnnouncementsList";
import ChaptersList from "@/components/AdminCourses/ChaptersList";
import AnnouncementPopup from "@/components/announcmentpopup";
import AssignmentPopup from "@/components/assignmentpopup";
import AddAnnouncementDialog from "@/components/AdminCourses/AddAnnouncementDialog";
import AddAssignmentDialog from "@/components/AdminCourses/AddAssignmentDialog";
import AddChapterDialog from "@/components/AdminCourses/AddChapterDialog";
import SubmissionsDialog from "@/components/AdminCourses/SubmissionsDialog";

interface Announcement {
    _id: number;
    title: string;
    createdAt: string;
    description: string;
}

interface Assignment {
    _id: number;
    title: string;
    dueDate: string;
    course: string;
    description: string;
    link: string;
    createdAt: string;
}

interface Chapter {
    _id: number;
    title: string;
    createdAt: string;
    chapterPdf: string;
}

interface Student {
    _id: string;
    name: string;
}

type Session = {
    user: {
        id: string;
        token: string;
    };
    email: string;
    isAdmin: boolean;
};

const DashboardPage = () => {
    // State declarations
    const [open, setOpen] = useState(false);
    const [openAssm, setOpenAssm] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] =
        useState<Announcement | null>(null);
    const [currentAssignment, setCurrentAssignment] =
        useState<Assignment | null>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [assignmentsLoading, setAssignmentsLoading] = useState(true);
    const [announcementsLoading, setAnnouncementsLoading] = useState(true);
    const [chaptersLoading, setChaptersLoading] = useState(true);
    const [submissionsLoading, setSubmissionsLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);
    const [refresh, setRefresh] = useState<number>(0);
    const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
    const [feedbackText, setFeedbackText] = useState("");
    const [feedbackGrade, setFeedbackGrade] = useState<string>("");
    const [currentSubmission, setCurrentSubmission] = useState<any>(null);
    const [showSubmissionsPopup, setShowSubmissionsPopup] = useState(false);
    const [selectedAssignment, setSelectedAssignment] =
        useState<Assignment | null>(null);

    const [openAnnouncementForm, setOpenAnnouncementForm] = useState(false);
    const [openAssignmentForm, setOpenAssignmentForm] = useState(false);
    const [openChapterForm, setOpenChapterForm] = useState(false);

    const [attStudents, setAttStudents] = useState<Student[]>([]);
    const [attendance, setAttendance] = useState<{ [key: string]: boolean }>(
        {}
    );
    const [date, setDate] = useState<string>("");
    const [attLoading, setAttLoading] = useState(false);
    const [attError, setAttError] = useState<string | null>(null);
    const [openAttendanceDialog, setOpenAttendanceDialog] = useState(false);

    // New state for “see more” toggles and fade-in
    const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);
    const [showAllChapters, setShowAllChapters] = useState(false);
    const [fadeInAnnouncements, setFadeInAnnouncements] = useState(false);
    const [fadeInChapters, setFadeInChapters] = useState(false);

    const router = useRouter();
    const params = useParams();
    const courseID = params.id;

    // Colors for rotating assignment cards
    const cardColors = ["#0DB7F0", "#AB47BC", "#FA9F1B", "#F06292"];

    // Announcement & Assignment Handlers
    const handleAnnouncementClick = (announcement: Announcement) => {
        setCurrentAnnouncement(announcement);
        setOpen(true);
    };

    const handleAssignmentClick = (assignment: Assignment) => {
        setCurrentAssignment(assignment);
        setOpenAssm(true);
    };

    const handleCloseAnnouncement = () => {
        setOpen(false);
        setCurrentAnnouncement(null);
    };

    const handleCloseAssignment = () => {
        setOpenAssm(false);
        setCurrentAssignment(null);
    };

    const handleViewSubmissions = async (assignment: Assignment) => {
        if (!session) return;
        setSelectedAssignment(assignment);
        setSubmissionsLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8000/api/submissions/assignment/${assignment._id}/submissions`,
                {
                    headers: { Authorization: `Bearer ${session.user.token}` },
                    method: "GET",
                }
            );
            if (response.ok) {
                const data = await response.json();
                setSubmissions(data);
            } else {
                console.error("Failed to fetch submissions", response.status);
            }
        } catch (error) {
            console.error("Error fetching submissions:", error);
        } finally {
            setSubmissionsLoading(false);
            setShowSubmissionsPopup(true);
        }
    };

    const handleDeleteAssignment = async (assignmentId: number | string) => {
        if (!window.confirm("Are you sure you want to delete this assignment?"))
            return;
        if (!session) return;
        try {
            const response = await fetch(
                `http://localhost:8000/api/assgn/${assignmentId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${session.user.token}` },
                }
            );
            if (response.ok) {
                alert("Assignment deleted successfully.");
                setRefresh((prev) => prev + 1);
            } else {
                alert("Failed to delete assignment.");
            }
        } catch (error) {
            console.error("Error deleting assignment:", error);
            alert("Error deleting assignment.");
        }
    };

    const handleUpdateAssignment = (assignment: Assignment) => {
        setCurrentAssignment(assignment);
        setOpenAssm(true);
    };

    // Delete Announcement Handler
    const handleDeleteAnnouncement = async (announcementId: number) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this announcement?"
            )
        )
            return;
        if (!session) return;
        try {
            const response = await fetch(
                `http://localhost:8000/api/announce/delete/${announcementId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.user.token}`,
                    },
                    body: JSON.stringify({ courseId: courseID }),
                }
            );
            if (response.ok) {
                alert("Announcement deleted successfully.");
                setRefresh((prev) => prev + 1);
            } else {
                alert("Failed to delete announcement.");
            }
        } catch (error) {
            console.error("Error deleting announcement:", error);
            alert("Error deleting announcement.");
        }
    };

    // Feedback Handlers
    const openFeedbackDialog = (submission: any) => {
        setCurrentSubmission(submission);
        setFeedbackText("");
        setFeedbackGrade("");
        setFeedbackDialogOpen(true);
    };

    const handleSubmitFeedback = async () => {
        if (!session || !currentSubmission || !selectedAssignment) return;
        try {
            const response = await fetch(
                `http://localhost:8000/api/submissions/submission/${currentSubmission._id}/feedback`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.user.token}`,
                    },
                    body: JSON.stringify({
                        studentId:
                            typeof currentSubmission.studentId === "object"
                                ? currentSubmission.studentId._id
                                : currentSubmission.studentId,
                        assignmentId: selectedAssignment._id,
                        feedback: feedbackText,
                        grade: feedbackGrade
                            ? Number(feedbackGrade)
                            : undefined,
                    }),
                }
            );
            if (response.ok) {
                alert("Feedback submitted successfully.");
                setFeedbackDialogOpen(false);
                handleViewSubmissions(selectedAssignment);
            } else {
                alert("Failed to submit feedback.");
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("Error submitting feedback.");
        }
    };

    const handleMarkSubmissionCorrected = async (submissionId: string) => {
        if (!session) return;
        try {
            const response = await fetch(
                `http://localhost:8000/api/submissions/approve/${submissionId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.user.token}`,
                    },
                }
            );
            if (response.ok) {
                alert("Submission marked as corrected.");
                if (selectedAssignment) {
                    handleViewSubmissions(selectedAssignment);
                }
            } else {
                alert("Failed to mark submission as corrected.");
            }
        } catch (error) {
            console.error("Error marking submission as corrected:", error);
            alert("Error marking submission as corrected.");
        }
    };

    // Fetch Dashboard Data
    useEffect(() => {
        const fetchDashboardData = async () => {
            const sessionData: string | undefined = Cookies.get("session");
            if (sessionData && !session) {
                setSession(JSON.parse(sessionData));
            } else if (!sessionData) {
                router.push("/");
            }

            if (session) {
                const token = session.user.token;

                // Fetch assignments
                try {
                    const response = await fetch(
                        `http://localhost:8000/api/assgn/course/${courseID}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                            method: "GET",
                        }
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setAssignments(data);
                    } else {
                        console.error("Failed to get assignment details");
                    }
                } catch (error) {
                    console.error("Error getting assignment details:", error);
                } finally {
                    setAssignmentsLoading(false);
                }

                // Fetch announcements
                try {
                    const response = await fetch(
                        `http://localhost:8000/api/announce/${courseID}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                            method: "GET",
                        }
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setAnnouncements(data);
                    } else {
                        console.error("Failed to get announcement details");
                    }
                } catch (error) {
                    console.error("Error getting announcement details:", error);
                } finally {
                    setAnnouncementsLoading(false);
                }

                // Fetch chapters
                try {
                    const response = await fetch(
                        `http://localhost:8000/api/chapter/get/${courseID}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                            method: "GET",
                        }
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setChapters(data);
                    } else {
                        console.error("Failed to get chapter details");
                    }
                } catch (error) {
                    console.error("Error getting chapter details:", error);
                } finally {
                    setChaptersLoading(false);
                }
            }
        };

        fetchDashboardData();
    }, [session, router, refresh, courseID]);

    // Trigger fade in for announcements once loaded
    useEffect(() => {
        if (!announcementsLoading) {
            setTimeout(() => {
                setFadeInAnnouncements(true);
            }, 300);
        }
    }, [announcementsLoading]);

    // Trigger fade in for chapters once loaded (with a longer delay so it appears after announcements)
    useEffect(() => {
        if (!chaptersLoading) {
            setTimeout(() => {
                setFadeInChapters(true);
            }, 600);
        }
    }, [chaptersLoading]);

    // Attendance: Fetch students
    useEffect(() => {
        const fetchAttendanceStudents = async () => {
            try {
                if (!session) return;
                const token = session.user.token;
                if (!courseID) throw new Error("Course ID not found.");

                const response = await fetch(
                    `http://localhost:8000/api/courses/${courseID}/students`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch students.");
                }

                const data = await response.json();
                setAttStudents(data.students);
                const initAttendance = data.students.reduce(
                    (acc: { [key: string]: boolean }, student: Student) => {
                        acc[student._id] = false;
                        return acc;
                    },
                    {}
                );
                setAttendance(initAttendance);
            } catch (error) {
                console.error("Error fetching attendance students:", error);
                setAttError(
                    "Failed to load attendance students. Please try again later."
                );
            }
        };

        if (session && courseID) {
            fetchAttendanceStudents();
        }
    }, [session, courseID]);

    // Attendance: Handle date change
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);
        const newAttendance = attStudents.reduce(
            (acc: { [key: string]: boolean }, student: Student) => {
                acc[student._id] = false;
                return acc;
            },
            {}
        );
        setAttendance(newAttendance);
    };

    // Attendance: Fetch each student's attendance summary for selected date
    useEffect(() => {
        const fetchAttendanceForStudents = async () => {
            if (!date || !session) return;
            const token = session.user.token;
            const updatedAttendance: { [key: string]: boolean } = {
                ...attendance,
            };

            await Promise.all(
                attStudents.map(async (student) => {
                    try {
                        const response = await fetch(
                            `http://localhost:8000/api/adminauth/summary/${student._id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        if (!response.ok) {
                            throw new Error(
                                `Failed to fetch summary for student ${student._id}`
                            );
                        }
                        const data = await response.json();
                        let found = false;
                        for (const course in data.attendance) {
                            const record = data.attendance[course].find(
                                (rec: any) => {
                                    const recordDate = new Date(rec.date)
                                        .toISOString()
                                        .slice(0, 10);
                                    return recordDate === date;
                                }
                            );
                            if (record) {
                                updatedAttendance[student._id] =
                                    record.status === "present";
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            updatedAttendance[student._id] = false;
                        }
                    } catch (err) {
                        console.error(
                            "Error fetching attendance summary for student",
                            student._id,
                            err
                        );
                        updatedAttendance[student._id] = false;
                    }
                })
            );
            setAttendance(updatedAttendance);
        };

        fetchAttendanceForStudents();
    }, [date, session, attStudents]);

    // Attendance: Toggle attendance checkbox
    const toggleAttendance = (studentId: string) => {
        setAttendance((prev) => ({
            ...prev,
            [studentId]: !prev[studentId],
        }));
    };

    // Attendance: Handle submit attendance
    const handleSubmitAttendance = async () => {
        if (!date) {
            alert("Please select a date.");
            return;
        }

        const sessionData: string | undefined = Cookies.get("session");

        if (!sessionData) {
            setAttError("Session not found. Please log in again.");
            router.push("/");
            return;
        }

        const sessionFromCookie = JSON.parse(sessionData);
        const token = sessionFromCookie.user.token;
        if (!token) {
            setAttError("Authentication token not found. Please log in again.");
            return;
        }

        setAttLoading(true);
        setAttError(null);

        const attendanceData = attStudents.map((student) => ({
            userId: student._id,
            courseId: courseID,
            date,
            status: attendance[student._id] ? "present" : "absent",
        }));

        try {
            await Promise.all(
                attendanceData.map(async (record) => {
                    const response = await fetch(
                        "http://localhost:8000/api/adminauth/post/mark",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(record),
                        }
                    );
                    if (!response.ok) {
                        throw new Error(
                            `Failed to mark attendance for ${record.userId}`
                        );
                    }
                })
            );
            alert(`Attendance for ${date} has been recorded!`);
        } catch (error) {
            setAttError("Failed to submit attendance. Please try again.");
            console.error("Error submitting attendance:", error);
        } finally {
            setAttLoading(false);
        }
    };

    // Prepare limited lists for announcements and chapters
    const displayedAnnouncements = showAllAnnouncements
        ? announcements
        : announcements.slice(0, 4);

    // Memoize displayedChapters so its reference doesn’t change unnecessarily.
    const displayedChapters = useMemo(() => {
        return showAllChapters ? chapters : chapters.slice(0, 4);
    }, [showAllChapters, chapters]);

    return (
        <Box
            sx={{ backgroundColor: "#F4F6F8", minHeight: "100vh", padding: 4 }}
        >
            <Banner
                courseTitle="Mathematics"
                bannerImage="/mbanner.png"
                professorImage="/teach1.jpg"
            />

            {/* Attendance Icon */}
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <IconButton onClick={() => setOpenAttendanceDialog(true)}>
                    <EventAvailableIcon sx={{ color: "black" }} />
                </IconButton>
            </Box>

            {/* Top section: Announcements & Chapters side by side */}
            <Grid container spacing={4} mb={4}>
                <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="h5" color="black" sx={{ mr: 1 }}>
                            Announcements
                        </Typography>
                        <IconButton
                            onClick={() => setOpenAnnouncementForm(true)}
                        >
                            <AddIcon />
                        </IconButton>
                    </Box>
                    {announcementsLoading ? (
                        <Grid container spacing={2}>
                            {Array.from(new Array(3)).map((_, index) => (
                                <Grid item xs={12} key={index}>
                                    <Skeleton
                                        variant="rectangular"
                                        height={80}
                                        sx={{ borderRadius: 2 }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Fade in={fadeInAnnouncements} timeout={500}>
                            <div>
                                <AnnouncementsList
                                    announcements={displayedAnnouncements}
                                    onAnnouncementClick={
                                        handleAnnouncementClick
                                    }
                                    onAnnouncementDelete={
                                        handleDeleteAnnouncement
                                    }
                                />
                            </div>
                        </Fade>
                    )}
                    {announcements.length > 4 && !announcementsLoading && (
                        <Button
                            onClick={() =>
                                setShowAllAnnouncements((prev) => !prev)
                            }
                            size="small"
                        >
                            {showAllAnnouncements ? "Collapse" : "See More"}
                        </Button>
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="h5" color="black" sx={{ mr: 1 }}>
                            Chapters
                        </Typography>
                        <IconButton onClick={() => setOpenChapterForm(true)}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                    {chaptersLoading ? (
                        <Grid container spacing={2}>
                            {Array.from(new Array(3)).map((_, index) => (
                                <Grid item xs={12} key={index}>
                                    <Skeleton
                                        variant="rectangular"
                                        height={60}
                                        sx={{ borderRadius: 2 }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Fade in={fadeInChapters} timeout={500}>
                            <div>
                                <ChaptersList chapters={displayedChapters} />
                            </div>
                        </Fade>
                    )}
                    {chapters.length > 4 && !chaptersLoading && (
                        <Button
                            onClick={() => setShowAllChapters((prev) => !prev)}
                            size="small"
                        >
                            {showAllChapters ? "Collapse" : "See More"}
                        </Button>
                    )}
                </Grid>
            </Grid>

            {/* Assignments Section */}
            <Box mt={4}>
                <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="h5" color="black" sx={{ mr: 1 }}>
                        Assignments
                    </Typography>
                    <IconButton onClick={() => setOpenAssignmentForm(true)}>
                        <AddIcon />
                    </IconButton>
                </Box>
                {assignmentsLoading ? (
                    <Grid container spacing={2}>
                        {Array.from(new Array(3)).map((_, index) => (
                            <Grid item xs={12} key={index}>
                                <Skeleton
                                    variant="rectangular"
                                    height={100}
                                    sx={{ borderRadius: 2 }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : assignments.length > 0 ? (
                    <Box>
                        {assignments.map((assignment, index) => (
                            <Card
                                key={assignment._id}
                                sx={{
                                    backgroundColor:
                                        cardColors[index % cardColors.length],
                                    padding: 2,
                                    marginBottom: 2,
                                }}
                            >
                                <Box>
                                    <Typography variant="h6" color="white">
                                        {assignment.title}
                                    </Typography>
                                    <Typography variant="body2" color="white">
                                        {assignment.description}
                                    </Typography>
                                    <Typography variant="caption" color="white">
                                        Due: {assignment.dueDate}
                                    </Typography>
                                </Box>
                                <Box mt={1} display="flex" gap={1}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        color="primary"
                                        onClick={() =>
                                            handleUpdateAssignment(assignment)
                                        }
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        color="error"
                                        onClick={() =>
                                            handleDeleteAssignment(
                                                assignment._id
                                            )
                                        }
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        color="success"
                                        onClick={() =>
                                            handleViewSubmissions(assignment)
                                        }
                                    >
                                        View Submissions
                                    </Button>
                                </Box>
                            </Card>
                        ))}
                    </Box>
                ) : (
                    <Typography color="black">
                        No assignments available
                    </Typography>
                )}
            </Box>

            {/* Dialogs */}
            <AddAnnouncementDialog
                open={openAnnouncementForm}
                onClose={() => setOpenAnnouncementForm(false)}
                courseID={courseID}
                onAnnouncementAdded={() => setRefresh((prev) => prev + 1)}
            />

            <AddAssignmentDialog
                open={openAssignmentForm}
                onClose={() => setOpenAssignmentForm(false)}
                courseID={courseID}
                onAssignmentAdded={() => setRefresh((prev) => prev + 1)}
            />

            <AddChapterDialog
                open={openChapterForm}
                onClose={() => setOpenChapterForm(false)}
                courseID={courseID}
                onChapterAdded={() => setRefresh((prev) => prev + 1)}
            />

            <AnnouncementPopup
                open={open}
                handleClose={handleCloseAnnouncement}
                announcement={currentAnnouncement}
            />
            <AssignmentPopup
                open={openAssm}
                handleClose={handleCloseAssignment}
                assignment={currentAssignment}
                adminId={session?.user.id}
            />

            <SubmissionsDialog
                open={showSubmissionsPopup}
                onClose={() => setShowSubmissionsPopup(false)}
                submissions={submissions}
                submissionsLoading={submissionsLoading}
                selectedAssignmentTitle={selectedAssignment?.title || ""}
                onFeedbackClick={openFeedbackDialog}
            />

            {/* Feedback Dialog */}
            <Dialog
                open={feedbackDialogOpen}
                onClose={() => setFeedbackDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <Box>
                    <Typography variant="h6" sx={{ color: "black", p: 2 }}>
                        Provide Feedback
                    </Typography>
                    <Box sx={{ p: 2 }}>
                        <TextField
                            fullWidth
                            label="Feedback"
                            multiline
                            rows={4}
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            margin="normal"
                            InputLabelProps={{ style: { color: "black" } }}
                            InputProps={{ style: { color: "black" } }}
                        />
                        <TextField
                            fullWidth
                            label="Grade (optional)"
                            value={feedbackGrade}
                            onChange={(e) => setFeedbackGrade(e.target.value)}
                            margin="normal"
                            InputLabelProps={{ style: { color: "black" } }}
                            InputProps={{ style: { color: "black" } }}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            p: 2,
                        }}
                    >
                        <Button
                            onClick={() => setFeedbackDialogOpen(false)}
                            color="secondary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmitFeedback}
                            variant="contained"
                            color="primary"
                            sx={{ ml: 1 }}
                        >
                            Submit Feedback
                        </Button>
                    </Box>
                </Box>
            </Dialog>

            {/* Attendance Dialog */}
            <Dialog
                open={openAttendanceDialog}
                onClose={() => setOpenAttendanceDialog(false)}
                fullWidth
                maxWidth="sm"
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="h5" color="black" sx={{ mb: 2 }}>
                        Attendance
                    </Typography>
                    <TextField
                        type="date"
                        label="Select Date"
                        value={date}
                        onChange={handleDateChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                        fullWidth
                    />
                    <Box>
                        {attStudents.map((student) => (
                            <Box
                                key={student._id}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 1,
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={attendance[student._id] || false}
                                    onChange={() =>
                                        toggleAttendance(student._id)
                                    }
                                    style={{ marginRight: "8px" }}
                                />
                                <Typography>{student.name}</Typography>
                            </Box>
                        ))}
                    </Box>
                    <Button
                        onClick={handleSubmitAttendance}
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        disabled={attLoading}
                    >
                        {attLoading ? "Submitting..." : "Submit Attendance"}
                    </Button>
                    {attError && (
                        <Typography color="red" sx={{ mt: 2 }}>
                            {attError}
                        </Typography>
                    )}
                </Box>
            </Dialog>
        </Box>
    );
};

export default DashboardPage;
