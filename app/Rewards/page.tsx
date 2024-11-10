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
    const [rewards, setrewards] = useState([]);

    useEffect(() => {
        const sessionData: string | undefined = Cookies.get("session");

        if (sessionData && !session) {
            setSession(JSON.parse(sessionData));
        } else if (!sessionData) {
            router.push("/");
        }

        const getRewards = async () => {
            if (!session) {
                return;
            }
            try {
                const response = await fetch(
                    "http://localhost:8000/api/rewd/rewards",
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
                setrewards(data.rewards);
            } catch (error) {
                console.error("Error fetching rewards:", error);
                return null;
            }
        };
        getRewards();
    }, [session]);

    function handleSubmit(reward: any) {
        const redeemReward = async (rewardId: any, userId: any) => {
            try {
                const response = await fetch(
                    `http://localhost:8000/api/rewd/rewards/redeem/${rewardId}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session.user.token}`, // Replace with actual auth token if required
                        },
                        body: JSON.stringify({ userId: userId }),
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.error || "Error redeeming reward"
                    );
                }

                const data = await response.json();
                alert(`${data.message}, Coupon Code ${data.coupon_id}`);
                return data;
            } catch (error) {
                alert(`Error: ${error.message}`);
                return null;
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
            className="bg-c2" // Apply background color c2 to the main container
            sx={{ width: "100%", height: "100vh" }} // Ensure full viewport height
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
                            alt={reward.name}
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
                                {reward.name}
                            </Typography>
                            {/* <Typography variant="body2" color="#FFFFFF">
                                {reward.desc}
                            </Typography> */}
                            <Typography color="#FFFFFF">
                                Redeem for {reward.reqPoints} points
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default RewardsDisplay;
