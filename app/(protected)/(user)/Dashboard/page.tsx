import React, { Suspense } from "react";
import DeadlinesList from "@/components/deadlines";
import AttendancePieChart from "@/components/AttendancePieChart";
import GoalTable from "@/components/goalview";
import FocusRadarChart from "@/components/Dashboard/pomoradarchart";
import SubjectTimeBarChart from "@/components/Dashboard/subjecttimechart";
import Leaderboard from "@/components/leaderboard";
import LevelProgressContainer from "@/components/Dashboard/LevelProgressContainer";
import { cookies } from "next/headers";

const getProfile = async (token: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch profile");
            return res.json();
        })
        .catch((err) => {
            console.error("Error fetching Profile Data:", err);
            return null;
        });
};

const getFocusData = async (token: string, userid: string) => {
    return fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/pomodoro/fetchuseranalytics/${userid}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    )
        .then((res) => {
            if (!res.ok) {
                return null;
            }
            return res.json();
        })
        .then((data) => {
            return data?.focusdata?.focusSessionData ?? [];
        })
        .catch((err) => {
            console.error("Error fetching focus analytics:", err);
            return null;
        });
};

const fetchAttendanceData = async (token: string, userID: string) => {
    return fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/attendance/breakdown/${userID}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    )
        .then((res) => {
            if (!res.ok) return null;
            return res.json();
        })
        .then((data) => {
            return data?.attendanceByCourse || [];
        })
        .catch((err) => {
            console.error(err);
            return null;
        });
};

const getLeaderboard = async (token: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_URL}/api/data/top-10-aura`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        method: "GET",
    })
        .then((res) => {
            if (!res.ok) return null;
            return res.json();
        })
        .then((data) => {
            const updatedUsers =
                data?.users.map((user: any) => ({
                    ...user,
                    name: user.name || `User(${user._id})`,
                    level: user.level || 0,
                })) || [];
            return updatedUsers;
        })
        .catch((err) => {
            console.error(err);
            return null;
        });
};

const fetchDeadlines = async (token: string, userID: string) => {
    return fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/users/${userID}/deadlines`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .then((res) => {
            if (!res.ok) return null;
            return res.json();
        })
        .then((data) => {
            const formattedDeadlines = data.deadlines.map((deadline: any) => ({
                id:
                    deadline.id ||
                    `${deadline.assignmentTitle}-${deadline.dueDate}`,
                name: deadline.assignmentTitle,
                date: deadline.dueDate,
                course: deadline.courseName,
            }));
            formattedDeadlines.sort((a: Deadline, b: Deadline) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            });
            return formattedDeadlines;
        })
        .catch((err) => {
            console.error("Error getting Leaderboard Details");
        });
};

const fetchGoals = async (token: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_URL}/api/goals/`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => {
            if (!res.ok) return null;
            return res.json();
        })
        .then((data) => {
            const formattedGoals = data.map((goal: any) => ({
                _id: goal._id,
                name: goal.title,
                endDate: goal.dueDate,
            }));
            formattedGoals.sort(
                (a: Goal, b: Goal) =>
                    new Date(b.endDate).getTime() -
                    new Date(a.endDate).getTime()
            );
            return formattedGoals;
        });
};

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const session = JSON.parse(cookieStore.get("session")?.value || "");
    const profile = await getProfile(session.user.token);
    const focusData = await getFocusData(session.user.token, session.user.id);
    const attendanceData = await fetchAttendanceData(
        session.user.token,
        session.user.id
    );
    const leaderboardData = await getLeaderboard(session.user.token);
    const deadlines = await fetchDeadlines(session.user.token, session.user.id);
    const goalsData = await fetchGoals(session.user.token);

    return (
        <div className="bg-c2 min-h-full">
            <div
                style={{
                    maxWidth: "1600px",
                    margin: "0 auto",
                    padding: "20px",
                }}
            >
                {/* Top Row: LevelProgress (with Aura Points card) and AttendancePieChart */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "20px",
                    }}
                >
                    {/* Left container with LevelProgress and Aura Points */}
                    <Suspense>
                        <div
                            style={{
                                flex: 1,
                                marginRight: "20px",
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "#896EFB",
                                padding: "20px",
                                borderRadius: "8px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                color: "white",
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <LevelProgressContainer
                                    level={profile.level}
                                    xp={profile.xp}
                                />
                            </div>
                            <div
                                style={{
                                    width: "200px",
                                    marginLeft: "20px",
                                    backgroundColor: "#A18BFC",
                                    padding: "20px",
                                    borderRadius: "8px",
                                    textAlign: "center",
                                    color: "white",
                                }}
                            >
                                <h3
                                    style={{
                                        margin: "0 0 10px",
                                        fontSize: "16px",
                                    }}
                                >
                                    Aura Points
                                </h3>
                                <p style={{ fontSize: "20px", margin: 0 }}>
                                    {profile.auraPoints}
                                </p>
                            </div>
                        </div>
                    </Suspense>
                    {/* Right container with AttendancePieChart */}
                    <div style={{ flex: 1, marginLeft: "20px" }}>
                        <Suspense>
                            <AttendancePieChart
                                attendanceData={attendanceData}
                            />
                        </Suspense>
                    </div>
                </div>

                {/* Second Row: Leaderboard, DeadlinesList, and GoalTable */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "20px",
                        alignItems: "flex-start",
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            backgroundColor: "#001D3D",
                            padding: "20px",
                            borderRadius: "8px",
                        }}
                    >
                        <Suspense>
                            <Leaderboard
                                leaderboardEntries={leaderboardData}
                                userId={session.user.id}
                            />
                        </Suspense>
                    </div>
                    <div
                        style={{
                            flex: 1,
                            backgroundColor: "#001D3D",
                            padding: "20px",
                            borderRadius: "8px",
                        }}
                    >
                        <Suspense>
                            <DeadlinesList deadlines={deadlines} />
                        </Suspense>
                    </div>
                    <div
                        style={{
                            flex: 1,
                            backgroundColor: "#001D3D",
                            padding: "20px",
                            borderRadius: "8px",
                        }}
                    >
                        <Suspense>
                            <GoalTable
                                goalsData={goalsData}
                                token={session.user.token}
                            />
                        </Suspense>
                    </div>
                </div>

                {/* Third Row: Analytics - Render only if focusData exists */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20px",
                        gap: "20px",
                    }}
                >
                    <div
                        style={{
                            width: "600px",
                            backgroundColor: "#001D3D",
                            padding: "20px",
                            borderRadius: "8px",
                        }}
                    >
                        <Suspense>
                            <FocusRadarChart data={focusData} />
                        </Suspense>
                    </div>
                    <div
                        style={{
                            width: "600px",
                            backgroundColor: "#001D3D",
                            padding: "20px",
                            borderRadius: "8px",
                        }}
                    >
                        <Suspense>
                            <SubjectTimeBarChart data={focusData} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
