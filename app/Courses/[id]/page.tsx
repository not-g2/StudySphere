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
import professorImage from "../../../public/teach1.jpeg"; // Sample path to the professor's picture
import bannerImage from "../../../public/reward1.jpeg"; // Sample path to the banner background
import Popup from "../../../components/announcmentpopup";
import { useState } from "react";

// Sample data for assignments and announcements
const assignments = [
  {
    id: 1,
    title: "Math Homework",
    dueDate: "2024-11-05",
    course: "Mathematics",
    status: "Upcoming",
  },
  {
    id: 2,
    title: "History Project",
    dueDate: "2024-11-01",
    course: "History",
    status: "Due Today",
  },
];

const announcements = [
  {
    id: 1,
    title: "New Semester Guidelines",
    datePosted: "2024-10-20",
    content:
      "Please review the new guidelines for the upcoming semester. These guidelines are designed to enhance the learning experience and ensure that all students are aware of important policies. It is crucial that you familiarize yourself with these changes, as they may impact your coursework and participation in class activities. Should you have any questions or require clarification, feel free to reach out to your instructor or academic advisor.",
  },
  {
    id: 2,
    title: "Holiday Schedule",
    datePosted: "2024-10-18",
    content:
      "The school will be closed for holidays from December 20 to January 5. During this period, all classes, extracurricular activities, and administrative offices will be unavailable. We encourage students to take this time to relax, recharge, and spend time with family and friends. Please ensure that any assignments or projects due during this break are submitted beforehand, and reach out to your instructors if you have any concerns",
  },
  {
    id: 3,
    title: "New Semester Guidelines",
    datePosted: "2024-10-20",
    content:
      "Please review the new guidelines for the upcoming semester. These guidelines are designed to enhance the learning experience and ensure that all students are aware of important policies. It is crucial that you familiarize yourself with these changes, as they may impact your coursework and participation in class activities. Should you have any questions or require clarification, feel free to reach out to your instructor or academic advisor.",
  },
  {
    id: 4,
    title: "Holiday Schedule",
    datePosted: "2024-10-18",
    content:
      "The school will be closed for holidays from December 20 to January 5. During this period, all classes, extracurricular activities, and administrative offices will be unavailable. We encourage students to take this time to relax, recharge, and spend time with family and friends. Please ensure that any assignments or projects due during this break are submitted beforehand, and reach out to your instructors if you have any concerns",
  },
];

interface Announcement {
  id: number;
  title: string;
  datePosted: string;
  content: string;
}

const DashboardPage = () => {
  const [open, setOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] =
    useState<Announcement | null>(null);

  const handleClickOpen = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentAnnouncement(null);
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f5f5f5" }}>
      {/* Top Banner */}
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
        {/* Subject Title */}
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Course: Mathematics
        </Typography>

        {/* Professor's Picture */}
        <Avatar
          alt="Professor Name"
          src={professorImage.src}
          sx={{
            position: "absolute",
            right: 20,
            width: 80,
            height: 80,
            border: "3px solid white",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
          }}
        />
      </Box>

      <Grid container spacing={4} mt={2}>
        {/* Assignments Due Section */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            Assignments Due
          </Typography>
          {assignments.map((assignment) => (
            <Card
              key={assignment.id}
              sx={{
                marginBottom: 2,
                padding: 2,
                borderRadius: 2,
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                backgroundColor: "#ffffff",
              }}
            >
              <CardContent>
                <Badge
                  badgeContent={assignment.status}
                  color={
                    assignment.status === "Due Today" ? "error" : "primary"
                  }
                />
                <Typography variant="h6" gutterBottom>
                  {assignment.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Due Date: {assignment.dueDate}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Course: {assignment.course}
                </Typography>
              </CardContent>
              <Button size="small" variant="contained" color="primary">
                View Details
              </Button>
            </Card>
          ))}
        </Grid>

        {/* Announcements Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h5" gutterBottom>
            Announcements
          </Typography>
          <Box sx={{ maxHeight: 400, overflowY: "auto", paddingRight: 1 }}>
            {announcements.map((announcement) => (
              <Card
                key={announcement.id}
                sx={{
                  marginBottom: 1,
                  borderRadius: 2,
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                }}
                onClick={() => handleClickOpen(announcement)}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {announcement.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Posted on: {announcement.datePosted}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>
      <Popup
        open={open}
        handleClose={handleClose}
        announcement={currentAnnouncement}
      />
    </Box>
  );
};

export default DashboardPage;
