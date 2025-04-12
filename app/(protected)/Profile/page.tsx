"use client";

import useSessionCheck from "@/app/hooks/auth";
import BadgeCarousel from "@/components/Profile/BadgeCarousel";
import CustomInputField from "@/components/Profile/CustomInputField";
import { Avatar, Card, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Session } from "@/types/session";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import fetchProfile from "@/utils/fetchProfile";
import { userProps } from "@/types/user";

const ProfilePage = () => {
    const [session, setSession] = useState<Session | null>(null);
    useSessionCheck(setSession);
    const [user, setUser] = useState<userProps | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ["userProfile"],
        queryFn: () => fetchProfile(session?.user?.token || ""),
        enabled: !!session?.user?.token,
    });

    useEffect(() => {
        if (data?.user) {
            setUser(data.user);
        }
    }, [data]);

    const UpdateProfile = async () => {
        if (!session) return;
        try {
            await fetch(`http://localhost:8000/api/desc/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.user.token}`,
                },
                body: JSON.stringify({
                    name: user?.name,
                    email: user?.email,
                    phoneNumber: user?.phoneNumber,
                }),
            })
                .then((response) => {
                    if (!response.ok) return;
                    toast.success("Successfully updated Profile");
                    queryClient.invalidateQueries({
                        queryKey: ["userProfile"],
                    });
                })
                .catch((error) => {
                    toast.error(`Error Uploading Profile ${error}`);
                });
        } catch (error) {
            toast.error(`Error Updating Profile ${error}`);
        }
    };

    const UpdateProfilePic = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!session) return;
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append("profilePic", file);
            await fetch(`http://localhost:8000/api/desc/profile/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session.user.token}`,
                },
                body: formData,
            })
                .then((response) => {
                    if (!response.ok) {
                        toast.error(
                            `We've encountered a Problem ,
                            ${response.statusText}`
                        );
                        return;
                    }
                    toast.success("Updated Profile Picture");
                    return response.json();
                })
                .then((data) => {
                    setUser((prevUser) =>
                        prevUser
                            ? { ...prevUser, image: { url: data.profilePic } }
                            : prevUser
                    );
                    queryClient.invalidateQueries({
                        queryKey: ["userProfile"],
                    });
                })
                .catch((error) => {
                    console.error("Error Updating Profile Picture ", error);
                });
        }
    };

    const handleFieldChange = (field: keyof userProps, value: string) => {
        if (user) {
            setUser((prev) => (prev ? { ...prev, [field]: value } : prev));
        }
    };

    return (
        <div className="flex flex-row md:flex-row h-auto bg-[#F5F5F5] p-6">
            {/* Left Section */}
            <div className="md:w-1/4 flex flex-col items-center gap-6 p-6 bg-white rounded-lg shadow-lg">
                <Avatar
                    src={user?.image?.url || "default-profile.png"}
                    alt="Profile Picture"
                    sx={{ width: 180, height: 180 }}
                    className="shadow-md border-4 border-gray-300"
                    onClick={() => {
                        inputRef.current?.click();
                    }}
                />
                <input
                    className="hidden"
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => UpdateProfilePic(e)}
                />

                {/* Stats Section */}
                <div className="w-full flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        <StatCard label="Level" value={user?.level} />
                        <StatCard label="XP" value={user?.xp} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <StatCard label="Streak" value={user?.streakCount} />
                        <StatCard
                            label="Aura Points"
                            value={user?.auraPoints}
                        />
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="md:w-3/4 flex flex-col items-center md:pl-8">
                <div className="shadow-md rounded-lg bg-white w-full p-6 flex flex-col items-center mb-6">
                    <Typography
                        variant="h4"
                        className="mb-6 font-semibold text-gray-800 capitalize"
                    >
                        Welcome Back, {user?.name} 👋
                    </Typography>

                    <div className="space-y-4 max-w-3xl w-full">
                        <CustomInputField
                            label="Name"
                            value={user?.name ?? ""}
                            onChange={(newValue) =>
                                handleFieldChange("name", newValue)
                            }
                        />
                        <CustomInputField
                            label="Email"
                            value={user?.email ?? ""}
                            onChange={() => {}}
                        />
                        <CustomInputField
                            label="Phone Number"
                            value={user?.phoneNumber ?? ""}
                            onChange={(newValue) =>
                                handleFieldChange("phoneNumber", newValue)
                            }
                        />
                    </div>
                    <button
                        className={`mt-6 px-6 py-3 text-white font-semibold rounded-lg shadow-md transition ${
                            user
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!user}
                        onClick={() => UpdateProfile()}
                    >
                        Save Changes
                    </button>
                </div>

                <div className="w-full shadow-md rounded-lg bg-white p-6">
                    <BadgeCarousel images={user ? user.unlockedBadges : []} />
                </div>
            </div>
        </div>
    );
};

// **Reusable Stats Card Component**
const StatCard = ({ label, value }: { label: string; value?: number }) => (
    <Card className="!bg-darkbg text-white p-5 text-center shadow-md rounded-md">
        <Typography
            variant="body2"
            color="gray"
            className="uppercase tracking-wide"
        >
            {label}
        </Typography>
        <Typography variant="h5" className="text-white font-semibold">
            {value ?? "--"}
        </Typography>
    </Card>
);

export default ProfilePage;
