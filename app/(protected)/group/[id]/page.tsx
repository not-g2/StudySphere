"use client";
import {
  Typography,
  Grid,
  Box,
  Button,
  Slide,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";

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

interface Member {
  memberid: string;
  name: string;
  rank: string;
}

type Session = {
  user: {
    id: string;
    token: string;
  };
  email: string;
  isAdmin: boolean;
};

// Popup component for adding announcement with a date
interface AddAnnouncementPopupProps {
  open: boolean;
  handleClose: () => void;
  onSubmit: (data: { announcementBody: string; announcementDate: string }) => void;
}

const AddAnnouncementPopup: React.FC<AddAnnouncementPopupProps> = ({
  open,
  handleClose,
  onSubmit,
}) => {
  const [announcementBody, setAnnouncementBody] = useState("");
  // Default to today's date in yyyy-mm-dd format.
  const getTodayDate = () => new Date().toISOString().split("T")[0];
  const [announcementDate, setAnnouncementDate] = useState(getTodayDate());

  const handleSubmit = () => {
    onSubmit({ announcementBody, announcementDate });
    setAnnouncementBody("");
    setAnnouncementDate(getTodayDate());
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Announcement</DialogTitle>
      <DialogContent>
        <TextField
          label="Announcement"
          fullWidth
          multiline
          rows={4}
          value={announcementBody}
          onChange={(e) => setAnnouncementBody(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Announcement Date"
          type="date"
          fullWidth
          value={announcementDate}
          onChange={(e) => setAnnouncementDate(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DashboardNoAssignments = () => {
  const [open, setOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const [session, setSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "people">("dashboard");
  const [openAddAnnouncementPopup, setOpenAddAnnouncementPopup] = useState(false);

  const router = useRouter();
  const params = useParams();
  const courseID = params.id; // Assuming courseID is also used as groupid
  
  // Navigation handler for tabs
  const handleNav = (path: string) => {
    router.push(path);
  };

  // Open announcement popup for viewing details
  const handleAnnouncementClick = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement);
    setOpen(true);
  };

  const handleCloseAnnouncement = () => {
    setOpen(false);
    setCurrentAnnouncement(null);
  };

  // Open the add announcement popup
  const handleAddAnnouncement = () => {
    setOpenAddAnnouncementPopup(true);
  };

  // Submit announcement from popup (only for Admin/Creator)
  const handleSubmitAnnouncement = async (data: { announcementBody: string; announcementDate: string }) => {
    if (!session) return;
    try {
      const response = await fetch(
        `http://localhost:8000/api/groups/createanncmnt/${courseID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
          // Including announcementDate along with announcementBody.
          body: JSON.stringify({ announcementBody: data.announcementBody, announcementDate: data.announcementDate }),
        }
      );
      if (response.ok) {
        fetchAnnouncements();
      } else {
        console.error("Failed to add announcement");
      }
    } catch (error) {
      console.error("Error adding announcement:", error);
    }
  };

  // Delete an announcement (only for Admin/Creator)
  const handleDeleteAnnouncement = async (announcementId: number) => {
    if (!session) return;
    try {
      const response = await fetch(
        `http://localhost:8000/api/groups/deleteanncmnt/${courseID}/${announcementId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );
      if (response.ok) {
        setAnnouncements((prev) =>
          prev.filter((announcement) => announcement._id !== announcementId)
        );
      } else {
        console.error("Failed to delete announcement");
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  // Change a member's role (only allowed for Creator)
  const handleChangeMembership = async (memberId: string, newRole: string) => {
    if (!session) return;
    try {
      const response = await fetch(
        `http://localhost:8000/api/groups/changemembership/${courseID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
          body: JSON.stringify({ targetuserId: memberId, newRole }),
        }
      );
      console.log(JSON.stringify({ targetuserId: memberId, newRole }));
      if (response.ok) {
        fetchMembers();
      } else {
        const errorData = await response.json();
        console.error("Failed to change membership:", errorData);
      }
    } catch (error) {
      console.error("Error changing membership:", error);
    }
  };

  // Remove a member (Admin/Creator can remove those below them)
  const handleDeleteMember = async (memberId: string) => {
    if (!session) return;
    try {
      const response = await fetch(
        `http://localhost:8000/api/groups/rmvuser/${courseID}/${memberId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );
      if (response.ok) {
        fetchMembers();
      } else {
        const errorData = await response.json();
        console.error("Failed to remove member:", errorData);
      }
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  // Fetch announcements from the API
  const fetchAnnouncements = async () => {
    if (!session) return;
    const token = session.user.token;
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
        // Transform announcements if needed
        const transformedAnnouncements = data.allAnnouncements.map(
          (item: any, index: number) => {
            if (typeof item === "string") {
              return {
                _id: index,
                title: item.substring(0, 20) + (item.length > 20 ? "..." : ""),
                description: item,
                createdAt: new Date().toISOString(),
              };
            }
            return item;
          }
        );
        setAnnouncements(transformedAnnouncements);
      } else {
        console.error("Failed to fetch announcements");
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  // Fetch chapter details
  const fetchChapters = async () => {
    if (!session) return;
    const token = session.user.token;
    try {
      const response = await fetch(`http://localhost:8000/api/chapter/get/${courseID}`, {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setChapters(data);
      } else {
        console.error("Failed to get Chapter details");
      }
    } catch (error) {
      console.error("Error getting Chapter details:", error);
    }
  };

  // Fetch group members and update the list
  const fetchMembers = async () => {
    if (!session) return;
    const token = session.user.token;
    try {
      const response = await fetch(
        `http://localhost:8000/api/groups/getallusers/${courseID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          method: "GET",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMembers(data.memberInfo);
      } else {
        console.error("Failed to fetch members");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  // Fetch current user's status from the group
  const fetchUserStatus = async () => {
    if (!session) return;
    console.log(session.user.token);
    try {
      const response = await fetch(
        `http://localhost:8000/api/groups/getstatus/${courseID}/${session.user.id}`,
        {
          headers: { Authorization: `Bearer ${session.user.token}` },
          method: "GET",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCurrentUserRole(data.rankOfUser);
      } else {
        console.error("Failed to fetch user status");
      }
    } catch (error) {
      console.error("Error fetching user status:", error);
    }
  };

  // Leave group function
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
        if (response.ok) {
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
        await Promise.all([
          fetchAnnouncements(),
          fetchChapters(),
          fetchMembers(),
          fetchUserStatus(),
        ]);
      }
    };

    fetchDashboardData();
  }, [session, courseID, router]);

  // Dashboard view: Banner, announcements (with add/delete controls), chapters, etc.
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

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button variant="outlined" color="error" onClick={handleLeaveGroup}>
          Leave Group
        </Button>
        {(currentUserRole === "Admin" || currentUserRole === "Creator") && (
          <Button variant="contained" color="primary" onClick={handleAddAnnouncement}>
            Add Announcement
          </Button>
        )}
      </Box>

      <Grid container spacing={4} mt={2} sx={{ flex: 1 }}>
        <Grid item xs={12} md={6}>
          <AnnouncementsList
            announcements={announcements}
            onAnnouncementClick={handleAnnouncementClick}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            currentUserRole={currentUserRole}
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

      {/* Add Announcement Popup */}
      <AddAnnouncementPopup
        open={openAddAnnouncementPopup}
        handleClose={() => setOpenAddAnnouncementPopup(false)}
        onSubmit={handleSubmitAnnouncement}
      />
    </Box>
  );

  // People view: display all group members with controls for role change and deletion
  const PeopleContent = () => (
    <Box
      className="bg-c2"
      sx={{
        minHeight: "calc(100vh - 60px)",
        display: "flex",
        flexDirection: "column",
        padding: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        People
      </Typography>
      {members.map((member: Member) => (
        <Box
          key={member.memberid}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#012E5E",
            padding: 1,
            borderRadius: 2,
            marginBottom: 1,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ color: "#fff" }}>
              {member.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "#d3d3d3" }}>
              Role: {member.rank}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* If current user is Creator, allow role changes */}
            {currentUserRole === "Creator" && member.rank !== "Creator" && (
              <Select
                value={member.rank}
                onChange={(e) =>
                  handleChangeMembership(member.memberid, e.target.value as string)
                }
                size="small"
                sx={{ mr: 1 }}
              >
                <MenuItem value="Member">Member</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </Select>
            )}
            {/* Allow deletion: Creator can remove anyone except self; Admin can remove only Members */}
            {((currentUserRole === "Creator" && member.rank !== "Creator") ||
              (currentUserRole === "Admin" && member.rank === "Member")) && (
              <IconButton
                onClick={() => handleDeleteMember(member.memberid)}
                size="small"
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box
      className="bg-c2"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        p: 4,
      }}
    >
      {/* Top Navigation Tabs */}
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
