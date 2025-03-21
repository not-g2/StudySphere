"use client";
import {
  Typography,
  Grid,
  Box,
  Button,
  Slide,
} from "@mui/material";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";

import Banner from "@/components/UserCourses/Banner";
import AnnouncementsList from "@/components/UserCourses/AnnouncementsList";
import ChaptersList from "@/components/UserCourses/ChaptersList";
import AnnouncementPopup from "@/components/announcmentpopup";

interface Announcement {
  _id: number;
  title: string;
  createdAt: string;
  description: string;
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

const DashboardNoAssignments = () => {
  const [open, setOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "people">("dashboard");

  const router = useRouter();
  const params = useParams();
  const courseID = params.id; // Assuming courseID is also used as groupcode

  // Navigation handler for tabs (and any future navigation)
  const handleNav = (path: string) => {
    router.push(path);
  };

  // Handle announcement click to open the popup
  const handleAnnouncementClick = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement);
    setOpen(true);
  };

  const handleCloseAnnouncement = () => {
    setOpen(false);
    setCurrentAnnouncement(null);
  };

  // New function to leave the group
  const handleLeaveGroup = async () => {
    if (session) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/groups/leavegrp/${courseID}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.token}`,
            },
          }
        );
        console.log(session.user.token)
        if (response.ok) {
          // On success, route the user to the groups overview page.
          router.push("/group");
        } else {
          const errorData = await response.json();
          console.error("Error leaving group:", errorData);
        }
      } catch (error) {
        console.error("Network error leaving group:", error);
      }
    }
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

        // Fetch announcements using the new POST endpoint.
        try {
          const response = await fetch(
            `http://localhost:8000/api/groups/fetchanncmnt/${courseID}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              method: "POST",
            }
          );
          if (response.ok) {
            const data = await response.json();
            // data.allAnnouncements is an array of strings.
            // Transform each announcement string into an object.
            const transformedAnnouncements = data.allAnnouncements.map((content: string, index: number) => ({
              _id: index,
              title: content.substring(0, 20) + (content.length > 20 ? "..." : ""),
              description: content,
              createdAt: new Date().toISOString(),
            }));
            setAnnouncements(transformedAnnouncements);
          } else {
            console.error("Failed to fetch announcements");
          }
        } catch (error) {
          console.error("Error fetching announcements:", error);
        }

        // Fetch chapters as before.
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
            console.error("Failed to get Chapter details");
          }
        } catch (error) {
          console.error("Error getting Chapter details:", error);
        }
      }
    };

    fetchDashboardData();
  }, [session, courseID, router]);

  // Dashboard content view: Banner, AnnouncementsList, ChaptersList, and Leave Group button.
  const DashboardContent = () => (
    <Box
      className="bg-c2"
      sx={{
        minHeight: "calc(100vh - 60px)",
        display: "flex",
        flexDirection: "column",
        padding: 2,
      }}
    >
      <Banner
        courseTitle="Mathematics"
        bannerImage="/mbanner.png"
        professorImage="/teach1.jpg"
      />

      {/* Leave Group button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="outlined" color="error" onClick={handleLeaveGroup}>
          Leave Group
        </Button>
      </Box>

      <Grid container spacing={4} mt={2} sx={{ flex: 1 }}>
        <Grid item xs={12} md={6}>
          <AnnouncementsList
            announcements={announcements}
            onAnnouncementClick={handleAnnouncementClick}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ChaptersList chapters={chapters} />
        </Grid>
      </Grid>

      <AnnouncementPopup
        open={open}
        handleClose={handleCloseAnnouncement}
        announcement={currentAnnouncement}
      />
    </Box>
  );

  // People content placeholder view.
  const PeopleContent = () => (
    <Box
      className="bg-c2"
      sx={{
        minHeight: "calc(100vh - 60px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        People
      </Typography>
      <Typography variant="body1">
        People content goes here.
      </Typography>
    </Box>
  );

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
      {/* Top Navigation: Tabs and Leave Group button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Typography
            variant="h6"
            onClick={() => setActiveTab("dashboard")}
            sx={{
              p: 2,
              cursor: "pointer",
              borderBottom: activeTab === "dashboard" ? "2px solid white" : "none",
            }}
          >
            Dashboard
          </Typography>
          <Typography
            variant="h6"
            onClick={() => setActiveTab("people")}
            sx={{
              p: 2,
              cursor: "pointer",
              borderBottom: activeTab === "people" ? "2px solid white" : "none",
            }}
          >
            People
          </Typography>
        </Box>
        {/* Optional: If you want a separate Leave Group button here instead of inside DashboardContent */}
        {/* <Button variant="outlined" color="error" onClick={handleLeaveGroup}>
          Leave Group
        </Button> */}
      </Box>

      {/* Sliding content container */}
      <Box sx={{ position: "relative", width: "100%", flex: 1 }}>
        <Slide direction="right" in={activeTab === "dashboard"} mountOnEnter unmountOnExit>
          <Box sx={{ position: "absolute", width: "100%" }}>
            <DashboardContent />
          </Box>
        </Slide>
        <Slide direction="left" in={activeTab === "people"} mountOnEnter unmountOnExit>
          <Box sx={{ position: "absolute", width: "100%" }}>
            <PeopleContent />
          </Box>
        </Slide>
      </Box>
    </Box>
  );
};

export default DashboardNoAssignments;
