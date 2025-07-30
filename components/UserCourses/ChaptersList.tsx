// components/UserCourses/ChaptersList.tsx
"use client";
import { Typography, Card, CardContent, Box } from "@mui/material";
import { format } from "date-fns";

interface Chapter {
  _id: number;
  title: string;
  createdAt: string;
  chapterPdf: string;
}

interface ChaptersListProps {
  chapters: Chapter[];
}

const ChaptersList: React.FC<ChaptersListProps> = ({ chapters }) => {
  const colors = ["#0A6EA8", "#6A1B9A", "#F57C00", "#C2185B"];

  const formatDate = (date: string) =>
    format(new Date(date), "MMMM dd, yyyy HH:mm:ss");

  const viewPdf = (chapterID: number) => {
    window.open(
      `${process.env.NEXT_PUBLIC_URL}/api/chapter/pdf/${chapterID}`,
      "_blank"
    );
  };

  return (
    <>
      <Typography variant="h5" gutterBottom style={{ color: "#000" }}>
        Chapters
      </Typography>

      <Box
        sx={{
          maxHeight: 400,
          overflowY: "auto",
          paddingRight: 1,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {chapters.map((chapter, idx) => {
          const bg = colors[idx % colors.length];
          return (
            <Card
              key={chapter._id}
              style={{
                marginBottom: 8,
                borderRadius: 8,
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                backgroundColor: bg,
                color: "#fff",
                cursor: "pointer",
              }}
              onClick={() => viewPdf(chapter._id)}
            >
              <CardContent>
                <Typography variant="h6">{chapter.title}</Typography>
                <Typography variant="body2" style={{ color: "#f0f0f0" }}>
                  Posted on: {formatDate(chapter.createdAt)}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </>
  );
};

export default ChaptersList;
