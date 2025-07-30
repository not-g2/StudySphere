// app/(protected)/Courses/[id]/page.tsx (DashboardNoAssignments.tsx)
"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
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

interface FileEntry {
  _id: string;
  title: string;
  fileLink: string;
}

interface Chapter {
  _id: number;
  title: string;
  createdAt: string;
  chapterPdf: string;
}

// Popup for choosing a successor or deleting the group
interface SelectSuccessorPopupProps {
  open: boolean;
  candidates: Member[];
  onClose: () => void;
  onSubmit: (id: string) => void;
  onDeleteGroup: () => void;
}
const SelectSuccessorPopup: React.FC<SelectSuccessorPopupProps> = ({
  open,
  candidates,
  onClose,
  onSubmit,
  onDeleteGroup,
}) => {
  const [selected, setSelected] = useState<string>("");

  const confirm = () => {
    if (selected) {
      onSubmit(selected);
      setSelected("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Successor</DialogTitle>
      <DialogContent>
        <Typography>
          As the creator, you must choose a successor before leaving or you may delete the group entirely.
        </Typography>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="succ-label">Successor</InputLabel>
          <Select
            labelId="succ-label"
            value={selected}
            onChange={(e) => setSelected(e.target.value as string)}
          >
            {candidates.map((m) => (
              <MenuItem key={m.memberid} value={m.memberid}>
                {m.name} ({m.rank})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onDeleteGroup} color="error">
          Delete Group
        </Button>
        <Button
          onClick={confirm}
          variant="contained"
          disabled={!selected}
        >
          Confirm Leave
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Modal to add a file
interface AddFileModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; file: File }) => void;
}
const AddFileModal: React.FC<AddFileModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handle = () => {
    if (title && desc && file) {
      onSubmit({ title, description: desc, file });
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
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Select PDF
          <input
            type="file"
            hidden
            accept="application/pdf"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
          />
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handle}
          variant="contained"
          disabled={!title || !desc || !file}
        >
          Add File
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Modal to edit a file
interface EditFileModalProps {
  open: boolean;
  file: FileEntry;
  onClose: () => void;
  onSubmit: (data: {
    fileId: string;
    title: string;
    description: string;
    newFile?: File | null;
  }) => void;
}
const EditFileModal: React.FC<EditFileModalProps> = ({
  open,
  file,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState(file.title);
  const [desc, setDesc] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);

  useEffect(() => {
    setTitle(file.title);
    setDesc("");
    setNewFile(null);
  }, [file]);

  const handle = () => {
    onSubmit({ fileId: file._id, title, description: desc, newFile });
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
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Select New PDF (optional)
          <input
            type="file"
            hidden
            accept="application/pdf"
            onChange={(e) => e.target.files && setNewFile(e.target.files[0])}
          />
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handle} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DashboardNoAssignments: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const courseID = params.id as string;
  const groupName = courseID.replace(/-/g, " ");

  // Gradient for banner
  const gradients = useMemo(
    () => [
      "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      "linear-gradient(120deg, #232526 0%, #414345 100%)",
      "radial-gradient(circle at top left, #0f0c29, #302b63, #24243e)",
      "linear-gradient(200deg, #1f1c2c 0%, #928dab 100%)",
    ],
    []
  );
  const [bannerGradient, setBannerGradient] = useState(gradients[0]);
  useEffect(() => {
    const idx = Math.floor(Math.random() * gradients.length);
    setBannerGradient(gradients[idx]);
  }, [gradients]);

  // state
  const [session, setSession] = useState<Session | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [role, setRole] = useState<string>("");

  const [openAnnPopup, setOpenAnnPopup] = useState(false);
  const [currentAnn, setCurrentAnn] = useState<Announcement | null>(null);

  const [openAddFile, setOpenAddFile] = useState(false);
  const [editingFile, setEditingFile] = useState<FileEntry | null>(null);
  const [openEditFile, setOpenEditFile] = useState(false);

  const [openSucc, setOpenSucc] = useState(false);

  // fetchAnnouncements
  const fetchAnnouncements = useCallback(async () => {
    if (!session) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/groups/fetchanncmnt/${courseID}`,
      { headers: { Authorization: `Bearer ${session.user.token}` } }
    );
    if (!res.ok) {
      console.error("fetchAnnouncements failed:", res.status, await res.text());
      return;
    }
    const { allAnnouncements } = await res.json();
    const normalized: Announcement[] = allAnnouncements.map((item: any) => ({
      _id: item.announcementId,
      title:
        item.content.length > 20
          ? item.content.slice(0, 20) + "…"
          : item.content,
      description: item.content,
      createdAt: item.date,
    }));
    setAnnouncements(normalized);
  }, [session, courseID]);

  // load session + initial data
  useEffect(() => {
    const s = Cookies.get("session");
    if (s) setSession(JSON.parse(s));
    else router.push("/auth/signin");
  }, [router]);

  useEffect(() => {
    if (!session) return;
    const token = session.user.token;
    const uid = session.user.id;

    fetchAnnouncements();

    // members
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/groups/getallusers/${courseID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok && r.json().then((d) => setMembers(d.memberInfo)))
      .catch(console.error);

    // files
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/groups/getallfiles/${courseID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok && r.json().then((d) => setFiles(d.allFiles?.files || [])))
      .catch(console.error);

    // chapters
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/chapter/get/${courseID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok && r.json().then(setChapters))
      .catch(console.error);

    // role
    fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/groups/getstatus/${courseID}/${uid}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((r) => r.ok && r.json().then((d) => setRole(d.rankOfUser)))
      .catch(console.error);
  }, [session, fetchAnnouncements, courseID]);

  // Delete announcement
  const onDelAnn = async (announcementId: string) => {
    if (!session) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/groups/deleteanncmnt/${courseID}/${announcementId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.user.token}` },
      }
    );
    if (!res.ok) {
      console.error("delete failed:", res.status, await res.text());
      return;
    }
    await fetchAnnouncements();
  };

  // Announcement handlers
  const onAnnClick = (a: Announcement) => {
    setCurrentAnn(a);
    setOpenAnnPopup(true);
  };
  const onAnnClose = () => {
    setOpenAnnPopup(false);
    setCurrentAnn(null);
  };
  const onAddAnn = async () => {
    if (!session) return;
    const body = prompt("Enter announcement text:");
    if (!body) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/groups/createanncmnt/${courseID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({ announcementBody: body }),
      }
    );
    if (res.ok) await fetchAnnouncements();
    else console.error("Failed to add announcement", await res.text());
  };

  // Role & member handlers
  const onChangeRole = async (id: string, newRole: string) => {
    if (!session) return;
    await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/groups/changemembership/${courseID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({ targetuserId: id, newRole }),
      }
    );
    setMembers((prev) =>
      prev.map((m) => (m.memberid === id ? { ...m, rank: newRole } : m))
    );
  };
  const onDelMember = async (id: string) => {
    if (!session) return;
    await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/groups/rmvuser/${courseID}/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.user.token}` },
      }
    );
    setMembers((prev) => prev.filter((m) => m.memberid !== id));
  };

  // File handlers
  const onAddFile = async (d: { title: string; description: string; file: File }) => {
    if (!session) return;
    const fd = new FormData();
    fd.append("title", d.title);
    fd.append("description", d.description);
    fd.append("pdfFile", d.file);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/groups/uploadfile/${courseID}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
          body: fd,
        }
      );
      if (!res.ok) {
        console.error("File upload failed:", res.status, await res.text());
        return;
      }
      const data = await res.json();
      setFiles(data.updatedGroup.files);
      setOpenAddFile(false);
    } catch (err) {
      console.error("onAddFile error:", err);
    }
  };
  const onEditFile = async (d: {
    fileId: string;
    title: string;
    description: string;
    newFile?: File | null;
  }) => {
    if (!session) return;
    const fd = new FormData();
    fd.append("title", d.title);
    fd.append("description", d.description);
    if (d.newFile) fd.append("pdfFile", d.newFile);
    await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/groups/updatefile/${courseID}/${d.fileId}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${session.user.token}` },
        body: fd,
      }
    );
    const r2 = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/groups/getallfiles/${courseID}`,
      { headers: { Authorization: `Bearer ${session.user.token}` } }
    );
    if (r2.ok) {
      const d2 = await r2.json();
      setFiles(d2.allFiles?.files || []);
    }
    setEditingFile(null);
    setOpenEditFile(false);
  };
  const onDelFile = async (id: string) => {
    if (!session) return;
    await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/groups/deletefile/${courseID}/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.user.token}` },
      }
    );
    setFiles((prev) => prev.filter((f) => f._id !== id));
  };

  // Leave & successor handlers
  const onLeave = async () => {
    if (!session) return;
    if (role === "Creator") {
      setOpenSucc(true);
      return;
    }
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/groups/leavegrp/${courseID}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.user.token}` },
    });
    router.push("/group");
  };
  const onSucc = async (id: string) => {
    if (!session) return;
    await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/groups/leavegrp/${courseID}/${id}`,
      { method: "DELETE", headers: { Authorization: `Bearer ${session.user.token}` } }
    );
    router.push("/group");
  };
  console.log(session?.user.token);
  // ** New: Delete entire group (creator only) **
  const onDeleteGroup = async () => {
    if (!session) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/groups/delgroup/${courseID}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${session.user.token}` },
        }
      );
      if (!res.ok) {
        console.error("Delete group failed:", res.status, await res.text());
        return;
      }
      router.push("/group");
    } catch (err) {
      console.error("onDeleteGroup error:", err);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f7f7f7", minHeight: "100vh", p: 4 }}>
      {/* Banner */}
      <Banner
        courseTitle={groupName}
        gradient={bannerGradient}
        professorImage="/teach1.jpg"
      />

      {/* Leave / Add Announcement */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="outlined" color="error" onClick={onLeave}>
          Leave Group
        </Button>
        {(role === "Admin" || role === "Creator") && (
          <Button variant="contained" onClick={onAddAnn}>
            Add Announcement
          </Button>
        )}
      </Box>

      {/* Main Grid */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Announcements */}
        <Grid item xs={12} md={6}>
          <AnnouncementsList
            announcements={announcements}
            onAnnouncementClick={onAnnClick}
            onDeleteAnnouncement={onDelAnn}
            currentUserRole={role}
          />
        </Grid>

        {/* Files & People */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            {/* Files */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h6">Files</Typography>
                {(role === "Admin" || role === "Creator") && (
                  <IconButton onClick={() => setOpenAddFile(true)}>
                    <AddIcon />
                  </IconButton>
                )}
              </Box>
              <Box sx={{ mt: 1 }}>
                {files.map((f) => (
                  <Box
                    key={f._id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: "1px solid #ccc",
                      p: 1,
                      mb: 1,
                    }}
                  >
                    <a
                      href={f.fileLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {f.title}
                    </a>
                    {(role === "Admin" || role === "Creator") && (
                      <Box>
                        <Button
                          onClick={() => {
                            setEditingFile(f);
                            setOpenEditFile(true);
                          }}
                        >
                          Edit
                        </Button>
                        <IconButton
                          onClick={() => onDelFile(f._id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* People */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                People
              </Typography>
              {members.length > 0 ? (
                <List>
                  {members.map((m) => (
                    <ListItem key={m.memberid} divider>
                      <ListItemAvatar>
                        <Avatar>{m.name[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={m.name}
                        secondary={`Role: ${m.rank}`}
                      />
                      <ListItemSecondaryAction>
                        {role === "Creator" && m.rank !== "Creator" && (
                          <FormControl
                            size="small"
                            sx={{ mr: 1, minWidth: 100 }}
                          >
                            <Select
                              value={m.rank}
                              onChange={(e) =>
                                onChangeRole(
                                  m.memberid,
                                  e.target.value as string
                                )
                              }
                            >
                              <MenuItem value="Member">Member</MenuItem>
                              <MenuItem value="Admin">Admin</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                        {((role === "Creator" &&
                          m.rank !== "Creator") ||
                          (role === "Admin" && m.rank === "Member")) && (
                          <IconButton
                            edge="end"
                            onClick={() => onDelMember(m.memberid)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No members yet.</Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Popups & Modals */}
      <AnnouncementPopup
        open={openAnnPopup}
        handleClose={onAnnClose}
        announcement={currentAnn}
      />
      <SelectSuccessorPopup
        open={openSucc}
        candidates={members.filter((m) => m.memberid !== session?.user.id)}
        onClose={() => setOpenSucc(false)}
        onSubmit={onSucc}
        onDeleteGroup={onDeleteGroup}
      />
      <AddFileModal
        open={openAddFile}
        onClose={() => setOpenAddFile(false)}
        onSubmit={onAddFile}
      />
      {editingFile && (
        <EditFileModal
          open={openEditFile}
          file={editingFile}
          onClose={() => {
            setOpenEditFile(false);
            setEditingFile(null);
          }}
          onSubmit={onEditFile}
        />
      )}
    </Box>
  );
};

export default DashboardNoAssignments;
