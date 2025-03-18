"use client";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    CardMedia,
    Button,
} from "@mui/material";
import pic from "../../../public/teach1.jpg";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ClassCodePopup from "../../../components/classAdd";
import useSessionCheck from "../../hooks/auth";

type Session = {
    user: {
        id: string;
        token: string;
    };
    email: string;
    isAdmin: boolean;
};

interface classItem {
    _id: string;
    name: string;
    description: string;
    students: string[];
    chapters: string[];
    createdAt: string;
    __v: number;
    coursePic: {
        publicId: {
            type: string;
        };
        url: {
            type: string;
        };
    };
}

const ClassesPage = () => {
    const PORT = process.env.NEXT_PUBLIC_PORT;
    const router = useRouter();
    const [classesData, setClassesData] = useState<classItem[]>([]);
    const [session, setSession] = useState<Session | null>(null);
    const [openClassCodePopup, setOpenClassCodePopup] = useState(false);

    useSessionCheck(setSession);

    const handleCardClick = (classId: string) => {
        router.push(`/Courses/${classId}`);
    };

    useEffect(() => {
        const getClasses = async () => {
            if (session) {
                try {
                    const response = await fetch(
                        `http://localhost:${PORT}/api/courses/student/${session.user.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${session.user.token}`,
                            },
                            method: "GET",
                        }
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setClassesData(data.coursesList);
                    } else {
                        console.error("Failed to get Classes details");
                    }
                } catch (error) {
                    console.error("Error Getting Classes Details:", error);
                }
            }
        };

        getClasses();
    }, [session, openClassCodePopup]);

    const handleCloseClassCodePopup = () => {
        setOpenClassCodePopup(false);
    };

    const onJoinClass = async (classCode: string) => {
        if (session) {
            const requestData = {
                studentId: session.user.id,
                courseCode: classCode,
            };

            try {
                const response = await fetch(
                    `http://localhost:${PORT}/api/courses/add-course`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session.user.token}`,
                        },
                        body: JSON.stringify(requestData),
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error adding student to course:", errorData);
                }
            } catch (error) {
                console.error("Network error:", error);
            }
        }
    };

    return (
        <div className="bg-[#001D3D] h-full">
            <Box
                className="bg-c2 text-white p-4 flex flex-col items-start"
                sx={{
                    minHeight: "100vh",
                    width: "100vw",
                    alignItems: "center",
                }}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ width: "100vw" }}
                >
                    <Typography
                        variant="h4"
                        gutterBottom
                        className="text-white mt-2 mb-4"
                    >
                        Your Classes
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenClassCodePopup(true)}
                        sx={{ ml: 2, mr: 4 }}
                    >
                        Join Class
                    </Button>
                </Box>

                <Grid
                    container
                    spacing={4}
                    justifyContent="flex-start"
                    sx={{ flexGrow: 1 }}
                >
                    {classesData.map((classItem) => (
                        <Grid
                            item
                            key={classItem._id}
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            display="flex"
                            justifyContent="center"
                        >
                            <Card
                                className="bg-c5 text-white"
                                sx={{
                                    width: "100%",
                                    height: "300px",
                                    cursor: "pointer",
                                }}
                                onClick={() => handleCardClick(classItem._id)}
                            >
                                <Grid container sx={{ height: "100%" }}>
                                    <Grid item xs={7} sx={{ padding: 2 }}>
                                        <CardContent sx={{ padding: 0 }}>
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    fontSize: "1.2rem",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {classItem.name}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{ fontSize: "1rem" }}
                                            >
                                                {classItem.description}
                                            </Typography>
                                        </CardContent>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={5}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <CardMedia
                                            component="img"
                                            image={pic.src}
                                            alt={`${classItem.name} cover`}
                                            sx={{
                                                width: "120px",
                                                height: "120px",
                                                objectFit: "cover",
                                                borderRadius: "50%",
                                                border: "2px solid #010101",
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <ClassCodePopup
                    open={openClassCodePopup}
                    handleClose={handleCloseClassCodePopup}
                    onJoinClass={onJoinClass}
                />
            </Box>
        </div>
    );
};

export default ClassesPage;
