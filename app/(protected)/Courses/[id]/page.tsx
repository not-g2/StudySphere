// app/(protected)/Courses/[id]/page.tsx (DashboardPage.tsx)
"use client";

import { Typography, Grid, Box } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
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
  // 1) Define the palette of dark gradients
  const gradientOptions = [
    "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    "linear-gradient(120deg, #232526 0%, #414345 100%)",
    "radial-gradient(circle at top left, #0f0c29, #302b63, #24243e)",
    "linear-gradient(200deg, #1f1c2c 0%, #928dab 100%)",
  ];

  // 2) Pick one gradient once on component mount:
  const bannerGradient = useMemo(
    () =>
      gradientOptions[
        Math.floor(Math.random() * gradientOptions.length)
      ],
    []
  );

  const [open, setOpen] = useState(false);
  const [openAssm, setOpenAssm] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  const router = useRouter();
  const params = useParams();
  const courseID = params.id as string;

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
      const sessionData = Cookies.get("session");
      if (sessionData && !session) {
        setSession(JSON.parse(sessionData));
      } else if (!sessionData) {
        router.push("/auth/signin");
        return;
      }

      if (!session) return;
      const token = session.user.token;

      // assignments
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/assgn/course/${courseID}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) setAssignments(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setAssignmentsLoading(false);
      }

      // announcements
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/announce/${courseID}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) setAnnouncements(await res.json());
      } catch (err) {
        console.error(err);
      }

      // chapters
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/chapter/get/${courseID}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) setChapters(await res.json());
      } catch (err) {
        console.error(err);
      }

      // submissions
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/submissions/submissions/${session.user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) setSubmissions(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setSubmissionsLoading(false);
      }
    };

    fetchDashboardData();
  }, [session, courseID, router]);

  const isSubmitted = (assignmentId: number) =>
    submissions.some(
      (sub) =>
        sub.assignmentId._id === assignmentId && sub.status === "submitted"
    );

  return (
    <Box
      sx={{
        backgroundColor: "#f7f7f7",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: 4,
      }}
    >
      {/* pass the one‑time random gradient */}
      <Banner
        courseTitle={courseID}
        gradient={bannerGradient}
        professorImage="/teach1.jpg"
      />

      <Grid container spacing={4} mt={2} sx={{ flex: 1 }}>
        <Grid item xs={12} md={8}>
          {assignmentsLoading ? (
            <Typography style={{ color: "#000" }}>
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
            <Typography style={{ color: "#000" }}>
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
