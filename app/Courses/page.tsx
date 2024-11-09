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
import pic from "../../public/teach1.jpg";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import ClassCodePopup from "../../components/classAdd";

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
    const router = useRouter();
    const [classesData, setclassesData] = useState<classItem[]>([]);
    const [session, setSession] = useState<Session | null>(null);
    const [openClassCodePopup, setOpenClassCodePopup] = useState(false); // State for the popup
    const [currentClassCode, setCurrentClassCode] = useState(""); // Store the current class code

    const handleCardClick = (classId: string, classCode: string) => {
        setCurrentClassCode(classCode); // Set the class code when the card is clicked
        setOpenClassCodePopup(true); // Open the popup
        router.push(`/Courses/${classId}`);
    };

    useEffect(() => {
        const GetClasses = async () => {
            const sessionData: string | undefined = Cookies.get("session");

            if (sessionData && !session) {
                setSession(JSON.parse(sessionData));
            } else if (!sessionData) {
                router.push("/auth/signin");
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
                        console.error("Failed to get Classes details");
                    }
                } catch (error) {
                    console.error("Error Getting Classes Details:", error);
                }
            }
        };

        GetClasses();
    }, [session, openClassCodePopup]);

    const handleCloseClassCodePopup = () => {
        setOpenClassCodePopup(false); // Close the popup
    };

    function onJoinClass(classCode: string) {
        async function addStudentToCourse() {
            const sessionData: string | undefined = Cookies.get("session");

            if (sessionData && !session) {
                setSession(JSON.parse(sessionData));
            } else if (!sessionData) {
                router.push("/auth/signin");
            }
            if (session) {
                const token = session?.user.token;

                const requestData = {
                    studentId: session.user.id,
                    courseCode: classCode,
                };

                try {
                    const response = await fetch(
                        "http://localhost:8000/api/courses/add-course",
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(requestData),
                        }
                    );

                    if (response.ok) {
                        const data = await response.json();
                        console.log("Student added to course:", data);
                    } else {
                        const errorData = await response.json();
                        console.error(
                            "Error adding student to course:",
                            errorData
                        );
                    }
                } catch (error) {
                    console.error("Network error:", error);
                }
            }
        }
        addStudentToCourse();
    }

    return (
        <div className="bg-[#001D3D] h-full">
            <Box
                className="bg-c2 text-white p-4 flex flex-col items-start"
                sx={{
                    minHeight: "100vh", // Keep the min height of the viewport
                    width: "100vw",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "001D3D",
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
                        onClick={() => setOpenClassCodePopup(true)} // Open popup on button click
                        sx={{ ml: 2, mr: 4 }}
                    >
                        Join Class
                    </Button>
                </Box>

                {/* Make the Grid container grow to take up the remaining space */}
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
                                onClick={() =>
                                    handleCardClick(
                                        classItem._id,
                                        classItem._id
                                    )
                                } // Pass class code here
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
                                                {classItem.name}
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
                                                Teacher: Havent Figured it out
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
