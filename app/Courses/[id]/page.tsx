"use client";

import {
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Badge,
    Box,
    Avatar,
} from "@mui/material";
import professorImage from "../../../public/teach1.jpg";
import bannerImage from "../../../public/mbanner.png";
import AnnouncementPopup from "../../../components/announcmentpopup";
import AssignmentPopup from "../../../components/assignmentpopup";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";
import { format, formatDate } from "date-fns";

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

type Session = {
    user: {
        id: string;
        token: string;
    };
    email: string;
    isAdmin: boolean;
};

const DashboardPage = () => {
    const [open, setOpen] = useState(false);
    const [openAssm, setOpenAssm] = useState(false);
    const [currentAnnouncement, setCurrentAnnouncement] =
        useState<Announcement | null>(null);
    const [currentAssignment, setCurrentAssignment] =
        useState<Assignment | null>(null);
    const [assignments, setassignments] = useState<Assignment[]>([]);
    const [announcements, setannouncements] = useState<Announcement[]>([]);
    const [chapters, setchapters] = useState<Chapter[]>([]);
    const [submissions, setSubmissions] = useState<any[]>([]);

    const handleClickOpen = (announcement: Announcement) => {
        setCurrentAnnouncement(announcement);
        setOpen(true);
    };
    const [session, setSession] = useState<Session | null>(null);
    const router = useRouter();
    const params = useParams();
    const courseID = params.id;

    const handleClose = () => {
        setOpen(false);
        setCurrentAnnouncement(null);
    };

    const handleClickOpenAssm = (assignment: Assignment) => {
        setCurrentAssignment(assignment);
        setOpenAssm(true);
    };

    const handleCloseAssm = () => {
        setOpenAssm(false);
        setCurrentAssignment(null);
    };

    const formatdate = (date: string) => {
        const formattedDate = format(new Date(date), "MMMM dd, yyyy HH:mm:ss");
        return formattedDate;
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            const sessionData: string | undefined = Cookies.get("session");

            if (sessionData && !session) {
                setSession(JSON.parse(sessionData));
            } else if (!sessionData) {
                router.push("/auth/signin");
            }

            if (session) {
                const token = session?.user.token;

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
                        setassignments(data);
                    } else {
                        console.error("Failed to get Assignment details");
                    }
                } catch (error) {
                    console.error("Error getting Assignment Details:", error);
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
                        setannouncements(data);
                    } else {
                        console.error("Failed to get Announcement details");
                    }
                } catch (error) {
                    console.error("Error getting Announcement Details:", error);
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
                        setchapters(data);
                    } else {
                        console.error("Failed to get Chapter details");
                    }
                } catch (error) {
                    console.error("Error getting Chapter Details:", error);
                }

                // Fetch submissions
                try {
                    const response = await fetch(
                        `http://localhost:8000/api/submissions/submissions/${session.user.id}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                            method: "GET",
                        }
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setSubmissions(data);
                    } else {
                        console.error("Failed to get Submission details");
                    }
                } catch (error) {
                    console.error("Error getting Submission Details:", error);
                }
            }
        };

        fetchDashboardData();
    }, [session]);

    const isSubmitted = (assignmentId: number) => {
        return submissions.some(
            (submission) =>
                submission.assignmentId._id === assignmentId &&
                submission.status === "submitted"
        );
    };

    const calculateTimeLeft = (dueDate: string) => {
        const currentDate = new Date();
        const targetDate = new Date(dueDate);
    
        const timeDifference = targetDate.getTime() - currentDate.getTime();
    
        // If the time difference is positive, calculate remaining time
        if (timeDifference > 0) {
            const daysLeft = Math.floor(timeDifference / (1000 * 3600 * 24)); // Calculate full days
            const hoursLeft = Math.floor((timeDifference % (1000 * 3600 * 24)) / (1000 * 3600)); // Remaining hours after days
    
            // If less than a day is remaining, return the hours
            if (daysLeft < 1) {
                return `${hoursLeft} hours left`;
            } else {
                return `${daysLeft} days left`;
            }
        } else {
            return "Expired"; // If due date is in the past
        }
    };

    return (
        <Box
            className="bg-c2"
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                padding: 4,
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    height: 200,
                    backgroundImage: `url(${bannerImage.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    padding: 3,
                    color: "#ffffff",
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    Course: Mathematics
                </Typography>

                <Avatar
                    alt="Professor Name"
                    src={professorImage.src}
                    sx={{
                        position: "absolute",
                        right: 20,
                        width: 120,
                        height: 120,
                        border: "3px solid white",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                    }}
                />
            </Box>

            <Grid container spacing={4} mt={2} sx={{ flex: 1 }}>
                <Grid item xs={12} md={8}>
                    <Typography
                        variant="h5"
                        gutterBottom
                        className="text-white"
                    >
                        Assignments Due
                    </Typography>
                    {assignments && assignments.length > 0 ? (
                        assignments.map((assignment) => (
                            <Card
                                key={assignment._id}
                                className="bg-c5 text-white"
                                sx={{
                                    marginBottom: 2,
                                    padding: 2,
                                    borderRadius: 2,
                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {assignment.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "#d3d3d3" }}
                                    >
                                        Due Date:{" "}
                                        {formatdate(assignment.dueDate)}
                                    </Typography>
                                </CardContent>
                                {!isSubmitted(assignment._id) ? (
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                            handleClickOpenAssm(assignment)
                                        }
                                    >
                                        View Details
                                    </Button>
                                ) : (
                                    <Typography sx={{ color: "green", marginLeft: 2 }}>
                                        Submitted
                                    </Typography>
                                )}
                            </Card>
                        ))
                    ) : (
                        <Typography>No assignments available</Typography>
                    )}
                </Grid>

                <Grid item xs={12} md={4}>
                    <Typography
                        variant="h5"
                        gutterBottom
                        className="text-white"
                    >
                        Announcements
                    </Typography>
                    <Box
                        sx={{
                            maxHeight: 400,
                            overflowY: "auto",
                            paddingRight: 1,
                            "&::-webkit-scrollbar": {
                                display: "none",
                            },
                        }}
                    >
                        {announcements.map((announcement) => (
                            <Card
                                key={announcement._id}
                                className="bg-c5 text-white"
                                sx={{
                                    marginBottom: 1,
                                    borderRadius: 2,
                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                                    cursor: "pointer",
                                }}
                                onClick={() => handleClickOpen(announcement)}
                            >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {announcement.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "#d3d3d3" }}
                                    >
                                        Posted on:{" "}
                                        {formatdate(announcement.createdAt)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>

                    <Box sx={{ marginTop: 10 }}>
                        <Typography
                            variant="h5"
                            gutterBottom
                            className="text-white"
                        >
                            Chapters
                        </Typography>
                        <Box
                            sx={{
                                maxHeight: 400,
                                overflowY: "auto",
                                paddingRight: 1,
                                "&::-webkit-scrollbar": {
                                    display: "none",
                                },
                            }}
                        >
                            {chapters &&
                                chapters.map((chapter) => (
                                    <Card
                                        key={chapter._id}
                                        className="bg-c5 text-white"
                                        sx={{
                                            marginBottom: 1,
                                            borderRadius: 2,
                                            boxShadow:
                                                "0px 4px 8px rgba(0, 0, 0, 0.2)",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            window.open(
                                                chapter.chapterPdf,
                                                "_blank"
                                            );
                                        }}
                                    >
                                        <CardContent>
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                            >
                                                {chapter.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: "#d3d3d3" }}
                                            >
                                                Posted on:{" "}
                                                {formatdate(chapter.createdAt)}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <AnnouncementPopup
                open={open}
                handleClose={handleClose}
                announcement={currentAnnouncement}
            />
            <AssignmentPopup
                open={openAssm}
                handleClose={handleCloseAssm}
                assignment={currentAssignment}
                studentId={session?.user.id}
            />
        </Box>
    );
};

export default DashboardPage;
