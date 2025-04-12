"use client";
import React, { useEffect, useState, useRef } from "react";
import { Card, Typography, Fade, Link, Button, Box } from "@mui/material";
import Cookies from "js-cookie";

interface Chapter {
    _id: number;
    title: string;
    createdAt: string;
    chapterPdf: string;
}

interface ChaptersListProps {
    chapters: Chapter[];
    // Optional callback to update the chapters state in the parent component.
    setChapters?: React.Dispatch<React.SetStateAction<Chapter[]>>;
}

const cardColors = ["#0DB7F0", "#AB47BC", "#FA9F1B", "#F06292"];

const ChaptersList = ({ chapters, setChapters }: ChaptersListProps) => {
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

    const handleDelete = async (chapterId: number) => {
        try {
            // Retrieve session token from cookies.
            const sessionData = Cookies.get("session");
            if (!sessionData) {
                console.error("User session not found.");
                return;
            }
            const token = JSON.parse(sessionData).user.token;

            console.log(chapterId);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_URL}/api/chapter/delete/${chapterId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.ok) {
                // Optionally update local state to remove the deleted chapter.
                if (setChapters) {
                    setChapters((prevChapters) =>
                        prevChapters.filter(
                            (chapter) => chapter._id !== chapterId
                        )
                    );
                }
                console.log(`Chapter ${chapterId} deleted successfully.`);
            } else {
                console.error("Failed to delete chapter");
            }
        } catch (error) {
            console.error("Error deleting chapter:", error);
        }
    };

    return (
        <div>
            {chapters.map((chapter, index) => (
                <Fade in={visible[index]} timeout={500} key={chapter._id}>
                    <div>
                        <Card
                            sx={{
                                backgroundColor:
                                    cardColors[index % cardColors.length],
                                marginBottom: 2,
                                padding: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Box>
                                    <Typography variant="h6" color="white">
                                        {chapter.title}
                                    </Typography>
                                    <Link
                                        href={chapter.chapterPdf}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            textDecoration: "underline",
                                            color: "white",
                                            mt: 1,
                                        }}
                                    >
                                        View PDF
                                    </Link>
                                </Box>
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => handleDelete(chapter._id)}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Card>
                    </div>
                </Fade>
            ))}
        </div>
    );
};

export default React.memo(ChaptersList);
