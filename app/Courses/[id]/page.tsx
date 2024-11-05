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
import professorImage from "../../../public/teach1.jpeg";
import bannerImage from "../../../public/reward1.jpeg";
import AnnouncementPopup from "../../../components/announcmentpopup";
import AssignmentPopup from "../../../components/assignmentpopup";
import { useState } from "react";

// Sample data for assignments and announcements
const assignments = [
  {
    id: 1,
    title: "Math Homework",
    dueDate: "2024-11-05",
    course: "Mathematics",
    status: "Upcoming",
    desc: "Explore and Investigate the following and submit a report by clearly mentioned your name and registration number in MSWord Internet Banking Security Mechanisms, Password Management and Related Security Algorithms UPI Security Mechanisms. Justify and give your perspective which UPI is safe or not.",
    link: "example.com",
  },
  {
    id: 2,
    title: "History Project",
    dueDate: "2024-11-01",
    course: "History",
    status: "Due Today",
    desc: "smgthh smth",
    link: "example.com",
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
];

interface Announcement {
  id: number;
  title: string;
  datePosted: string;
  content: string;
}

interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  course: string;
  desc: string;
  link: string;
}

const DashboardPage = () => {
  const [open, setOpen] = useState(false);
  const [openAssm, setOpenAssm] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] =
    useState<Announcement | null>(null);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(
    null
  );

  const handleClickOpen = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement);
    setOpen(true);
  };

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

  return (
    <Box className="bg-c2" sx={{ padding: 4 }}>
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

      <Grid container spacing={4} mt={2}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom className="text-white">
            Assignments Due
          </Typography>
          {assignments.map((assignment) => (
            <Card
              key={assignment.id}
              className="bg-c5 text-white"
              sx={{
                marginBottom: 2,
                padding: 2,
                borderRadius: 2,
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <CardContent>
                <Badge
                  badgeContent={assignment.status}
                  color={assignment.status === "Due Today" ? "error" : "primary"}
                />
                <Typography variant="h6" gutterBottom>
                  {assignment.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#d3d3d3" }}>
                  Due Date: {assignment.dueDate}
                </Typography>
                <Typography variant="body2" sx={{ color: "#d3d3d3" }}>
                  Course: {assignment.course}
                </Typography>
              </CardContent>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => handleClickOpenAssm(assignment)}
              >
                View Details
              </Button>
            </Card>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h5" gutterBottom className="text-white">
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
                key={announcement.id}
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
                  <Typography variant="body2" sx={{ color: "#d3d3d3" }}>
                    Posted on: {announcement.datePosted}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Box sx={{ marginTop: 10 }}>
            <Typography variant="h5" gutterBottom className="text-white">
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
              {announcements.map((announcement) => (
                <Card
                  key={announcement.id}
                  className="bg-c5 text-white"
                  sx={{
                    marginBottom: 1,
                    borderRadius: 2,
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    window.open("https://example.com", "_blank");
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {announcement.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#d3d3d3" }}>
                      Posted on: {announcement.datePosted}
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
      />
    </Box>
  );
};

export default DashboardPage;
