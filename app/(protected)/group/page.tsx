// app/(protected)/groups/page.tsx (or wherever your dashboard lives)
"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Skeleton,
} from "@mui/material";
import { keyframes } from "@mui/system";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import useSessionCheck from "../../hooks/auth";
import GroupCodePopup from "@/components/Group/GroupCodePopup";
import CreateGroupPopup from "@/components/Group/CreateGroupPopup";

type Session = {
  user: { id: string; token: string };
  email: string;
  isAdmin: boolean;
};

interface Group {
  _id: string;
  name: string;
}

// Fade-in-up animation
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// Same gradients array as Courses page
const gradients = [
  "linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%)",
  "linear-gradient(135deg, #74ebd5 0%, #acb6e5 100%)",
  "linear-gradient(135deg, #c0c0aa 0%, #1cefff 100%)",
  "linear-gradient(135deg, #7f7fd5 0%, #86a8e7 50%, #91eae4 100%)",
  "linear-gradient(135deg, #1c92d2 0%, #f2fcfe 100%)",
];

interface GroupCardProps {
  group: Group;
  index: number;
  onClick: (id: string) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, index, onClick }) => {
  const bg = gradients[index % gradients.length];
  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      display="flex"
      justifyContent="center"
    >
      <Card
        onClick={() => onClick(group._id)}
        sx={{
          width: "100%",
          height: 200,
          cursor: "pointer",
          background: bg,
          opacity: 0,
          animation: `${fadeInUp} 0.5s ease forwards`,
          animationDelay: `${index * 0.2}s`,
        }}
      >
        <CardContent
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "black", textAlign: "center" }}
          >
            {group.name}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

const GroupsDashboard: React.FC = () => {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [openJoin, setOpenJoin] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  useSessionCheck(setSession);

  // fetchGroups pulled out so we can call it whenever we actually join/create
  const fetchGroups = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/groups/allusergrps`,
        {
          headers: { Authorization: `Bearer ${session.user.token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setGroups(data.usergrp);
      }
    } catch (err) {
      console.error("Error fetching groups:", err);
    } finally {
      setLoading(false);
    }
  }, [session]);

  // only run on mount / when session becomes available
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleGroupClick = (id: string) => {
    router.push(`/group/${id}`);
  };

  const handleJoin = async (code: string) => {
    if (!session) return;
    setOpenJoin(false);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/groups/joingroup/${code}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );
      if (res.ok) {
        await fetchGroups(); // refresh after join
      }
    } catch (err) {
      console.error("Error joining group:", err);
    }
  };

  const handleCreate = async (name: string) => {
    if (!session) return;
    setOpenCreate(false);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/groups/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
          body: JSON.stringify({ name }),
        }
      );
      if (res.ok) {
        await fetchGroups(); // refresh after create
      }
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen">
      <Box
        className="bg-gray-200 text-black p-4 flex flex-col items-start"
        sx={{ width: "100vw" }}
      >
        {/* Header */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100%", px: 4, mb: 4 }}
        >
          <Typography variant="h4" sx={{ m: 0, lineHeight: 1.2 }}>
            Your Groups
          </Typography>
          <Box>
            <Button variant="contained" sx={{ mr: 2 }} onClick={() => setOpenJoin(true)}>
              Join Group
            </Button>
            <IconButton
              onClick={() => setOpenCreate(true)}
              sx={{
                bgcolor: "secondary.main",
                color: "white",
                "&:hover": { bgcolor: "secondary.dark" },
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Cards / Skeletons */}
        <Grid container spacing={4} sx={{ flexGrow: 1, px: 4 }}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Grid
                  key={i}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  display="flex"
                  justifyContent="center"
                >
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={200}
                    animation="wave"
                  />
                </Grid>
              ))
            : groups.map((g, idx) => (
                <GroupCard
                  key={g._id}
                  group={g}
                  index={idx}
                  onClick={handleGroupClick}
                />
              ))}
        </Grid>

        {/* Popups */}
        <GroupCodePopup
          open={openJoin}
          handleClose={() => setOpenJoin(false)}
          onJoinGroup={handleJoin}
        />
        <CreateGroupPopup
          open={openCreate}
          handleClose={() => setOpenCreate(false)}
          onCreateGroup={handleCreate}
        />
      </Box>
    </div>
  );
};

export default GroupsDashboard;
