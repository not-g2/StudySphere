"use client";
import { Typography, Grid, Box } from "@mui/material";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";

import Banner from "@/components/UserCourses/Banner";
import AssignmentsList from "@/components/UserCourses/AssignmentsList";
import AnnouncementsList from "@/components/UserCourses/AnnouncementsList";
import ChaptersList from "@/components/UserCourses/ChaptersList";
import AnnouncementPopup from "@/components/announcmentpopup";
import AssignmentPopup from "@/components/assignmentpopup";
import { Announcement } from "@/types/announcements";
import { Assignment } from "@/types/assignment";
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
    const [assignmentsLoading, setAssignmentsLoading] = useState(true);
    const [submissionsLoading, setSubmissionsLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);
    const router = useRouter();
    const params = useParams();
    const courseID = params.id;

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

    useEffect(() => {
        const fetchDashboardData = async () => {
            const sessionData: string | undefined = Cookies.get("session");

            if (sessionData && !session) {
                setSession(JSON.parse(sessionData));
            } else if (!sessionData) {
                router.push("/auth/signin");
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
                        setassignments(data);
                    } else {
                        console.error("Failed to get Assignment details");
                    }
                } catch (error) {
                    console.error("Error getting Assignment Details:", error);
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
                        console.log(data);
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
                        console.log(data, response);
                    } else {
                        console.error("Failed to get Submission details");
                    }
                } catch (error) {
                    console.error("Error getting Submission Details:", error);
                } finally {
                    setSubmissionsLoading(false);
                }
            }
        };

        fetchDashboardData();
    }, [session]);

    const isSubmitted = (assignmentId: number) => {
        console.log(submissions);
        return submissions.some(
            (submission) =>
                submission.assignmentId._id === assignmentId &&
                submission.status === "submitted"
        );
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
            <Banner
                courseTitle="Mathematics"
                bannerImage="/mbanner.png"
                professorImage="/teach1.jpg"
            />
            <Grid container spacing={4} mt={2} sx={{ flex: 1 }}>
                <Grid item xs={12} md={8}>
                    {assignmentsLoading ? (
                        <Typography style={{ color: "#fff" }}>
                            Loading assignments...
                        </Typography>
                    ) : assignments.length > 0 ? (
                        <AssignmentsList
                            assignments={assignments}
                            submissionsLoading={submissionsLoading}
                            isSubmitted={isSubmitted}
                            onAssignmentClick={handleAssignmentClick}
                        />
                    ) : (
                        <Typography style={{ color: "#fff" }}>
                            No assignments available
                        </Typography>
                    )}
                </Grid>
                <Grid item xs={12} md={4}>
                    <AnnouncementsList
                        announcements={announcements}
                        onAnnouncementClick={handleAnnouncementClick}
                    />
                    <Box sx={{ marginTop: 10 }}>
                        <ChaptersList chapters={chapters} />
                    </Box>
                </Grid>
            </Grid>

            <AnnouncementPopup
                open={open}
                handleClose={handleCloseAnnouncement}
                announcement={currentAnnouncement}
            />
            <AssignmentPopup
                open={openAssm}
                handleClose={handleCloseAssignment}
                assignment={currentAssignment}
                studentId={session?.user.id}
            />
        </Box>
    );
};

export default DashboardPage;
