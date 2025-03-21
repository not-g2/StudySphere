"use client";
import { Typography, Grid, Box, Button } from "@mui/material";
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
  const router = useRouter();
  const params = useParams();
  const courseID = params.id;

  // Top navigation with placeholder routes
  const handleNav = (path: string) => {
    router.push(path);
  };

  const handleAnnouncementClick = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement);
    setOpen(true);
  };

  const handleCloseAnnouncement = () => {
    setOpen(false);
    setCurrentAnnouncement(null);
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
            setAnnouncements(data);
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
            setChapters(data);
          } else {
            console.error("Failed to get Chapter details");
          }
        } catch (error) {
          console.error("Error getting Chapter Details:", error);
        }
      }
    };

    fetchDashboardData();
  }, [session]);

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
};

export default DashboardNoAssignments;
