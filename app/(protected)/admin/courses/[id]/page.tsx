// app/(protected)/admin/courses/[id]/page.tsx
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

import GradientBanner from "@/components/UserCourses/GradientBanner";
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
  // === STATE ===
  const [session, setSession] = useState<Session | null>(null);
  const [refresh, setRefresh] = useState(0);

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chaptersLoading, setChaptersLoading] = useState(true);

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);

  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  const [openAnnouncementPopup, setOpenAnnouncementPopup] = useState(false);

  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [openAssignmentPopup, setOpenAssignmentPopup] = useState(false);

  const [openAnnouncementForm, setOpenAnnouncementForm] = useState(false);
  const [openAssignmentForm, setOpenAssignmentForm] = useState(false);
  const [openChapterForm, setOpenChapterForm] = useState(false);

  const [openSubmissionsDialog, setOpenSubmissionsDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState<any>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackGrade, setFeedbackGrade] = useState<string>("");

  const [attStudents, setAttStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [date, setDate] = useState<string>("");
  const [attLoading, setAttLoading] = useState(false);
  const [attError, setAttError] = useState<string | null>(null);
  const [openAttendanceDialog, setOpenAttendanceDialog] = useState(false);

  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);
  const [showAllChapters, setShowAllChapters] = useState(false);
  const [fadeInAnnouncements, setFadeInAnnouncements] = useState(false);
  const [fadeInChapters, setFadeInChapters] = useState(false);

  const router = useRouter();
  const params = useParams();
  const courseID = params.id as string;

  const cardColors = ["#0A6EA8", "#6A1B9A", "#F57C00", "#C2185B"];

  // === HANDLERS ===

  // Announcements
  const handleAnnouncementClick = (a: Announcement) => {
    setCurrentAnnouncement(a);
    setOpenAnnouncementPopup(true);
  };
  const handleCloseAnnouncement = () => {
    setOpenAnnouncementPopup(false);
    setCurrentAnnouncement(null);
  };
  const handleDeleteAnnouncement = async (id: number) => {
    if (!session || !confirm("Delete this announcement?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/announce/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.token}`,
      },
      body: JSON.stringify({ courseId: courseID }),
    });
    setRefresh((r) => r + 1);
  };

  // Chapters
  const handleOpenChapterForm = () => setOpenChapterForm(true);

  // Assignments
  const handleAssignmentClick = (a: Assignment) => {
    setCurrentAssignment(a);
    setOpenAssignmentPopup(true);
  };
  const handleCloseAssignment = () => {
    setOpenAssignmentPopup(false);
    setCurrentAssignment(null);
  };
  const handleDeleteAssignment = async (id: number | string) => {
    if (!session || !confirm("Delete this assignment?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/assgn/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.user.token}` },
    });
    setRefresh((r) => r + 1);
  };

  // Submissions & Feedback
  const handleViewSubmissions = async (a: Assignment) => {
    if (!session) return;
    setSelectedAssignment(a);
    setSubmissionsLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/submissions/assignment/${a._id}/submissions`,
      { headers: { Authorization: `Bearer ${session.user.token}` } }
    );
    if (res.ok) setSubmissions(await res.json());
    setSubmissionsLoading(false);
    setOpenSubmissionsDialog(true);
  };
  const handleOpenFeedback = (sub: any) => {
    setCurrentSubmission(sub);
    setFeedbackText("");
    setFeedbackGrade("");
    setFeedbackDialogOpen(true);
  };
  const handleSubmitFeedback = async () => {
    if (!session || !currentSubmission || !selectedAssignment) return;
    await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/submissions/submission/${currentSubmission._id}/feedback`,
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
          grade: feedbackGrade ? Number(feedbackGrade) : undefined,
        }),
      }
    );
    setFeedbackDialogOpen(false);
    handleViewSubmissions(selectedAssignment);
  };

  // Attendance
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    // do not reset attendance here—will be fetched below
  };
  const toggleAttendance = (id: string) =>
    setAttendance((p) => ({ ...p, [id]: !p[id] }));
  const handleSubmitAttendance = async () => {
    if (!date) return alert("Please select a date.");
    const raw = Cookies.get("session");
    if (!raw) return router.push("/");
    const { user } = JSON.parse(raw) as Session;

    setAttLoading(true);
    await Promise.all(
      attStudents.map((s) =>
        fetch(`${process.env.NEXT_PUBLIC_URL}/api/adminauth/post/mark`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            userId: s._id,
            courseId: courseID,
            date,
            status: attendance[s._id] ? "present" : "absent",
          }),
        })
      )
    );
    setAttLoading(false);
    alert(`Attendance for ${date} recorded!`);
  };

  // === DATA FETCHING EFFECTS ===

  // Main dashboard data
  useEffect(() => {
    const loadData = async () => {
      const raw = Cookies.get("session");
      if (!raw) return router.push("/");
      const sess: Session = JSON.parse(raw);
      setSession(sess);
      const headers = { Authorization: `Bearer ${sess.user.token}` };

      // Assignments
      try {
        const r = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/assgn/course/${courseID}`, { headers });
        if (r.ok) setAssignments(await r.json());
      } finally {
        setAssignmentsLoading(false);
      }

      // Announcements
      try {
        const r = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/announce/${courseID}`, { headers });
        if (r.ok) setAnnouncements(await r.json());
      } finally {
        setAnnouncementsLoading(false);
      }

      // Chapters
      try {
        const r = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/chapter/get/${courseID}`, { headers });
        if (r.ok) setChapters(await r.json());
      } finally {
        setChaptersLoading(false);
      }
    };

    if (courseID) loadData();
  }, [router, refresh, courseID]);

  // Load students once
  useEffect(() => {
    const loadStudents = async () => {
      if (!session) return;
      const r = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/courses/${courseID}/students`, {
        headers: { Authorization: `Bearer ${session.user.token}` },
      });
      if (!r.ok) return setAttError("Failed to load students");
      const data = await r.json();
      setAttStudents(data.students);
      setAttendance(
        data.students.reduce((acc: Record<string, boolean>, s: Student) => {
          acc[s._id] = false;
          return acc;
        }, {})
      );
    };
    if (session && courseID) loadStudents();
  }, [session, courseID]);

  // **Fetch attendance when date changes** (no longer tied to dialog open)
  useEffect(() => {
    if (!date || !session) return;
    const loadForDate = async () => {
      const updated: Record<string, boolean> = {};
      await Promise.all(
        attStudents.map(async (s) => {
          const r = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/adminauth/summary/${s._id}`, {
            headers: { Authorization: `Bearer ${session.user.token}` },
          });
          if (!r.ok) {
            updated[s._id] = false;
            return;
          }
          const d = await r.json();
          const rec = d.attendance[courseID]?.find((x: any) => x.date.slice(0, 10) === date);
          updated[s._id] = rec?.status === "present";
        })
      );
      setAttendance(updated);
    };
    loadForDate();
  }, [date, session, attStudents, courseID]);

  // Fade-in effects
  useEffect(() => {
    if (!announcementsLoading) setTimeout(() => setFadeInAnnouncements(true), 300);
  }, [announcementsLoading]);
  useEffect(() => {
    if (!chaptersLoading) setTimeout(() => setFadeInChapters(true), 600);
  }, [chaptersLoading]);

  // Prepare limited lists
  const displayedAnnouncements = showAllAnnouncements
    ? announcements
    : announcements.slice(0, 4);
  const displayedChapters = useMemo(
    () => (showAllChapters ? chapters : chapters.slice(0, 4)),
    [showAllChapters, chapters]
  );

  // === RENDER ===
  return (
    <Box sx={{ backgroundColor: "#F4F6F8", minHeight: "100vh", p: 4 }}>
      <GradientBanner width="100%" height="250px" courseTitle={courseID} />

      {/* Attendance Icon */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <IconButton onClick={() => setOpenAttendanceDialog(true)}>
          <EventAvailableIcon sx={{ color: "black" }} />
        </IconButton>
      </Box>

      {/* Announcements & Chapters */}
      <Grid container spacing={4} mb={4}>
        {/* Announcements */}
        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="h5" sx={{ mr: 1 }}>
              Announcements
            </Typography>
            <IconButton onClick={() => setOpenAnnouncementForm(true)}>
              <AddIcon />
            </IconButton>
          </Box>
          {announcementsLoading ? (
            <Grid container spacing={2}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Grid item xs={12} key={i}>
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
                  onAnnouncementClick={handleAnnouncementClick}
                  onAnnouncementDelete={handleDeleteAnnouncement}
                />
              </div>
            </Fade>
          )}
          {!announcementsLoading && announcements.length > 4 && (
            <Button
              size="small"
              onClick={() => setShowAllAnnouncements((p) => !p)}
            >
              {showAllAnnouncements ? "Collapse" : "See More"}
            </Button>
          )}
        </Grid>

        {/* Chapters */}
        <Grid item xs={12} md={6}>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="h5" sx={{ mr: 1 }}>
              Chapters
            </Typography>
            <IconButton onClick={handleOpenChapterForm}>
              <AddIcon />
            </IconButton>
          </Box>
          {chaptersLoading ? (
            <Grid container spacing={2}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Grid item xs={12} key={i}>
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
          {!chaptersLoading && chapters.length > 4 && (
            <Button
              size="small"
              onClick={() => setShowAllChapters((p) => !p)}
            >
              {showAllChapters ? "Collapse" : "See More"}
            </Button>
          )}
        </Grid>
      </Grid>

      {/* Assignments */}
      <Box mb={4}>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h5" sx={{ mr: 1 }}>
            Assignments
          </Typography>
          <IconButton onClick={() => setOpenAssignmentForm(true)}>
            <AddIcon />
          </IconButton>
        </Box>
        {assignmentsLoading ? (
          <Grid container spacing={2}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Grid item xs={12} key={i}>
                <Skeleton
                  variant="rectangular"
                  height={100}
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
            ))}
          </Grid>
        ) : assignments.length > 0 ? (
          assignments.map((a, idx) => (
            <Card
              key={a._id}
              sx={{
                backgroundColor: cardColors[idx % cardColors.length],
                p: 2,
                mb: 2,
              }}
            >
              <Typography variant="h6" color="white">
                {a.title}
              </Typography>
              <Typography variant="body2" color="white">
                {a.description}
              </Typography>
              <Typography variant="caption" color="white">
                Due: {a.dueDate}
              </Typography>
              <Box mt={1} display="flex" gap={1}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleAssignmentClick(a)}
                >
                  View
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDeleteAssignment(a._id)}
                >
                  Delete
                </Button>
                <Button
                  size="small"
                  color="success"
                  onClick={() => handleViewSubmissions(a)}
                >
                  Submissions
                </Button>
              </Box>
            </Card>
          ))
        ) : (
          <Typography>No assignments available</Typography>
        )}
      </Box>

      {/* Dialogs */}
      <AddAnnouncementDialog
        open={openAnnouncementForm}
        onClose={() => setOpenAnnouncementForm(false)}
        courseID={courseID}
        onAnnouncementAdded={() => setRefresh((r) => r + 1)}
      />
      <AddAssignmentDialog
        open={openAssignmentForm}
        onClose={() => setOpenAssignmentForm(false)}
        courseID={courseID}
        onAssignmentAdded={() => setRefresh((r) => r + 1)}
      />
      <AddChapterDialog
        open={openChapterForm}
        onClose={() => setOpenChapterForm(false)}
        courseID={courseID}
        onChapterAdded={() => setRefresh((r) => r + 1)}
      />

      <AnnouncementPopup
        open={openAnnouncementPopup}
        handleClose={handleCloseAnnouncement}
        announcement={currentAnnouncement}
      />
      <AssignmentPopup
        open={openAssignmentPopup}
        handleClose={handleCloseAssignment}
        assignment={currentAssignment}
        studentId={session?.user.id}
      />
      <SubmissionsDialog
        open={openSubmissionsDialog}
        onClose={() => setOpenSubmissionsDialog(false)}
        submissions={submissions}
        submissionsLoading={submissionsLoading}
        selectedAssignmentTitle={selectedAssignment?.title || ""}
        onFeedbackClick={handleOpenFeedback}
      />

      {/* Feedback Dialog */}
      <Dialog
        open={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <Box p={2}>
          <Typography variant="h6">Provide Feedback</Typography>
          <TextField
            fullWidth
            label="Feedback"
            multiline
            rows={4}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Grade (optional)"
            value={feedbackGrade}
            onChange={(e) => setFeedbackGrade(e.target.value)}
            margin="normal"
          />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button onClick={() => setFeedbackDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmitFeedback} sx={{ ml: 1 }}>
              Submit
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
        <Box p={2}>
          <Typography variant="h5" mb={2}>
            Attendance
          </Typography>
          <TextField
            type="date"
            label="Select Date"
            value={date}
            onChange={handleDateChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mb: 2 }}
          />
          {attStudents.map((s) => (
            <Box key={s._id} display="flex" alignItems="center" mb={1}>
              <input
                type="checkbox"
                checked={attendance[s._id] || false}
                onChange={() => toggleAttendance(s._id)}
                style={{ marginRight: 8 }}
              />
              <Typography>{s.name}</Typography>
            </Box>
          ))}
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmitAttendance}
            disabled={attLoading}
          >
            {attLoading ? "Submitting..." : "Submit Attendance"}
          </Button>
          {attError && (
            <Typography color="error" mt={2}>
              {attError}
            </Typography>
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
