"use client";

import { Card, CardMedia, CardContent, Typography, Grid } from "@mui/material";
import pic1 from "../../public/reward1.jpeg";
import pic2 from "../../public/reward2.jpeg";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSessionCheck from "../../hooks/auth"; // ✅ Added session hook

interface reward {
    title: string;
    picture: string;
    desc: string;
    cost: number;
}

const RewardsDisplay = () => {
    const PORT = process.env.NEXT_PUBLIC_PORT
    console.log(PORT)
    const [session, setSession] = useState<any>(null);
    const router = useRouter();
    const [rewards, setRewards] = useState([]);

    useSessionCheck(setSession); // ✅ Use session check hook

    useEffect(() => {
        const getRewards = async () => {
            if (!session) return;

            try {
                const response = await fetch(
                    `http://localhost:${PORT}/api/rewd/rewards`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session.user.token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setRewards(data.rewards);
            } catch (error) {
                console.error("Error fetching rewards:", error);
            }
        };

        getRewards();
    }, [session]);

    function handleSubmit(reward: any) {
        const redeemReward = async (rewardId: any, userId: any) => {
            try {
                const response = await fetch(
                    `http://localhost:${PORT}/api/rewd/rewards/redeem/${rewardId}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session.user.token}`,
                        },
                        body: JSON.stringify({ userId }),
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Error redeeming reward");
                }

                const data = await response.json();
                alert(`${data.message}, Coupon Code ${data.coupon_id}`);
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        };

        redeemReward(reward._id, session.user.id);
    }

    return (
        <Grid
            container
            spacing={1}
            paddingLeft={1}
            paddingTop={1}
            margin={0}
            className="bg-c2"
            sx={{ width: "100%", height: "100vh" }}
        >
            {rewards.map((reward, index) => (
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
                        className="bg-c5"
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
