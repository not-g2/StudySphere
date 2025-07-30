// components/DeadlinesList.tsx
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
import { lighten } from "@mui/material/styles";

type Deadline = {
  id: number | string;
  name: string;
  date: string;
  course: string;
};

export default function DeadlinesList() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);

  // Constants for fixed two‑row height
  const VISIBLE_ITEMS = 2;
  const ROW_HEIGHT = 56;          // px per row
  const HEADER_ROWS = 1;          // only title row now
  const HEADER_ROW_HEIGHT = 48;   // px per header row
  const CONTAINER_HEIGHT =
    HEADER_ROWS * HEADER_ROW_HEIGHT + VISIBLE_ITEMS * ROW_HEIGHT;

  const baseColor = "#1976d2";

  const calculateDaysLeft = (deadlineDate: string) => {
    const now = new Date();
    const due = new Date(deadlineDate);
    const diff = due.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const sessionData = Cookies.get("session");
        if (!sessionData) return;
        const session = JSON.parse(sessionData);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/users/${session.user.id}/deadlines`,
          {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
          }
        );
        if (!res.ok) return;
        const data = await res.json();
        const formatted = data.deadlines
          .map((d: any) => ({
            id: d.id || `${d.assignmentTitle}-${d.dueDate}`,
            name: d.assignmentTitle,
            date: d.dueDate,
            course: d.courseName,
          }))
          .sort(
            (a: Deadline, b: Deadline) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          );
        setDeadlines(formatted);
      } catch {
        // silent
      }
    };
    fetchDeadlines();
  }, []);

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: baseColor,
        height: `${CONTAINER_HEIGHT}px`,
        overflowY: "auto",
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
        msOverflowStyle: "none",  // <-- use camelCase here!
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              colSpan={2}
              align="center"
              sx={{
                backgroundColor: lighten(baseColor, 0.2),
                color: "#fff",
                p: 1,
              }}
            >
              <Typography variant="h6" sx={{ color: "#fff", m: 0 }}>
                Upcoming Deadlines
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deadlines.map((d, idx) => {
            const shadeFactor =
              0.15 + (idx / (deadlines.length - 1 || 1)) * 0.3;
            return (
              <Tooltip
                key={d.id}
                title={
                  <>
                    <Typography variant="body2">
                      <strong>Course:</strong> {d.course}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Name:</strong> {d.name}
                    </Typography>
                  </>
                }
                arrow
                placement="top"
              >
                <TableRow
                  sx={{
                    backgroundColor: lighten(baseColor, shadeFactor),
                    height: `${ROW_HEIGHT}px`,
                  }}
                >
                  <TableCell align="center" sx={{ color: "#fff" }}>
                    {d.name}
                  </TableCell>
                  <TableCell align="center" sx={{ color: "#fff" }}>
                    {calculateDaysLeft(d.date) >= 0
                      ? calculateDaysLeft(d.date)
                      : "Expired"}
                  </TableCell>
                </TableRow>
              </Tooltip>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
