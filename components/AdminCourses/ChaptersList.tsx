import React, { useEffect, useState, useRef } from "react";
import { Card, Typography, Fade, Link } from "@mui/material";

interface Chapter {
  _id: number;
  title: string;
  createdAt: string;
  chapterPdf: string;
}

interface ChaptersListProps {
  chapters: Chapter[];
}

const cardColors = ["#0DB7F0", "#AB47BC", "#FA9F1B", "#F06292"];

const ChaptersList = ({ chapters }: ChaptersListProps) => {
  const [visible, setVisible] = useState<boolean[]>([]);
  const initialRender = useRef(true);

  useEffect(() => {
    // Run animation only on initial mount or if the number of chapters changes.
    if (initialRender.current || visible.length !== chapters.length) {
      setVisible(Array(chapters.length).fill(false));
      chapters.forEach((_, index) => {
        setTimeout(() => {
          setVisible((prev) => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
          });
        }, index * 200); // Delay each item by 200ms times its index.
      });
      initialRender.current = false;
    }
  }, [chapters]);

  return (
    <div>
      {chapters.map((chapter, index) => (
        <Fade in={visible[index]} timeout={500} key={chapter._id}>
          <div>
            <Card
              sx={{
                backgroundColor: cardColors[index % cardColors.length],
                marginBottom: 2,
                padding: 2,
              }}
            >
              <Typography variant="h6" color="white">
                {chapter.title}
              </Typography>
              <Link
                href={chapter.chapterPdf}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textDecoration: "underline", color: "white", mt: 1 }}
              >
                View PDF
              </Link>
            </Card>
          </div>
        </Fade>
      ))}
    </div>
  );
};

export default React.memo(ChaptersList);
