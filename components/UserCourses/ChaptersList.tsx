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
    const formatDate = (date: string) => {
        return format(new Date(date), "MMMM dd, yyyy HH:mm:ss");
    };

    const viewPdf = (chapterID: number) => {
        window.open(
            `${process.env.NEXT_PUBLIC_URL}/api/chapter/pdf/${chapterID}`,
            "_blank"
        );
    };

    return (
        <>
            <Typography variant="h5" gutterBottom style={{ color: "#fff" }}>
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
                {chapters.map((chapter) => (
                    <Card
                        key={chapter._id}
                        style={{
                            marginBottom: 8,
                            borderRadius: 8,
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                            backgroundColor: "#012E5E",
                            color: "#fff",
                            cursor: "pointer",
                        }}
                        onClick={() => viewPdf(chapter._id)}
                    >
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {chapter.title}
                            </Typography>
                            <Typography
                                variant="body2"
                                style={{ color: "#d3d3d3" }}
                            >
                                Posted on: {formatDate(chapter.createdAt)}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </>
    );
};

export default ChaptersList;
