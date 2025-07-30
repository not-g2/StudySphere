"use client";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  Skeleton,
} from "@mui/material";
import { keyframes } from "@mui/system";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import ClassCodePopup from "../../../components/classAdd";
import useSessionCheck from "../../hooks/auth";
import { Session } from "@/types/session";
import dynamic from "next/dynamic";

interface classItem {
  _id: string;
  name: string;
  description: string;
  students: string[];
  chapters: string[];
  createdAt: string;
  __v: number;
  coursePic: {
    publicId: { type: string };
    url: { type: string };
  };
}

interface Announcement {
  title: string;
  description: string;
}

interface Assignment {
  title: string;
  dueDate: string;
}

interface ClassCardProps {
  classItem: classItem;
  token: string;
  handleCardClick: (id: string) => void;
  index: number;
}

// Fade-in animation
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ClassCard: React.FC<ClassCardProps> = ({
  classItem,
  token,
  handleCardClick,
  index,
}) => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);

  const gradients = [
    "linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%)",
    "linear-gradient(135deg, #74ebd5 0%, #acb6e5 100%)",
    "linear-gradient(135deg, #c0c0aa 0%, #1cefff 100%)",
    "linear-gradient(135deg, #7f7fd5 0%, #86a8e7 50%, #91eae4 100%)",
    "linear-gradient(135deg, #1c92d2 0%, #f2fcfe 100%)",
  ];
  const backgroundGradient = gradients[index % gradients.length];

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/announce/${classItem._id}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data: Announcement[] = await res.json();
          setAnnouncement(data.length > 0 ? data[0] : null);
        } else {
          setAnnouncement(null);
        }
      } catch (err) {
        console.error(err);
        setAnnouncement(null);
      }
    };

    const fetchAssignment = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/assgn/course/${classItem._id}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data: Assignment[] = await res.json();
          const today = new Date().toISOString().split("T")[0];
          const dueToday = data.find(
            (a) =>
              a.dueDate.split("T")[0] === today || a.dueDate === today
          );
          setAssignment(dueToday ?? null);
        } else {
          setAssignment(null);
        }
      } catch (err) {
        console.error(err);
        setAssignment(null);
      }
    };

    fetchAnnouncement();
    fetchAssignment();
  }, [classItem._id, token]);

  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      display="flex"
      justifyContent="center"
    >
      <Card
        sx={{
          width: "100%",
          height: "300px",
          cursor: "pointer",
          background: backgroundGradient,
          opacity: 0,
          animation: `${fadeInUp} 0.5s ease forwards`,
          animationDelay: `${index * 0.2}s`,
        }}
        onClick={() => handleCardClick(classItem._id)}
      >
        <Grid container sx={{ height: "100%" }}>
          <Grid
            item
            xs={7}
            sx={{ padding: 2, display: "flex", flexDirection: "column" }}
          >
            <CardContent sx={{ padding: 0 }}>
              <Typography
                variant="h5"
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                {classItem.name}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "1rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  mt: 1,
                  color: "black",
                }}
              >
                {classItem.description}
              </Typography>

              <Box mt={1}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "black" }}
                >
                  Announcement:
                </Typography>
                {announcement ? (
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: "black",
                    }}
                  >
                    {announcement.title}
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: "black" }}>
                    No announcements
                  </Typography>
                )}

                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", mt: 1, color: "black" }}
                >
                  Assignment:
                </Typography>
                {assignment ? (
                  <Typography variant="body2" sx={{ color: "black" }}>
                    {assignment.title}
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: "black" }}>
                    No assignment due today
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Grid>

          <Grid
            item
            xs={5}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <CardMedia
              component="img"
              image={"/teach1.jpg"}
              alt={`${classItem.name} cover`}
              sx={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "50%",
                border: "2px solid #010101",
              }}
            />
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

const ClassesPage = () => {
  const PORT = process.env.NEXT_PUBLIC_PORT;
  const router = useRouter();
  const [classesData, setClassesData] = useState<classItem[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [openClassCodePopup, setOpenClassCodePopup] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useSessionCheck(setSession);

  const fetchClasses = useCallback(async () => {
    if (!session) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/courses/student/${session.user.id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${session.user.token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setClassesData(data.coursesList);
      } else {
        console.error("Failed to get Classes details");
      }
    } catch (err) {
      console.error("Error Getting Classes Details:", err);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses, PORT]);

  const handleCardClick = (classId: string) => {
    router.push(`/Courses/${classId}`);
  };

  const handleCloseClassCodePopup = () => {
    setOpenClassCodePopup(false);
  };

  const onJoinClass = async (classCode: string) => {
    if (!session) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/courses/add-course`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
          body: JSON.stringify({
            studentId: session.user.id,
            courseCode,
          }),
        }
      );
      if (!res.ok) {
        console.error("Error adding student to course:", await res.json());
        return;
      }
      // only now do we close + refresh
      setOpenClassCodePopup(false);
      await fetchClasses();
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  return (
    <div className="bg-gray-200 h-full">
      <Box
        className="bg-gray-200 text-black p-4"
        sx={{ minHeight: "100vh", width: "100vw" }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100%", px: 2 }}
        >
          <Typography
            variant="h4"
            sx={{ color: "black", m: 0, lineHeight: 1.2 }}
          >
            Your Classes
          </Typography>
          <Button
            type="button"
            variant="contained"
            onClick={() => setOpenClassCodePopup(true)}
            sx={{ m: 0 }}
          >
            Join Class
          </Button>
        </Box>

        <Grid container spacing={4} justifyContent="flex-start" sx={{ mt: 2 }}>
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="300px"
                  animation="wave"
                  sx={{ borderRadius: "4px" }}
                />
              </Grid>
            ))
          ) : classesData.length > 0 ? (
            classesData.map((cls, idx) => (
              <ClassCard
                key={cls._id}
                classItem={cls}
                token={session!.user.token}
                handleCardClick={handleCardClick}
                index={idx}
              />
            ))
          ) : (
            <Typography variant="h6" color="textSecondary">
              No classes available.
            </Typography>
          )}
        </Grid>

        <ClassCodePopup
          open={openClassCodePopup}
          handleClose={handleCloseClassCodePopup}
          onJoinClass={onJoinClass}
        />
      </Box>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ClassesPage), { ssr: false });
