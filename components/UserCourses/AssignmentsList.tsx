// components/UserCourses/AssignmentsList.tsx
"use client";
import { Typography, Card, CardContent, Button } from "@mui/material";
import { format } from "date-fns";

interface Assignment {
  _id: number;
  title: string;
  dueDate: string;
  course?: string;
  description?: string;
  link?: string;
  createdAt?: string;
}

interface AssignmentsListProps {
  assignments: Assignment[];
  submissionsLoading: boolean;
  isSubmitted: (assignmentId: number) => boolean;
  onAssignmentClick: (assignment: Assignment) => void;
}

const AssignmentsList: React.FC<AssignmentsListProps> = ({
  assignments,
  submissionsLoading,
  isSubmitted,
  onAssignmentClick,
}) => {
  const colors = ["#0A6EA8", "#6A1B9A", "#F57C00", "#C2185B"];

  const formatDate = (date: string) =>
    format(new Date(date), "MMMM dd, yyyy HH:mm:ss");

  return (
    <>
      <Typography variant="h5" gutterBottom style={{ color: "#000" }}>
        Assignments Due
      </Typography>

      {assignments.map((assignment, idx) => {
        const bg = colors[idx % colors.length];
        return (
          <Card
            key={assignment._id}
            style={{
              marginBottom: 16,
              padding: 16,
              borderRadius: 8,
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              backgroundColor: bg,
              color: "#fff",
            }}
          >
            <CardContent>
              <Typography variant="h6">{assignment.title}</Typography>
              <Typography variant="body2" style={{ color: "#f0f0f0" }}>
                Due Date: {formatDate(assignment.dueDate)}
              </Typography>
            </CardContent>

            {submissionsLoading ? (
              <Button disabled size="small" variant="contained">
                Loading...
              </Button>
            ) : !isSubmitted(assignment._id) ? (
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => onAssignmentClick(assignment)}
              >
                View Details
              </Button>
            ) : (
              <Typography style={{ color: "green", marginLeft: 16 }}>
                Submitted
              </Typography>
            )}
          </Card>
        );
      })}
    </>
  );
};

export default AssignmentsList;
