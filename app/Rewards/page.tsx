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
    <Grid container spacing={2} padding={4}>
      {Rewards.map((reward, index) => (
        <Grid item xs={12} sm={6} md={2} key={index} sx={{ margin: 0 }}>
          <Card
            onClick={() => handleSubmit(reward)}
            sx={{
              maxWidth: 220,
              backgroundColor: "#EEEEEE",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 1,
              cursor: "pointer", // Change cursor to pointer for better UX
              "&:hover": {
                boxShadow: 4, // Optional: Adds shadow effect on hover
              },
            }}
          >
            <CardMedia
              component="img"
              height="140"
              image={reward.picture}
              alt={reward.title}
              sx={{ width: 200, height: 200, borderRadius: 2 }}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {reward.title}
              </Typography>
              <Typography variant="body2" color="#0D1B2A">
                {reward.desc}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                Redeem for {reward.cost} points
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RewardsDisplay;
