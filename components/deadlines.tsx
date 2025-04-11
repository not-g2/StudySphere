"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Tooltip,
} from "@mui/material";
import { headers } from "next/headers";

type Deadline = {
    id: number | string;
    name: string;
    date: string;
    course: string;
};

function DeadlinesList() {
    const [deadlines, setDeadlines] = useState<Deadline[]>([]);

    // Helper function to calculate days left until the deadline
    const calculateDaysLeft = (deadlineDate: string): number => {
        const now = new Date();
        const due = new Date(deadlineDate);
        const diffTime = due.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    useEffect(() => {
        const fetchDeadlines = async () => {
            try {
                const sessionData = Cookies.get("session");
                if (!sessionData) {
                    console.error("No session data found");
                    return;
                }
                const session = JSON.parse(sessionData);
                const userId = session.user?.id;
                if (!userId) {
                    console.error("User ID is missing in session data");
                    return;
                }
                const response = await fetch(
                    `http://localhost:8000/api/users/${userId}/deadlines`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session.user.token}`,
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    const formattedDeadlines = data.deadlines.map(
                        (deadline: any) => ({
                            id:
                                deadline.id ||
                                `${deadline.assignmentTitle}-${deadline.dueDate}`,
                            name: deadline.assignmentTitle,
                            date: deadline.dueDate,
                            course: deadline.courseName,
                        })
                    );
                    // Sort deadlines by date in increasing order
                    formattedDeadlines.sort((a: Deadline, b: Deadline) => {
                        return (
                            new Date(a.date).getTime() -
                            new Date(b.date).getTime()
                        );
                    });
                    setDeadlines(formattedDeadlines);
                } else {
                    console.error("Failed to fetch deadlines", response.status);
                }
            } catch (error) {
                console.error("Error fetching deadlines:", error);
            }
        };

        fetchDeadlines();
    }, []);

    return (
        <>
            <TableContainer
                component={Paper}
                style={{
                    backgroundColor: "#FFFFFF",
                    overflowX: "hidden",
                    overflowY: "auto",
                    maxHeight: "400px", // Increased for 7 rows
                }}
            >
                <Table>
                    <TableHead>
                        {/* Integrated headline as the first header row */}
                        <TableRow style={{ backgroundColor: "#1976d2" }}>
                            <TableCell
                                colSpan={2}
                                align="center"
                                style={{
                                    color: "#FFF",
                                    fontWeight: "bold",
                                    padding: "8px",
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    component="div"
                                    style={{ color: "#FFF" }}
                                >
                                    Upcoming Deadlines
                                </Typography>
                            </TableCell>
                        </TableRow>
                        {/* Column headers */}
                        <TableRow style={{ backgroundColor: "#1976d2" }}>
                            <TableCell
                                align="center"
                                style={{ color: "#FFF", fontWeight: "bold" }}
                            >
                                Deadline
                            </TableCell>
                            <TableCell
                                align="center"
                                style={{ color: "#FFF", fontWeight: "bold" }}
                            >
                                Days Left
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {deadlines.map((deadline) => {
                            const daysLeft = calculateDaysLeft(deadline.date);
                            return (
                                <Tooltip
                                    key={deadline.id}
                                    title={
                                        <div>
                                            <Typography variant="body2">
                                                <strong>Course:</strong>{" "}
                                                {deadline.course}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Full Name:</strong>{" "}
                                                {deadline.name}
                                            </Typography>
                                        </div>
                                    }
                                    arrow
                                    placement="top"
                                >
                                    <TableRow
                                        style={{
                                            transition: "transform 0.2s",
                                            cursor: "pointer",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.transform =
                                                "scale(1.02)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.transform =
                                                "scale(1)")
                                        }
                                    >
                                        <TableCell align="center">
                                            {deadline.name}
                                        </TableCell>
                                        <TableCell align="center">
                                            {daysLeft >= 0
                                                ? daysLeft
                                                : "Expired"}
                                        </TableCell>
                                    </TableRow>
                                </Tooltip>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default DeadlinesList;
