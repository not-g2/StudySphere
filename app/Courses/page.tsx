"use client";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
} from "@mui/material";

import pic from "../../public/teach1.jpeg";
import { useRouter } from "next/navigation";

const classesData = [
  {
    id: 1,
    title: "Mathematics",
    description: "Algebra and Geometry",
    teacher: "Mr. Smith",
    imageUrl: pic.src,
  },
  {
    id: 10,
    title: "Mathematics",
    description: "Algebra and Geometry",
    teacher: "Mr. Smith",
    imageUrl: pic.src,
  },
  {
    id: 2,
    title: "Science",
    description: "Biology and Chemistry",
    teacher: "Mrs. Johnson",
    imageUrl: "/images/science.jpg",
  },
  {
    id: 3,
    title: "History",
    description: "World History",
    teacher: "Mr. Brown",
    imageUrl: "/images/history.jpg",
  },
  {
    id: 4,
    title: "English",
    description: "Literature and Writing",
    teacher: "Ms. Davis",
    imageUrl: "/images/english.jpg",
  },
];

interface classItem {
  id: number;
  title: string;
  description: string;
  teacher: string;
  imageUrl: string;
}

const ClassesPage = () => {
  const router = useRouter();

  const handleCardClick = (classId: number) => {
    router.push(`/Courses/${classId}`);
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100%",
      }}
    >
      <Typography variant="h4" gutterBottom className="mt-2" align="center">
        Your Classes
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {classesData.map((classItem) => (
          <Grid
            item
            key={classItem.id}
            xs={12}
            sm={6}
            md={4}
            lg={4}
            display="flex"
            justifyContent="center"
          >
            <Card
              sx={{
                width: 400,
                height: 200,
                border: 3,
                borderColor: "#011001",
                cursor: "pointer",
              }}
              onClick={() => handleCardClick(classItem.id)}
            >
              <Grid container sx={{ height: "100%" }}>
                {/* Left side with text content */}
                <Grid item xs={6} sx={{ padding: 2 }}>
                  <CardContent sx={{ padding: 0 }}>
                    <Typography variant="h6">{classItem.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {classItem.description}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {classItem.teacher}
                    </Typography>
                  </CardContent>
                </Grid>
                {/* Right side with circular image */}
                <Grid
                  item
                  xs={6}
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
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      borderColor: "#010101",
                      border: "3px double",
                    }}
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ClassesPage;
