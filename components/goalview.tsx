// components/TodoList.tsx
"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { lighten } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";

interface Goal {
  _id: string;
  name: string;
  endDate: string;
}

const headerBgColor = "#3f51b5";
const headerTextColor = "#fff";

export default function TodoList() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [session, setSession] = useState<any>(null);
  const [completedGoals, setCompletedGoals] = useState<string[]>([]);
  const [fadedGoals, setFadedGoals] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [addingError, setAddingError] = useState<string | null>(null);
  const router = useRouter();

  // Constants for visible items
  const VISIBLE_ITEMS = 4;
  const ITEM_HEIGHT = 64;   // px
  const ITEM_MARGIN = 8;    // px
  const CONTAINER_HEIGHT =
    VISIBLE_ITEMS * ITEM_HEIGHT + (VISIBLE_ITEMS - 1) * ITEM_MARGIN;

  // Retrieve session or redirect to sign-in
  useEffect(() => {
    const s = Cookies.get("session");
    if (s) setSession(JSON.parse(s));
    else router.push("/auth/signin");
  }, [router]);

  // Fetch goals from API
  useEffect(() => {
    const fetchGoals = async () => {
      if (!session?.user?.token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/goals/`, {
          headers: { Authorization: `Bearer ${session.user.token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        const formatted = data
          .map((g: any) => ({
            _id: g._id,
            name: g.title,
            endDate: g.dueDate,
          }))
          .sort(
            (a, b) =>
              new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
          );
        setGoals(formatted);
      } catch {
        setError("Could not load your goals.");
      }
    };
    fetchGoals();
  }, [session]);

  // Delete goal on server + local state
  const deleteGoal = async (id: string) => {
    if (!session?.user?.token) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/goals/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${session.user.token}` },
        }
      );
      if (!res.ok) throw new Error();
    } catch {
      setError("Failed to delete. Try again.");
    }
  };

  // Handle checkbox: strike, fade, then delete
  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (!checked) return;
    setCompletedGoals((p) => [...p, id]);
    setTimeout(() => setFadedGoals((p) => [...p, id]), 100);
    setTimeout(() => {
      deleteGoal(id);
      setGoals((g) => g.filter((x) => x._id !== id));
    }, 1000);
  };

  // Dialog open/close
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewName("");
    setNewEndDate("");
    setAddingError(null);
  };

  // Add new goal
  const handleAdd = async () => {
    if (!newName || !newEndDate) {
      setAddingError("Both fields are required.");
      return;
    }
    try {
      const body = {
        title: newName,
        description: newName,
        dueDate: newEndDate,
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/goals/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      setGoals((g) =>
        [...g, { _id: saved._id, name: saved.title, endDate: saved.dueDate }]
          .sort(
            (a, b) =>
              new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
          )
      );
      handleClose();
    } catch {
      setAddingError("Could not save. Try again.");
    }
  };

  return (
    <Paper
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 2,
        bgcolor: headerBgColor,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ color: headerTextColor }}>
          My To-Do List
        </Typography>
        <IconButton onClick={handleOpen} sx={{ color: headerTextColor }}>
          <AddIcon />
        </IconButton>
      </Box>

      {error && (
        <Typography color="error" align="center" mb={2}>
          {error}
        </Typography>
      )}

      {/* Scrollable container (4 items tall) with hidden scrollbar */}
      <Box
         sx={{
            height: CONTAINER_HEIGHT,
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
            msOverflowStyle: "none",  // <-- camelCase
          }}
      >
        <List disablePadding>
          {goals.map((goal, idx) => {
            const shadeFactor =
              0.15 + (idx / (goals.length - 1 || 1)) * 0.3;
            return (
              <Collapse
                key={goal._id}
                in={!fadedGoals.includes(goal._id)}
                timeout={1000}
                unmountOnExit
              >
                <ListItem
                  sx={{
                    bgcolor: lighten(headerBgColor, shadeFactor),
                    borderRadius: 1,
                    mb: 1,
                    height: ITEM_HEIGHT,
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      onChange={(e) =>
                        handleCheckboxChange(goal._id, e.target.checked)
                      }
                      sx={{
                        color: headerTextColor,
                        "&.Mui-checked": { color: headerTextColor },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={goal.name}
                    secondary={new Date(goal.endDate).toLocaleDateString()}
                    primaryTypographyProps={{
                      sx: {
                        color: headerTextColor,
                        textDecoration: completedGoals.includes(goal._id)
                          ? "line-through"
                          : "none",
                      },
                    }}
                    secondaryTypographyProps={{
                      sx: { color: headerTextColor },
                    }}
                  />
                </ListItem>
              </Collapse>
            );
          })}
        </List>
      </Box>

      {/* Add-Task Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          {addingError && <Typography color="error">{addingError}</Typography>}
          <Box
            component="form"
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              label="Task Name"
              fullWidth
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <TextField
              label="Due Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAdd}
            sx={{
              bgcolor: headerBgColor,
              color: headerTextColor,
              "&:hover": { bgcolor: headerBgColor },
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
