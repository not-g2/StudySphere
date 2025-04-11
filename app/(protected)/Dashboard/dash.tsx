// "use client";

// export const dynamic = "force-dynamic";
// export const fetchCache = "force-no-store";

// import React, { useState, useEffect } from "react";
// import dynamicc from "next/dynamic";
// import { useRouter } from "next/navigation";
// import useSessionCheck from "../../hooks/auth";
// import { Session } from "@/types/session";

// // Dynamically import components that shouldn’t be server‑side rendered.
// const DeadlinesList = dynamicc(() => import("@/components/deadlines"), { ssr: false });
// const AttendancePieChart = dynamicc(() => import("@/components/AttendancePieChart"), { ssr: false });
// const GoalTable = dynamicc(() => import("@/components/goalview"), { ssr: false });
// const FocusRadarChart = dynamicc(() => import("@/components/Dashboard/pomoradarchart"), { ssr: false });
// const SubjectTimeBarChart = dynamicc(() => import("@/components/Dashboard/subjecttimechart"), { ssr: false });
// const Leaderboard = dynamicc(() => import("@/components/leaderboard"), { ssr: false });
// const LevelProgress = dynamicc(() => import("@/components/XPchart"), { ssr: false });

// function DashboardPage() {
//     const [session, setSession] = useState<Session | null>(null);
//     const [profile, setProfile] = useState({ xp: 0, level: 0, auraPoints: 0 });
//     const [focusData, setFocusData] = useState([]);
//     const router = useRouter();

//     // Use custom hook for session checking.
//     useSessionCheck(setSession);

//     useEffect(() => {
//         if (session && typeof window !== "undefined") {
//             fetch("http://localhost:8000/api/users/profile", {
//                 headers: { Authorization: `Bearer ${session.user.token}` },
//             })
//                 .then((res) => res.json())
//                 .then((data) =>
//                     setProfile({
//                         xp: data.xp,
//                         level: data.level,
//                         auraPoints: data.auraPoints,
//                     })
//                 )
//                 .catch((err) => console.error("Error fetching profile:", err));

//             fetch(`http://localhost:8000/api/pomodoro/fetchuseranalytics/${session.user.id}`, {
//                 headers: { Authorization: `Bearer ${session.user.token}` },
//             })
//                 .then((res) => res.json())
//                 .then((data) => {
//                     if (data.focusdata && data.focusdata.focusSessionData) {
//                         setFocusData(data.focusdata.focusSessionData);
//                     }
//                 })
//                 .catch((err) =>
//                     console.error("Error fetching focus analytics:", err)
//                 );
//         }
//     }, [session]);

//     return (
//         <div style={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
//             <div
//                 style={{
//                     maxWidth: "1600px",
//                     margin: "0 auto",
//                     padding: "20px",
//                 }}
//             >
//                 {/* Top Row: LevelProgress (with Aura Points card) and AttendancePieChart */}
//                 <div
//                     style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         marginBottom: "20px",
//                     }}
//                 >
//                     <div
//                         style={{
//                             flex: 1,
//                             marginRight: "20px",
//                             display: "flex",
//                             alignItems: "center",
//                             backgroundColor: "#896EFB",
//                             padding: "20px",
//                             borderRadius: "8px",
//                             boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                             color: "white",
//                         }}
//                     >
//                         <div style={{ flex: 1 }}>
//                             <LevelProgress level={profile.level} xp={profile.xp} />
//                         </div>
//                         <div
//                             style={{
//                                 width: "200px",
//                                 marginLeft: "20px",
//                                 backgroundColor: "#A18BFC",
//                                 padding: "20px",
//                                 borderRadius: "8px",
//                                 textAlign: "center",
//                                 color: "white",
//                             }}
//                         >
//                             <h3 style={{ margin: "0 0 10px", fontSize: "16px" }}>
//                                 Aura Points
//                             </h3>
//                             <p style={{ fontSize: "20px", margin: 0 }}>
//                                 {profile.auraPoints}
//                             </p>
//                         </div>
//                     </div>
//                     <div style={{ flex: 1, marginLeft: "20px" }}>
//                         <AttendancePieChart />
//                     </div>
//                 </div>

//                 {/* Second Row: Leaderboard, DeadlinesList, and GoalTable */}
//                 <div
//                     style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         gap: "20px",
//                         alignItems: "flex-start",
//                     }}
//                 >
//                     <div
//                         style={{
//                             flex: 1,
//                             backgroundColor: "#FFFFFF",
//                             padding: "20px",
//                             borderRadius: "8px",
//                         }}
//                     >
//                         <Leaderboard session={session} />
//                     </div>
//                     <div
//                         style={{
//                             flex: 1,
//                             backgroundColor: "#FFFFFF",
//                             padding: "20px",
//                             borderRadius: "8px",
//                         }}
//                     >
//                         <DeadlinesList />
//                     </div>
//                     <div
//                         style={{
//                             flex: 1,
//                             backgroundColor: "#FFFFFF",
//                             padding: "20px",
//                             borderRadius: "8px",
//                         }}
//                     >
//                         <GoalTable />
//                     </div>
//                 </div>

//                 {/* Third Row: Analytics - Radar Chart and Bar Chart side by side */}
//                 <div
//                     style={{
//                         display: "flex",
//                         justifyContent: "center",
//                         marginTop: "20px",
//                         gap: "20px",
//                     }}
//                 >
//                     <div
//                         style={{
//                             width: "600px",
//                             backgroundColor: "#FFFFFF",
//                             padding: "20px",
//                             borderRadius: "8px",
//                         }}
//                     >
//                         {focusData.length > 0 ? (
//                             <FocusRadarChart data={focusData} />
//                         ) : (
//                             <p>Loading focus analytics...</p>
//                         )}
//                     </div>
//                     <div
//                         style={{
//                             width: "600px",
//                             backgroundColor: "#F3F3F4",
//                             padding: "20px",
//                             borderRadius: "8px",
//                         }}
//                     >
//                         {focusData.length > 0 ? (
//                             <SubjectTimeBarChart data={focusData} />
//                         ) : (
//                             <p>Loading focus analytics...</p>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default dynamicc(() => Promise.resolve(DashboardPage), { ssr: false });
"use client";
import React from "react";

const dash = () => {
    return <div>dash</div>;
};

export default dash;
