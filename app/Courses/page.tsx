import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CardMedia,
} from "@mui/material";

import pic from "../../public/teach1.jpeg";

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
    id: 11,
    title: "Mathematics",
    description: "Algebra and Geometry",
    teacher: "Mr. Smith",
    imageUrl: pic.src,
  },
  {
    id: 12,
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

const ClassesPage = () => {
  return (
    <Container className="ml-2">
      <Typography variant="h4" gutterBottom className="mt-2">
        Your Classes
      </Typography>
      <Grid container spacing={15} justifyContent="center">
        {classesData.map((classItem) => (
          <Grid item key={classItem.id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ width: 300, height: 200 }}>
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
                    <Box mt={1}>
                      <Button variant="contained" color="primary" size="small">
                        Open Class
                      </Button>
                    </Box>
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
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "50%",
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
