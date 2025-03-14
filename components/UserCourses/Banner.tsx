"use client";
import { Typography, Box, Avatar } from "@mui/material";

interface BannerProps {
  courseTitle: string;
  bannerImage: string;
  professorImage: string;
}

const Banner: React.FC<BannerProps> = ({ courseTitle, bannerImage, professorImage }) => {
  return (
    <Box
      sx={{
        position: "relative",
        height: 200,
        backgroundImage: `url(${bannerImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        padding: 3,
        color: "#ffffff",
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        Course: {courseTitle}
      </Typography>
      <Avatar
        alt="Professor Name"
        src={professorImage}
        sx={{
          position: "absolute",
          right: 20,
          width: 120,
          height: 120,
          border: "3px solid white",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
        }}
      />
    </Box>
  );
};

export default Banner;
