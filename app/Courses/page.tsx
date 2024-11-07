"use client";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    CardMedia,
} from "@mui/material";

import pic from "../../public/teach1.jpg";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

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
}

const ClassesPage = () => {
    const router = useRouter();
    const [classesData, setclassesData] = useState([]);
    const [session, setSession] = useState<Session | null>(null);

    const handleCardClick = (classId: number) => {
        router.push(`/Courses/${classId}`);
    };
    useEffect(() => {
        const GetClasses = async () => {
            const sessionData: string | undefined = Cookies.get("session");

            if (sessionData && !session) {
                setSession(JSON.parse(sessionData));
            } else if (!sessionData) {
                console.log("No session cookie found");
            }
            if (session) {
                const token = session?.user.token;

                try {
                    const response = await fetch(
                        `http://localhost:8000/api/courses/student/${session.user.id}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                            method: "GET",
                        }
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setclassesData(data.coursesList);
                    } else {
                        console.error("Failed to get Classes deatils");
                    }
                } catch (error) {
                    console.error("Error Getting Classes Details:", error);
                }
            }
        };

        GetClasses();
    }, [session]);

    return (
        <Box
            className="bg-c2 text-white p-4 flex flex-col items-start"
            sx={{
                minHeight: "100vh",
                width: "100vw",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                align="center"
                className="text-white mt-2 mb-4"
            >
                Your Classes
            </Typography>
            <Grid container spacing={4} justifyContent="flex-start">
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
                            onClick={() => handleCardClick(classItem.id)}
                        >
                            <Grid container sx={{ height: "100%" }}>
                                <Grid item xs={7} sx={{ padding: 2 }}>
                                    <CardContent sx={{ padding: 0 }}>
                                        <Typography
                                            variant="h5"
                                            color="inherit"
                                            sx={{
                                                fontSize: "1.2rem",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {classItem.title}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            color="inherit"
                                            sx={{ fontSize: "1rem" }}
                                        >
                                            {classItem.description}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="inherit"
                                            sx={{ fontSize: "0.9rem" }}
                                        >
                                            {classItem.teacher}
                                        </Typography>
                                    </CardContent>
                                </Grid>
                                <Grid
                                    item
                                    xs={5}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={classItem.imageUrl}
                                        alt={`${classItem.title} cover`}
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
        </Box>
    );
};

export default ClassesPage;
