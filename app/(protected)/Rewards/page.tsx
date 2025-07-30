"use client";

import { Card, CardMedia, CardContent, Typography, Grid } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useSessionCheck from "../../hooks/auth"; // ✅ Added session hook
import { useQuery } from "@tanstack/react-query";

interface reward {
    title: string;
    picture: string;
    desc: string;
    cost: number;
}

const getRewards = (token: string) => {
    if (!token) return Promise.resolve([]);

    const PORT = process.env.NEXT_PUBLIC_PORT || "8000";

    return fetch(`${process.env.NEXT_PUBLIC_URL}/api/rewd/rewards`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            return response.json();
        })
        .then((data) => {
            return data.rewards;
        })
        .catch((error) => {
            console.error("Error fetching rewards:", error);
            return [];
        });
};

const RewardsDisplay = () => {
    const PORT = process.env.NEXT_PUBLIC_PORT;
    const [session, setSession] = useState<any>(null);
    const router = useRouter();

    useSessionCheck(setSession);

    const {
        data = [],
        isLoading,
        isError,
    } = useQuery<reward[]>({
        queryKey: ["userRewards"],
        queryFn: () => getRewards(session.user.token),
        enabled: !!session?.user?.token,
    });

    function handleSubmit(reward: any) {
        const redeemReward = async (rewardId: any, userId: any) => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_URL}/api/rewd/rewards/redeem/${rewardId}`,
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
                    throw new Error(
                        errorData.error || "Error redeeming reward"
                    );
                }

                const data = await response.json();
                alert(`${data.message}, Coupon Code ${data.coupon_id}`);
            } catch (error: unknown) {
                const e = error as Error;
                alert(`Error: ${e.message}`);
            }
        };

        redeemReward(reward._id, session.user.id);
    }

    if (isLoading)
        return (
            <div className="bg-c2 w-full min-h-screen items-center justify-center text-5xl flex text-white">
                Loading ...
            </div>
        );
    if (isError)
        return (
            <div className="bg-c2 w-full min-h-screen items-center justify-center text-5xl flex text-white">
                Error Occured
            </div>
        );

    return (
        <Grid
            container
            spacing={1}
            paddingLeft={1}
            paddingTop={1}
            margin={0}
            className="bg-white"
            sx={{ width: "100%", height: "100vh" }}
        >
            {data.map((reward, index) => (
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
                        className="!bg-black"
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
