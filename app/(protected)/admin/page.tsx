"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Grid,
  Button,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  Badge,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PeopleIcon from "@mui/icons-material/People";

type Course = {
  _id: string;
  name: string;
  description: string;
  instructor: string;
};

// Fetch and display the student count as a badge.
const StudentBadge: React.FC<{ courseId: string; token: string }> = ({
  courseId,
  token,
}) => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/courses/${courseId}/students`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();
        setCount(data.students ? data.students.length : 0);
      } catch (error) {
        console.error("Error fetching student count:", error);
      }
    };
    fetchStudentCount();
  }, [courseId, token]);

  return (
    <Badge badgeContent={count !== null ? count : 0} color="error">
      <PeopleIcon />
    </Badge>
  );
};

// Fetch and display announcements preview.
const AnnouncementsPreview: React.FC<{ courseId: string; token: string }> = ({
  courseId,
  token,
}) => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/announce/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch announcements");
        }
        const data = await res.json();
        setAnnouncements(data);
      } catch (err: any) {
        setError(err.message || "Error fetching announcements");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [courseId, token]);

  if (loading) {
    return (
      <Typography variant="caption" color="textSecondary">
        Loading announcements...
      </Typography>
    );
  }
  if (error) {
    return (
      <Typography variant="caption" color="error">
        {error}
      </Typography>
    );
  }
  if (announcements.length === 0) {
    return (
      <Typography variant="caption" color="textSecondary">
        No announcements available
      </Typography>
    );
  }
  const previewText = announcements
    .slice(0, 2)
    .map((ann) => ann.title)
    .join(", ");
  return (
    <Typography variant="caption" color="textSecondary">
      {previewText}
    </Typography>
  );
};

// Fetch and display the course code.
const CourseCode: React.FC<{ courseId: string; adminId: string; token: string }> = ({
  courseId,
  adminId,
  token,
}) => {
  const [courseCode, setCourseCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseCode = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/courses/fetchcoursecode/${courseId}/${adminId}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch course code");
        }
        const data = await response.json();
        setCourseCode(data.coursecode);
      } catch (error) {
        console.error("Error fetching course code:", error);
      }
    };
    fetchCourseCode();
  }, [courseId, adminId, token]);

  return (
    <Typography variant="caption" color="black">
      Code: {courseCode ? courseCode : "Loading..."}
    </Typography>
  );
};

const MyCourses: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);

  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Define the gradients to alternate per card.
  const gradients = [
    "linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%)",
    "linear-gradient(135deg, #74ebd5 0%, #acb6e5 100%)",
    "linear-gradient(135deg, #c0c0aa 0%, #1cefff 100%)",
    "linear-gradient(135deg, #7f7fd5 0%, #86a8e7 50%, #91eae4 100%)",
    "linear-gradient(135deg, #1c92d2 0%, #f2fcfe 100%)",
  ];

  useEffect(() => {
    const sessionData: string | undefined = Cookies.get("session");
    if (sessionData && !session) {
      setSession(JSON.parse(sessionData));
    } else if (!sessionData) {
      router.push("/auth/signin");
    }
    if (session) {
      const token = session.user.token;
      const fetchCourses = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/api/courses/${session.user.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              method: "GET",
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch courses.");
          }
          const data = await response.json();
          setCourses(data.coursesList || []);
        } catch (err) {
          setError("Failed to load courses. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      fetchCourses();
    }
  }, [session, router]);

  const handleCourseClick = (id: string) => {
    router.push(`/admin/courses/${id}`);
  };

  const handleAddCourse = async () => {
    if (!session) {
      alert("You are not authorized.");
      return;
    }
    setFormLoading(true);
    setFormError(null);
    try {
      const adminId = session.user.id;
      const response = await fetch(
        `http://localhost:8000/api/courses/create/${adminId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
          body: JSON.stringify({
            name: newCourseName,
            description: newCourseDescription,
            students: [],
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add course.");
      }
      const newCourse = await response.json();
      setCourses((prevCourses) => [...prevCourses, newCourse.course]);
      setNewCourseName("");
      setNewCourseDescription("");
      setShowDialog(false);
    } catch (err) {
      setFormError("Failed to add course. Please try again.");
      console.error("Error adding course:", err);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5" }} className="p-4 min-h-screen">
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Typography
          variant="h4"
          component="h2"
          color="black"
          sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: "bold" }}
        >
          My Courses
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setShowDialog(!showDialog)}>
          <AddIcon />
        </Button>
      </Box>

      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        PaperProps={{
          style: {
            background: "linear-gradient(135deg, #ffe259, #ffa751)",
            padding: "16px",
          },
        }}
      >
        <DialogTitle style={{ color: "black" }}>New Course Details</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Course Name"
            variant="outlined"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            InputLabelProps={{ style: { color: "black" } }}
            InputProps={{ style: { color: "black" } }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Course Description"
            variant="outlined"
            multiline
            rows={4}
            value={newCourseDescription}
            onChange={(e) => setNewCourseDescription(e.target.value)}
            InputLabelProps={{ style: { color: "black" } }}
            InputProps={{ style: { color: "black" } }}
          />
          {formError && (
            <Typography variant="body2" color="error">
              {formError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAddCourse}
            disabled={formLoading}
            variant="contained"
            sx={{
              backgroundColor: "#388e3c",
              ":hover": { backgroundColor: "#2e7d32" },
            }}
          >
            {formLoading ? "Adding..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {loading ? (
        <Grid container spacing={2}>
          {Array.from(new Array(4)).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton
                variant="rectangular"
                animation="wave"
                height={200}
                sx={{ borderRadius: 2, boxShadow: "0 4px 10px rgba(0,0,0,0.5)" }}
              />
            </Grid>
          ))}
        </Grid>
      ) : error ? (
        <Typography align="center" color="error">
          {error}
        </Typography>
      ) : courses.length > 0 ? (
        <Grid container spacing={2}>
          {courses.map((course, index) => {
            const gradient = gradients[index % gradients.length];
            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={course._id || index}
                style={{
                  opacity: 0,
                  animation: `fadeInUp 0.5s ease forwards`,
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <Card sx={{ position: "relative", background: gradient, height: "200px" }}>
                  {session && (
                    <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                      <StudentBadge courseId={course._id} token={session.user.token} />
                    </Box>
                  )}
                  <CardActionArea
                    onClick={() => handleCourseClick(course._id)}
                    sx={{
                      height: "100%",
                      "&:hover": {
                        filter: "brightness(0.85)",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h5" component="div" color="black">
                        {course.name}
                      </Typography>
                      <Typography variant="body2" color="black">
                        {course.description}
                      </Typography>
                    </CardContent>
                    <CardContent>
                      <AnnouncementsPreview courseId={course._id} token={session.user.token} />
                      {course.instructor && (
                        <Typography variant="subtitle2" color="black">
                          Instructor: {course.instructor}
                        </Typography>
                      )}
                      {/* Display the course code using the CourseCode component */}
                      <CourseCode
                        courseId={course._id}
                        adminId={session.user.id}
                        token={session.user.token}
                      />
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Typography align="center" color="textSecondary">
          You haven't created any courses yet.
        </Typography>
      )}
    </div>
  );
};

export default MyCourses;
