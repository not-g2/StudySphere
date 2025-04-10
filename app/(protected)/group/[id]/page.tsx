"use client";
import {
  Typography,
  Grid,
  Box,
  Button,
  Slide,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter, useParams } from "next/navigation";

import Banner from "@/components/UserCourses/Banner";
import AnnouncementsList from "@/components/UserCourses/AnnouncementsList";
import AnnouncementPopup from "@/components/announcmentpopup";
import { Session } from "@/types/session";
import { Announcement } from "@/types/announcements";
interface Member {
  memberid: string;
  name: string;
  rank: string;
}

// Popup component to select a successor when the creator leaves
interface SelectSuccessorPopupProps {
  open: boolean;
  candidates: Member[];
  onClose: () => void;
  onSubmit: (successorId: string) => void;
}
const SelectSuccessorPopup: React.FC<SelectSuccessorPopupProps> = ({
  open,
  candidates,
  onClose,
  onSubmit,
}) => {
  const [selectedId, setSelectedId] = useState("");

  const handleConfirm = () => {
    if (selectedId) {
      onSubmit(selectedId);
      setSelectedId("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Successor</DialogTitle>
      <DialogContent>
        <Typography>
          As you are the creator, you must choose a successor before leaving.
        </Typography>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="successor-select-label">Successor</InputLabel>
          <Select
            labelId="successor-select-label"
            value={selectedId}
            label="Successor"
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {candidates.map((member) => (
              <MenuItem key={member.memberid} value={member.memberid}>
                {member.name} ({member.rank})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" disabled={!selectedId}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Modal for adding a new file (Admin/Creator only)
interface AddFileModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; file: File }) => void;
}
const AddFileModal: React.FC<AddFileModalProps> = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (title && description && selectedFile) {
      onSubmit({ title, description, file: selectedFile });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New File</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          margin="dense"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          margin="dense"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Select PDF
          <input
            type="file"
            hidden
            accept="application/pdf"
            onChange={(e) => {
              if (e.target.files) setSelectedFile(e.target.files[0]);
            }}
          />
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!title || !description || !selectedFile}>
          Add File
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Modal for editing a file (Admin/Creator only)
interface EditFileModalProps {
  open: boolean;
  file: any;
  onClose: () => void;
  onSubmit: (updatedData: { fileId: string; title: string; description: string; newFile?: File | null }) => void;
}
const EditFileModal: React.FC<EditFileModalProps> = ({ open, file, onClose, onSubmit }) => {
  const [title, setTitle] = useState(file?.title || "");
  const [description, setDescription] = useState(file?.description || "");
  const [newFile, setNewFile] = useState<File | null>(null);

  useEffect(() => {
    if (file) {
      setTitle(file.title);
      setDescription(file.description || "");
    }
  }, [file]);

  const handleSubmit = () => {
    onSubmit({ fileId: file._id, title, description, newFile });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit File</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          margin="dense"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          margin="dense"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Select New PDF (optional)
          <input
            type="file"
            hidden
            accept="application/pdf"
            onChange={(e) => {
              if (e.target.files) setNewFile(e.target.files[0]);
            }}
          />
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DashboardNoAssignments = () => {
  const [open, setOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const [session, setSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "people">("dashboard");
  const [openSuccessorPopup, setOpenSuccessorPopup] = useState(false);

  // File management states
  const [files, setFiles] = useState<any[]>([]);
  const [openAddFileModal, setOpenAddFileModal] = useState(false);
  const [editingFile, setEditingFile] = useState<any>(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const router = useRouter();
  const params = useParams();
  const courseID = params.id; // Using courseID as groupid

  // Navigation handler for tabs
  const handleNav = (path: string) => {
    router.push(path);
  };

  // Announcement handlers
  const handleAnnouncementClick = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement);
    setOpen(true);
  };

  const handleCloseAnnouncement = () => {
    setOpen(false);
    setCurrentAnnouncement(null);
  };

  const handleAddAnnouncement = async () => {
    if (!session) return;
    const announcementBody = prompt("Enter announcement text:");
    if (!announcementBody) return;
    try {
      const response = await fetch(`http://localhost:8000/api/groups/createanncmnt/${courseID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({ announcementBody }),
      });
      if (response.ok) {
        fetchAnnouncements();
      } else {
        console.error("Failed to add announcement");
      }
    } catch (error) {
      console.error("Error adding announcement:", error);
    }
  };

  const handleDeleteAnnouncement = async (announcementId: number) => {
    if (!session) return;
    try {
      const response = await fetch(`http://localhost:8000/api/groups/deleteanncmnt/${courseID}/${announcementId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      });
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

  // Membership handlers
  const handleChangeMembership = async (memberId: string, newRole: string) => {
    if (!session) return;
    try {
      const response = await fetch(`http://localhost:8000/api/groups/changemembership/${courseID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({ targetuserId: memberId, newRole }),
      });
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

  const handleDeleteMember = async (memberId: string) => {
    if (!session) return;
    try {
      const response = await fetch(`http://localhost:8000/api/groups/rmvuser/${courseID}/${memberId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.token}`,
        },
      });
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

  // Fetch functions
  const fetchAnnouncements = async () => {
    if (!session) return;
    try {
      const response = await fetch(`http://localhost:8000/api/groups/fetchanncmnt/${courseID}`, {
        headers: { Authorization: `Bearer ${session.user.token}` },
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        const transformedAnnouncements = data.allAnnouncements.map((item: any, index: number) => {
          if (typeof item === "string") {
            return {
              _id: index,
              title: item.substring(0, 20) + (item.length > 20 ? "..." : ""),
              description: item,
              createdAt: new Date().toISOString(),
            };
          }
          return item;
        });
        setAnnouncements(transformedAnnouncements);
      } else {
        console.error("Failed to fetch announcements");
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const fetchMembers = async () => {
    if (!session) return;
    try {
      const response = await fetch(`http://localhost:8000/api/groups/getallusers/${courseID}`, {
        headers: { Authorization: `Bearer ${session.user.token}` },
        method: "GET",
      });
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

  const fetchFiles = async () => {
    if (!session) return;
    try {
      const response = await fetch(`http://localhost:8000/api/groups/getallfiles/${courseID}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${session.user.token}` },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        if (data.allFiles && data.allFiles.files) {
          setFiles(data.allFiles.files);
        } else {
          setFiles([]);
        }
      } else {
        console.error("Failed to fetch files");
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const fetchUserStatus = async () => {
    if (!session) return;
    try {
      const response = await fetch(`http://localhost:8000/api/groups/getstatus/${courseID}/${session.user.id}`, {
        headers: { Authorization: `Bearer ${session.user.token}` },
        method: "GET",
      });
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

  // File management handlers
  const handleFileAdd = async (data: { title: string; description: string; file: File }) => {
    const formData = new FormData();
    formData.append("pdfFile", data.file);
    formData.append("title", data.title);
    formData.append("description", data.description);
    try {
      const response = await fetch(`http://localhost:8000/api/groups/uploadfile/${courseID}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session?.user.token}` },
        body: formData,
      });
      if (response.ok) {
        await fetchFiles();
        setOpenAddFileModal(false);
      } else {
        console.error("Failed to add file");
      }
    } catch (error) {
      console.error("Error adding file:", error);
    }
  };

  const handleFileDelete = async (fileId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/groups/deletefile/${courseID}/${fileId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.user.token}` },
      });
      if (response.ok) {
        await fetchFiles();
      } else {
        console.error("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleFileUpdate = async (updatedData: {
    fileId: string;
    title: string;
    description: string;
    newFile?: File | null;
  }) => {
    const formData = new FormData();
    formData.append("title", updatedData.title);
    formData.append("description", updatedData.description);
    if (updatedData.newFile) {
      formData.append("pdfFile", updatedData.newFile);
    }
  
    try {
      const response = await fetch(
        `http://localhost:8000/api/groups/updatefile/${courseID}/${updatedData.fileId}`, // use updatedData.fileId here
        {
          method: "POST",
          headers: { Authorization: `Bearer ${session?.user.token}` },
          body: formData,
        }
      );
      if (response.ok) {
        await fetchFiles();
        setEditingFile(null);
        setOpenEditModal(false);
      } else {
        const errorData = await response.json();
        console.error("Failed to update file", errorData);
      }
    } catch (error) {
      console.error("Error updating file:", error);
    }
  };

  // Leave group handler
  const handleLeaveGroup = async () => {
    if (!session) return;
    if (currentUserRole === "Creator") {
      setOpenSuccessorPopup(true);
    } else {
      try {
        const response = await fetch(`http://localhost:8000/api/groups/leavegrp/${courseID}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
        });
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

  const handleSuccessorSelected = async (successorId: string) => {
    if (!session) return;
    try {
      const response = await fetch(`http://localhost:8000/api/groups/leavegrp/${courseID}/${successorId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.token}`,
        },
      });
      if (response.ok) {
        router.push("/group");
      } else {
        const errorData = await response.json();
        console.error("Error leaving group:", errorData);
      }
    } catch (error) {
      console.error("Network error leaving group:", error);
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
          fetchMembers(),
          fetchUserStatus(),
          fetchFiles(),
        ]);
      }
    };
    fetchDashboardData();
  }, [session, courseID, router]);

  // Dashboard content with Announcements on the left and Files on the right.
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
      <Banner courseTitle="Mathematics" bannerImage="/mbanner.png" professorImage="/teach1.jpg" />

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
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h5">Files</Typography>
            {(currentUserRole === "Admin" || currentUserRole === "Creator") && (
              <IconButton onClick={() => setOpenAddFileModal(true)}>
                <AddIcon />
              </IconButton>
            )}
          </Box>
          <Box sx={{ mt: 2 }}>
            {files && files.length > 0 ? (
              files.map((file) => (
                <Box
                  key={file._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid #ccc",
                    padding: 1,
                    mb: 1,
                  }}
                >
                  <a href={file.fileLink} target="_blank" rel="noopener noreferrer">
                    {file.title}
                  </a>
                  {(currentUserRole === "Admin" || currentUserRole === "Creator") && (
                    <Box>
                      <Button onClick={() => { setEditingFile(file); setOpenEditModal(true); }}>
                        Edit
                      </Button>
                      <Button onClick={() => handleFileDelete(file._id)} color="error">
                        <DeleteIcon />
                      </Button>
                    </Box>
                  )}
                </Box>
              ))
            ) : (
              <Typography>No files uploaded.</Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      <AnnouncementPopup open={open} handleClose={handleCloseAnnouncement} announcement={currentAnnouncement} />

      <SelectSuccessorPopup
        open={openSuccessorPopup}
        candidates={members.filter((m) => m.memberid !== session?.user.id)}
        onClose={() => setOpenSuccessorPopup(false)}
        onSubmit={(successorId) => {
          setOpenSuccessorPopup(false);
          handleSuccessorSelected(successorId);
        }}
      />

      {/* Modals for File Management */}
      {openAddFileModal && (
        <AddFileModal
          open={openAddFileModal}
          onClose={() => setOpenAddFileModal(false)}
          onSubmit={handleFileAdd}
        />
      )}
      {editingFile && (
        <EditFileModal
          open={openEditModal}
          file={editingFile}
          onClose={() => {
            setOpenEditModal(false);
            setEditingFile(null);
          }}
          onSubmit={handleFileUpdate}
        />
      )}
    </Box>
  );

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
            {((currentUserRole === "Creator" && member.rank !== "Creator") ||
              (currentUserRole === "Admin" && member.rank === "Member")) && (
              <Button onClick={() => handleDeleteMember(member.memberid)} color="error">
                <DeleteIcon />
              </Button>
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
