"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface Goal {
    _id: string;
    name: string;
    endDate: string;
}

const headerBgColor = "#3f51b5";
const headerTextColor = "#fff";

const GoalTable: React.FC = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [session, setSession] = useState<any>(null);
    const [completedGoals, setCompletedGoals] = useState<string[]>([]);
    const [fadedGoals, setFadedGoals] = useState<string[]>([]);
    const router = useRouter();

    // For new goal dialog
    const [open, setOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [newEndDate, setNewEndDate] = useState("");
    const [addingError, setAddingError] = useState<string | null>(null);

    // Retrieve session from cookies and handle redirection
    useEffect(() => {
        const sessionData = Cookies.get("session");
        if (sessionData) {
            setSession(JSON.parse(sessionData));
        } else {
            router.push("/auth/signin");
        }
    }, [router]);

    // Fetch goals when session changes
    useEffect(() => {
        const fetchGoals = async () => {
            if (session?.user?.token) {
                try {
                    const response = await fetch(
                        "http://localhost:8000/api/goals/",
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${session.user.token}`,
                            },
                        }
                    );
                    if (!response.ok) {
                        throw new Error("Failed to fetch goals");
                    }
                    const data = await response.json();
                    const formattedGoals = data.map((goal: any) => ({
                        _id: goal._id,
                        name: goal.title,
                        endDate: goal.dueDate,
                    }));
                    // Sort goals by endDate descending (most recent first)
                    formattedGoals.sort(
                        (a: Goal, b: Goal) =>
                            new Date(b.endDate).getTime() -
                            new Date(a.endDate).getTime()
                    );
                    setGoals(formattedGoals);
                } catch (err) {
                    console.error(err);
                    setError("Failed to fetch goals. Please try again.");
                }
            }
        };
        fetchGoals();
    }, [session]);

    // Delete goal by ID (calls API)
    const deleteGoal = async (id: string) => {
        if (session?.user?.token) {
            try {
                const response = await fetch(
                    `http://localhost:8000/api/goals/${id}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${session.user.token}`,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error("Failed to delete goal");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to delete goal. Please try again.");
            }
        }
    };

    // When a checkbox is checked, strike-through the goal, fade it out, then delete it.
    const handleCheckboxChange = (goalId: string, checked: boolean) => {
        if (checked) {
            setCompletedGoals((prev) => [...prev, goalId]);
            setTimeout(() => {
                setFadedGoals((prev) => [...prev, goalId]);
            }, 100);
            setTimeout(() => {
                deleteGoal(goalId);
                setGoals((prevGoals) =>
                    prevGoals.filter((goal) => goal._id !== goalId)
                );
            }, 1000); // Delay to allow fade-out transition
        }
    };

    // Handle opening and closing the dialog
    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setNewName("");
        setNewEndDate("");
        setAddingError(null);
    };

    // Handle adding a new goal
    const handleAddNewGoal = async () => {
        if (!newName || !newEndDate) {
            setAddingError("Please fill out both fields.");
            return;
        }
        try {
            const newGoal = {
                title: newName,
                description: newName,
                dueDate: newEndDate,
            };
            const response = await fetch("http://localhost:8000/api/goals/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.user.token}`,
                },
                body: JSON.stringify(newGoal),
            });
            if (!response.ok) {
                throw new Error("Failed to add goal");
            }
            const savedGoal = await response.json();
            setGoals((prevGoals) => [
                ...prevGoals,
                {
                    _id: savedGoal._id,
                    name: savedGoal.title,
                    endDate: savedGoal.dueDate,
                },
            ]);
            // Re-sort after adding new goal
            setGoals((prevGoals) =>
                [...prevGoals].sort(
                    (a, b) =>
                        new Date(b.endDate).getTime() -
                        new Date(a.endDate).getTime()
                )
            );
            handleCloseDialog();
        } catch (err) {
            console.error(err);
            setAddingError("Failed to add goal. Please try again.");
        }
    };

    return (
        <>
            {/* Set maxHeight so that the table scrolls when there are more than 7 rows */}
            <TableContainer component={Paper} style={{ maxHeight: "420px" }}>
                {/* Add stickyHeader to keep the headers visible on scroll */}
                <Table stickyHeader>
                    <TableHead>
                        {/* First header row: Goals title and plus icon in one row */}
                        <TableRow>
                            <TableCell
                                colSpan={2}
                                style={{
                                    backgroundColor: headerBgColor,
                                    padding: "8px 16px",
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    style={{
                                        color: headerTextColor,
                                        margin: 0,
                                    }}
                                >
                                    Goals
                                </Typography>
                            </TableCell>
                            <TableCell
                                style={{
                                    backgroundColor: headerBgColor,
                                    padding: "8px 16px",
                                    textAlign: "center",
                                }}
                            >
                                <IconButton
                                    onClick={handleOpenDialog}
                                    size="small"
                                >
                                    <AddIcon
                                        style={{ color: headerTextColor }}
                                    />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                        {/* Second header row: column labels */}
                        <TableRow>
                            <TableCell
                                style={{
                                    width: "33%",
                                    backgroundColor: headerBgColor,
                                    color: headerTextColor,
                                }}
                            >
                                <Typography variant="subtitle2">
                                    Completed
                                </Typography>
                            </TableCell>
                            <TableCell
                                style={{
                                    width: "33%",
                                    backgroundColor: headerBgColor,
                                    color: headerTextColor,
                                }}
                            >
                                <Typography variant="subtitle2">
                                    Goal Name
                                </Typography>
                            </TableCell>
                            <TableCell
                                style={{
                                    width: "33%",
                                    backgroundColor: headerBgColor,
                                    color: headerTextColor,
                                    textAlign: "center",
                                }}
                            >
                                <Typography variant="subtitle2">
                                    End Date
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {goals.map((goal) => (
                            <TableRow
                                key={goal._id}
                                style={{
                                    opacity: fadedGoals.includes(goal._id)
                                        ? 0
                                        : 1,
                                    transition: "opacity 1s ease",
                                }}
                            >
                                <TableCell>
                                    <Checkbox
                                        onChange={(e) =>
                                            handleCheckboxChange(
                                                goal._id,
                                                e.target.checked
                                            )
                                        }
                                        color="primary"
                                    />
                                </TableCell>
                                <TableCell
                                    style={{
                                        textDecoration: completedGoals.includes(
                                            goal._id
                                        )
                                            ? "line-through"
                                            : "none",
                                    }}
                                >
                                    {goal.name}
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                    {new Date(
                                        goal.endDate
                                    ).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for adding new goal */}
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>Add New Goal</DialogTitle>
                <DialogContent>
                    {addingError && (
                        <Typography color="error">{addingError}</Typography>
                    )}
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Goal Name"
                        type="text"
                        fullWidth
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="End Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={newEndDate}
                        onChange={(e) => setNewEndDate(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddNewGoal} color="primary">
                        Add Goal
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default GoalTable;
