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
} from "@mui/material";

type Deadline = {
  id: number | string;
  name: string;
  date: string;
};

function DeadlinesList() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);

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
          `http://localhost:8000/api/users/${userId}/deadlines`
        );
        if (response.ok) {
          const data = await response.json();
          const formattedDeadlines = data.deadlines.map((deadline: any) => ({
            id: deadline.id || `${deadline.assignmentTitle}-${deadline.dueDate}`,
            name: deadline.assignmentTitle,
            date: deadline.dueDate,
          }));
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
    <div style={{ padding: "16px", width: "100%" }}>
      {/* <Typography
        variant="h4"
        align="center"
        gutterBottom
        style={{ color: "#000" }}
      >
        Deadlines
      </Typography> */}
      <TableContainer component={Paper} style={{ backgroundColor: "#FFFFFF" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Deadline</TableCell>
              <TableCell align="center">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deadlines.map((deadline) => (
              <TableRow key={deadline.id}>
                <TableCell align="center">{deadline.name}</TableCell>
                <TableCell align="center">
                  {new Date(deadline.date).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default DeadlinesList;
