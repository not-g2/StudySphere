"use client";

import { Card, CardMedia, CardContent, Typography, Grid } from "@mui/material";
import pic1 from "../../public/reward1.jpeg";
import pic2 from "../../public/reward2.jpeg";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface reward {
    title: string;
    picture: string;
    desc: string;
    cost: number;
}

const RewardsDisplay = () => {
    const [session, setSession] = useState<any>(null);
    const router = useRouter();
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
    useEffect(() => {
        const sessionData: string | undefined = Cookies.get("session");

        if (sessionData && !session) {
            setSession(JSON.parse(sessionData));
        } else if (!sessionData) {
            router.push("/");
        }
    }, []);

    return (
        <Grid
            container
            spacing={1}
            paddingLeft={1}
            paddingTop={1}
            margin={0}
            className="bg-c2" // Apply background color c2 to the main container
            sx={{ width: "100%", height: "100vh" }} // Ensure full viewport height
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
                        className="bg-c5" // Apply color c5 to each card
                        sx={{
                            width: "90%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            paddingTop: 1,
                            borderRadius: 3,
                            borderImage:
                                "linear-gradient(45deg, #1b1a55, #070f2b) 1",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                            transition:
                                "transform 0.3s ease, box-shadow 0.3s ease",
                            "&:hover": {
                                transform: "scale(1.02)",
                                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
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
