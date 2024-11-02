"use client";

import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import pic1 from "../../public/reward1.jpeg";
import pic2 from "../../public/reward2.jpeg";

interface reward {
  title: string;
  picture: string;
  desc: string;
  cost: number;
}

const RewardsDisplay = () => {
  const Rewards = [
    {
      title: "Reward 1",
      picture: pic1.src,
      desc: "Description for Reward 1",
      cost: 100,
    },
    {
      title: "Reward 2",
      picture: pic2.src,
      desc: "Description for Reward 2",
      cost: 150,
    },
    {
      title: "Reward 1",
      picture: pic1.src,
      desc: "Description for Reward 1",
      cost: 100,
    },
    {
      title: "Reward 2",
      picture: pic2.src,
      desc: "Description for Reward 2",
      cost: 150,
    },
    {
      title: "Reward 1",
      picture: pic1.src,
      desc: "Description for Reward 1",
      cost: 100,
    },
    {
      title: "Reward 2",
      picture: pic2.src,
      desc: "Description for Reward 2",
      cost: 150,
    },
    {
      title: "Reward 1",
      picture: pic1.src,
      desc: "Description for Reward 1",
      cost: 100,
    },
    {
      title: "Reward 2",
      picture: pic2.src,
      desc: "Description for Reward 2",
      cost: 150,
    },
  ];

  const handleSubmit = (reward: reward) => {
    console.log(reward);
  };

  return (
    <Grid
      container
      spacing={1}
      paddingLeft={1}
      paddingTop={1}
      margin={0}
      style={{ backgroundColor: "#1b1a55", width: "100%" }}
    >
      {Rewards.map((reward, index) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          lg={2}
          key={index}
          sx={{ marginBottom: 1 }}
        >
          <Card
            onClick={() => handleSubmit(reward)}
            sx={{
              width: "90%",
              backgroundColor: "#000000",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 1,
              borderRadius: 3,
              borderImage: "linear-gradient(45deg, #1b1a55, #070f2b) 1", // Gradient border
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow
              transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth transition
              "&:hover": {
                transform: "scale(1.02)", // Slight scaling effect on hover
                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)", // Stronger shadow on hover
              },
              cursor: "pointer",
            }}
          >
            <CardMedia
              component="img"
              height="140"
              image={reward.picture}
              alt={reward.title}
              sx={{
                width: 200,
                height: 200,
                borderRadius: 3,
                border: "1px solid",
              }}
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                color="#FFFFFF"
              >
                {reward.title}
              </Typography>
              <Typography variant="body2" color="#FFFFFF">
                {reward.desc}
              </Typography>
              <Typography color="#FFFFFF">
                Redeem for {reward.cost} points
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RewardsDisplay;
