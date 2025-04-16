"use client";
import React from "react";
import { Box, Typography, Button, Slide } from "@mui/material";
import { useRouter } from "next/navigation";

const PeoplePage: React.FC = () => {
  const router = useRouter();

  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit>
      <Box
        sx={{
          backgroundColor: "#001D3D",
          minHeight: "100vh",
          padding: 4,
        }}
      >
        <Typography variant="h4" color="white" gutterBottom>
          People
        </Typography>
        <Typography color="white">
          This is a placeholder page for People. Here you can list course members,
          group participants, or any other people-related information.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/dashboard")}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Slide>
  );
};

export default PeoplePage;
