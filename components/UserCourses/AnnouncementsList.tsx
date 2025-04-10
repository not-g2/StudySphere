"use client";
import React from "react";
import { Typography, Card, CardContent, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Announcement } from "@/types/announcements";

interface AnnouncementsListProps {
    announcements: Announcement[];
    onAnnouncementClick: (announcement: Announcement) => void;
    onDeleteAnnouncement?: (announcementId: number) => void;
    currentUserRole?: string;
}

const AnnouncementsList: React.FC<AnnouncementsListProps> = ({
    announcements,
    onAnnouncementClick,
    onDeleteAnnouncement,
    currentUserRole,
}) => {
    return (
        <>
            <Typography variant="h5" gutterBottom sx={{ color: "#fff" }}>
                Announcements
            </Typography>
            <Box
                sx={{
                    maxHeight: 400,
                    overflowY: "auto",
                    paddingRight: 1,
                    "&::-webkit-scrollbar": { display: "none" },
                }}
            >
                {announcements.map((announcement) => (
                    <Card
                        key={announcement._id}
                        sx={{
                            mb: 1,
                            borderRadius: 2,
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                            backgroundColor: "#012E5E",
                            color: "#fff",
                            cursor: "pointer",
                            position: "relative",
                        }}
                        onClick={() => onAnnouncementClick(announcement)}
                    >
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {announcement.title}
                            </Typography>
                            <Typography
                                variant="body2"
                                noWrap
                                sx={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {announcement.description}
                            </Typography>
                        </CardContent>
                        {(currentUserRole === "Admin" ||
                            currentUserRole === "Creator") && (
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteAnnouncement?.(announcement._id);
                                }}
                                size="small"
                                sx={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    color: "#fff",
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Card>
                ))}
            </Box>
        </>
    );
};

export default AnnouncementsList;
