"use client";
import React from "react";
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
interface DeadlineProps {
    deadlines: Deadline[];
}

const DeadlinesList: React.FC<DeadlineProps> = ({ deadlines }) => {
    const calculateDaysLeft = (deadlineDate: string): number => {
        const now = new Date();
        const due = new Date(deadlineDate);
        const diffTime = due.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };
    return (
        <div>
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
        </div>
    );
};

export default DeadlinesList;
