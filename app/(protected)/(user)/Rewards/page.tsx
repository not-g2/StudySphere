"use client";
import { useEffect, useState } from "react";
import useSessionCheck from "../../../hooks/auth"; // ✅ Added session hook
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CardComp from "@/components/Rewards/CardComp";
import { toast } from "react-toastify";

interface reward {
    _id: string;
    name: string;
    picture: string;
    reqPoints: number;
}

const getRewards = async (token: string) => {
    if (!token) return Promise.resolve([]);

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
    const redeemReward = async (token: string, reward_id: string) => {
        return fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/rewd/rewards/redeem/${reward_id}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: session.user.id,
                }),
            }
        )
            .then((res) => {
                if (!res.ok) {
                    return res.json().then((data) => {
                        toast.error(`${data.error}`);
                    });
                }

                return res.json();
            })
            .then((data) => {
                toast.success(`Congratulations, ${data.message}`);
                queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            });
    };
    const [session, setSession] = useState<any>(null);
    const queryClient = useQueryClient();

    useSessionCheck(setSession);

    const {
        data: Rewards = [],
        isLoading,
        isError,
    } = useQuery<reward[]>({
        queryKey: ["userRewards"],
        queryFn: () => getRewards(session.user.token),
        enabled: !!session?.user?.token,
    });

    if (isLoading)
        return (
            <div className="bg-c2 w-full min-h-screen items-center justify-center text-2xl flex text-white">
                Loading Rewards ....
            </div>
        );
    if (isError)
        return (
            <div className="bg-c2 w-full min-h-screen items-center justify-center text-5xl flex text-white">
                Error Occured
            </div>
        );

    return (
        <div className="w-full min-h-screen bg-c2 p-4">
            <h2 className="text-4xl text-center text-white font-semibold pb-5">
                Welcome to the Shop
            </h2>
            <div className="mx-auto max-w-screen-lg grid gap-6 grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] justify-items-center">
                {Rewards.map((reward, index) => (
                    <CardComp
                        key={reward._id}
                        name={reward.name}
                        picture={reward.picture}
                        reqPoints={reward.reqPoints}
                        onRedeem={() =>
                            redeemReward(session.user.token, reward._id)
                        }
                    />
                ))}
            </div>
        </div>
    );
};

export default RewardsDisplay;
