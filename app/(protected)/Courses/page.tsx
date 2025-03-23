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
import pic from "../../../public/teach1.jpg";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ClassCodePopup from "../../../components/classAdd";
import useSessionCheck from "../../hooks/auth";

type Session = {
  user: {
    id: string;
    token: string;
  };
  email: string;
  isAdmin: boolean;
};

interface classItem {
  _id: string;
  name: string;
  description: string;
  students: string[];
  chapters: string[];
  createdAt: string;
  __v: number;
  coursePic: {
    publicId: {
      type: string;
    };
    url: {
      type: string;
    };
  };
}

interface Announcement {
  heading: string;
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

// Define a fadeInUp animation similar to MyCourses page
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

  // Gradients to cycle through
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
        const response = await fetch(
          `http://localhost:8000/api/announce/${classItem._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            method: "GET",
          }
        );
        if (response.ok) {
          const data = await response.json();
          // Assuming the API returns an array of announcements
          if (data && data.length > 0) {
            setAnnouncement(data[0]);
          } else {
            setAnnouncement(null);
          }
        } else {
          console.error("Failed to get Announcement details");
          setAnnouncement(null);
        }
      } catch (error) {
        console.error("Error fetching Announcement details:", error);
        setAnnouncement(null);
      }
    };

    const fetchAssignment = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/assgn/course/${classItem._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            method: "GET",
          }
        );
        if (response.ok) {
          const data = await response.json();
          // Assuming the API returns an array of assignments
          // Filter for assignments due today
          const today = new Date().toISOString().split("T")[0];
          const dueToday = data.find((assgn: Assignment) => {
            return (
              assgn.dueDate.split("T")[0] === today || assgn.dueDate === today
            );
          });
          if (dueToday) {
            setAssignment(dueToday);
          } else {
            setAssignment(null);
          }
        } else {
          console.error("Failed to get Assignment details");
          setAssignment(null);
        }
      } catch (error) {
        console.error("Error fetching Assignment details:", error);
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
          // Set initial opacity to 0 so the card isn't visible before animation starts
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
            sx={{
              padding: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ padding: 0 }}>
              <Typography
                variant="h5"
                sx={{ fontSize: "1.2rem", fontWeight: "bold", color: "black" }}
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
                  marginTop: 1,
                  color: "black",
                }}
              >
                {classItem.description}
              </Typography>
              <Box mt={1}>
                <Typography variant="body2" sx={{ fontWeight: "bold", color: "black" }}>
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
                    {announcement.heading}
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: "black" }}>
                    No announcements
                  </Typography>
                )}
                <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1, color: "black" }}>
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
              image={pic.src}
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

  const handleCardClick = (classId: string) => {
    router.push(`/Courses/${classId}`);
  };

  useEffect(() => {
    const getClasses = async () => {
      if (session) {
        setLoading(true);
        try {
          const response = await fetch(
            `http://localhost:${PORT}/api/courses/student/${session.user.id}`,
            {
              headers: {
                Authorization: `Bearer ${session.user.token}`,
              },
              method: "GET",
            }
          );
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            setClassesData(data.coursesList);
          } else {
            console.error("Failed to get Classes details");
          }
        } catch (error) {
          console.error("Error Getting Classes Details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    getClasses();
  }, [session, openClassCodePopup, PORT]);

  const handleCloseClassCodePopup = () => {
    setOpenClassCodePopup(false);
  };

  const onJoinClass = async (classCode: string) => {
    if (session) {
      const requestData = {
        studentId: session.user.id,
        courseCode: classCode,
      };

      try {
        const response = await fetch(
          `http://localhost:${PORT}/api/courses/add-course`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.token}`,
            },
            body: JSON.stringify(requestData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error adding student to course:", errorData);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    }
  };

  return (
    <div className="bg-[#001D3D] h-full">
      <Box
        className="bg-[#F3F3F4] text-black p-4 flex flex-col items-start"
        sx={{
          minHeight: "100vh",
          width: "100vw",
          alignItems: "center",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100vw" }}
        >
          <Typography
            variant="h4"
            gutterBottom
            className="text-black mt-2 mb-4"
          >
            Your Classes
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenClassCodePopup(true)}
            sx={{ ml: 2, mr: 4 }}
          >
            Join Class
          </Button>
        </Box>

        <Grid
          container
          spacing={4}
          justifyContent="flex-start"
          sx={{ flexGrow: 1 }}
        >
          {loading
            ? Array.from(new Array(4)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="300px"
                    animation="wave"
                    sx={{ borderRadius: "4px" }}
                  />
                </Grid>
              ))
            : classesData.length > 0
            ? classesData.map((classItem, index) => (
                <ClassCard
                  key={classItem._id}
                  classItem={classItem}
                  token={session?.user.token!}
                  handleCardClick={handleCardClick}
                  index={index}
                />
              ))
            : (
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

export default ClassesPage;
