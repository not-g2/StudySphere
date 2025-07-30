// components/UserCourses/Banner.tsx
import { Box, Typography, Avatar } from "@mui/material";

interface BannerProps {
  courseTitle: string;
  gradient: string;
  professorImage: string;
}

export default function Banner({
  courseTitle,
  gradient,
  professorImage,
}: BannerProps) {
  return (
    <Box
      sx={{
        height: 200,
        width: "100%",
        background: gradient,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        px: 4,
        color: "#fff",
        position: "relative",
      }}
    >
      <Typography variant="h4" sx={{ flex: 1 }}>
        {courseTitle}
      </Typography>
      <Avatar
        src={professorImage}
        sx={{
          width: 56,
          height: 56,
          border: "2px solid rgba(255,255,255,0.8)",
        }}
      />
    </Box>
  );
}
